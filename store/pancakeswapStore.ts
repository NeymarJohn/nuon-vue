import Web3 from "web3";
import BigNumber from "bignumber.js";
import chunk from "lodash.chunk";
import { Interface } from "@ethersproject/abi";
import { AbiItem } from "web3-utils";
import { GetterTree, ActionTree, MutationTree } from "vuex";
import { Web3State } from "./web3Store";
import getFarmsPrices from "~/utils/pancakeswap/farmDataHelpers";
import erc20ABI from "~/store/abi/pancakeswap/erc20.json";
import farmsConfig from "~/constants/pancakeswap/farms";
import MulticallABI from "~/store/abi/pancakeswap/Multicall.json";
import MasterchefABI from "~/store/abi/pancakeswap/Masterchef.json";
import { Call, SerializedFarm } from "~/constants/pancakeswap/types";
import { BIG_ZERO, BIG_TWO, BIG_TEN } from "~/utils/pancakeswap/helpers";
import { getAddress, getMasterChefAddress, getMulticallAddress } from "~/utils/pancakeswap/addressHelpers";

type StateType = {
	farmsPublicData: any,
	farmsUserData: any,
	pids: any,
}

export const state = (): StateType => ({
	farmsPublicData: [],
	farmsUserData: [],
	pids: [],
});

export type PancakeSwapStore = ReturnType<typeof state>;

export const mutations: MutationTree<PancakeSwapStore> = {
	setFarmsPublicData(state, payload) {
		state.farmsPublicData = payload;
	},
	setFarmsUserData(state, payload) {
		state.farmsUserData = payload;
	}
};

export const actions: ActionTree<PancakeSwapStore, PancakeSwapStore> = {
	initialize(ctx:any) {
		ctx.dispatch("pollFarmsWithUserData");
	},

	async multiCall(ctx: any, { abi, calls }) {
		const multi = ctx.getters.multiCallContract;
		const itf = new Interface(abi);

		const calldata = calls.map((call: any) => {
			return {
				target: call.address.toLowerCase(),
				callData: itf.encodeFunctionData(call.name, call.params)
			};
		});

		const { returnData } = await multi.methods.aggregate(calldata).call();
		const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call));

		return res;
	},

	/**
	 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
	 *
	 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
	 * 2. The return includes a boolean whether the call was successful e.g. [wasSuccessful, callResult]
	 */
	 async multicallv2(ctx: any, {abi, calls, options}): Promise<any> { // abi: any[], calls: Call[], options?:MulticallOptions
		const { requireSuccess = true } = options || {};
		const multi = ctx.getters.multiCallContract;
		const itf = new Interface(abi);

		const calldata = calls.map((call: Call) => {
			return {
				target: call.address.toLowerCase(),
				callData: itf.encodeFunctionData(call.name, call.params),
			};
		});

		const returnData = await multi.methods.tryAggregate(requireSuccess, calldata).call();
		const res = returnData.map((call: any, i: number) => {
			const [result, data] = call;
			return result ? itf.decodeFunctionResult(calls[i].name, data) : null;
		});

		return res as any;
	},

	fetchFarmCalls(_ctx: any, {farm}) { // farm: SerializedFarm
		const { lpAddresses, token, quoteToken } = farm;
		const lpAddress = getAddress(lpAddresses);
		return [
			// Balance of token in the LP contract
			{
				address: token.address,
				name: "balanceOf",
				params: [lpAddress],
			},
			// Balance of quote token on LP contract
			{
				address: quoteToken.address,
				name: "balanceOf",
				params: [lpAddress],
			},
			// Balance of LP tokens in the master chef contract
			{
				address: lpAddress,
				name: "balanceOf",
				params: [getMasterChefAddress()],
			},
			// Total supply of LP tokens
			{
				address: lpAddress,
				name: "totalSupply",
			},
			// Token decimals
			{
				address: token.address,
				name: "decimals",
			},
			// Quote token decimals
			{
				address: quoteToken.address,
				name: "decimals",
			},
		];
	},

	async fetchPublicFarmsData(ctx: any, {farms}): Promise<any[]> { // farms: SerializedFarmConfig[]
		const farmCalls = (
			await Promise.all(farms.map((farm: SerializedFarm) => ctx.dispatch("fetchFarmCalls", {farm})))
		).flat();

		const chunkSize = farmCalls.length / farms.length;
		const farmMultiCallResult = await ctx.dispatch("multicallv2", {abi: erc20ABI, calls: farmCalls});
		return chunk(farmMultiCallResult, chunkSize);
	},

	masterChefFarmCalls(_ctx, {farm}) { // farm: SerializedFarm
		const { pid } = farm;
		return pid || pid === 0
			? [
				{
					address: getMasterChefAddress(),
					name: "poolInfo",
					params: [pid],
				},
				{
					address: getMasterChefAddress(),
					name: "totalRegularAllocPoint",
				},
			]
			: [null, null];
	},

	async fetchMasterChefData(ctx: any, {farms}): Promise<any[]> { // farms: : SerializedFarmConfig[]
		const masterChefCalls = await Promise.all(farms.map((farm: SerializedFarm) => ctx.dispatch("masterChefFarmCalls", {farm})));
		const chunkSize = masterChefCalls.flat().length / farms.length;
		const masterChefAggregatedCalls = masterChefCalls
			.filter((masterChefCall: any) => masterChefCall[0] !== null && masterChefCall[1] !== null)
			.flat();

		const masterChefMultiCallResult = await ctx.dispatch("multicallv2", {abi: MasterchefABI, calls: masterChefAggregatedCalls});
		const masterChefChunkedResultRaw = chunk(masterChefMultiCallResult, chunkSize);
		let masterChefChunkedResultCounter = 0;
		return masterChefCalls.map((masterChefCall: any) => {
			if (masterChefCall[0] === null && masterChefCall[1] === null) {
				return [null, null];
			}
			const data = masterChefChunkedResultRaw[masterChefChunkedResultCounter];
			masterChefChunkedResultCounter++;
			return data;
		});
	},

	async fetchFarms(ctx: any, {farmsToFetch}): Promise<SerializedFarm[]> { // farmsToFetch: SerializedFarmConfig[]
		const [farmResult, masterChefResult] = await Promise.all([
			ctx.dispatch("fetchPublicFarmsData", {farms: farmsToFetch}),
			ctx.dispatch("fetchMasterChefData", {farms: farmsToFetch}),
		]);

		return farmsToFetch.map((farm: SerializedFarm, index: number) => {
			const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
				farmResult[index];

			const [info, totalRegularAllocPoint] = masterChefResult[index];

			// Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
			const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply));

			// Raw amount of token in the LP, including those not staked
			const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals));
			const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals));

			// Amount of quoteToken in the LP that are staked in the MC
			const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio);

			// Total staked in LP, in quote token value
			const lpTotalInQuoteToken = quoteTokenAmountMc.times(BIG_TWO);

			const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO;
			const poolWeight = totalRegularAllocPoint ? allocPoint.div(new BigNumber(totalRegularAllocPoint)) : BIG_ZERO;

			return {
				...farm,
				token: farm.token,
				quoteToken: farm.quoteToken,
				tokenAmountTotal: tokenAmountTotal.toJSON(),
				quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
				lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
				lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
				tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
				poolWeight: poolWeight.toJSON(),
				multiplier: `${allocPoint.div(100).toString()}X`,
			};
		});
	},

	async fetchFarmsPublicDataAsync(ctx: any, {pids}) {
		const masterChefAddress = getMasterChefAddress();
		const calls = [
			{
				address: masterChefAddress,
				name: "poolLength",
			},
			{
				address: masterChefAddress,
				name: "cakePerBlock",
				params: [true],
			},
		];
		const [[poolLength], [cakePerBlockRaw]] = await ctx.dispatch("multiCall", {abi: MasterchefABI, calls});

		const regularCakePerBlock = new BigNumber(new BigNumber(cakePerBlockRaw.toString())).dividedBy(BIG_TEN.pow(18));
		const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid));
		const farmsCanFetch = farmsToFetch.filter((f) => poolLength.gt(f.pid));

		const farms = await ctx.dispatch("fetchFarms", {farmsToFetch: farmsCanFetch});
		const farmsWithPrices = getFarmsPrices(farms);

		return [farmsWithPrices, poolLength.toNumber(), regularCakePerBlock.toNumber()];
	},

	async fetchFarmUserAllowances(ctx: any, {account, farmsToFetch}) { // account: string, farmsToFetch: SerializedFarmConfig[]
		const masterChefAddress = getMasterChefAddress();

		const calls = farmsToFetch.map((farm: SerializedFarm) => {
			const lpContractAddress = getAddress(farm.lpAddresses);
			return { address: lpContractAddress, name: "allowance", params: [account, masterChefAddress] };
		});

		const rawLpAllowances = await ctx.dispatch("multiCall", {abi: erc20ABI, calls});
		const parsedLpAllowances = rawLpAllowances.map((lpBalance: any) => {
			return new BigNumber(lpBalance).toJSON();
		});
		return parsedLpAllowances;
	},

	async fetchFarmUserTokenBalances(ctx: any, {account, farmsToFetch}) { // account: string, farmsToFetch: SerializedFarmConfig[]
		const calls = farmsToFetch.map((farm: SerializedFarm) => {
			const lpContractAddress = getAddress(farm.lpAddresses);
			return {
				address: lpContractAddress,
				name: "balanceOf",
				params: [account],
			};
		});

		const rawTokenBalances = await ctx.dispatch("multiCall", {abi: erc20ABI, calls});
		const parsedTokenBalances = rawTokenBalances.map((tokenBalance: any) => {
			return new BigNumber(tokenBalance).toJSON();
		});
		return parsedTokenBalances;
	},

	async fetchFarmUserStakedBalances(ctx: any, {account, farmsToFetch}) { // account: string, farmsToFetch: SerializedFarmConfig[]
		const masterChefAddress = getMasterChefAddress();

		const calls = farmsToFetch.map((farm: SerializedFarm) => {
			return {
				address: masterChefAddress,
				name: "userInfo",
				params: [farm.pid, account],
			};
		});

		const rawStakedBalances = await ctx.dispatch("multiCall", {abi: MasterchefABI, calls});
		const parsedStakedBalances = rawStakedBalances.map((stakedBalance: any) => {
			return new BigNumber(stakedBalance[0]._hex).toJSON();
		});
		return parsedStakedBalances;
	},

	async fetchFarmUserEarnings(ctx: any, {account, farmsToFetch}) { // account: string, farmsToFetch: SerializedFarmConfig[]
		const masterChefAddress = getMasterChefAddress();

		const calls = farmsToFetch.map((farm: SerializedFarm) => {
			return {
				address: masterChefAddress,
				name: "pendingCake",
				params: [farm.pid, account],
			};
		});

		const rawEarnings = await ctx.dispatch("multiCall", {abi: MasterchefABI, calls});
		const parsedEarnings = rawEarnings.map((earnings: any) => {
			return new BigNumber(earnings).toJSON();
		});
		return parsedEarnings;
	},

	async fetchFarmUserDataAsync(ctx: any, {account, pids}) {
		const poolLength = await ctx.getters.getMasterChefContractPoolLength();
		const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid));
		const farmsCanFetch = farmsToFetch.filter((f) => poolLength > f.pid);
		const [userFarmAllowances, userFarmTokenBalances, userStakedBalances, userFarmEarnings] = await Promise.all([
			ctx.dispatch("fetchFarmUserAllowances", {account, farmsToFetch: farmsCanFetch}),
			ctx.dispatch("fetchFarmUserTokenBalances", {account, farmsToFetch: farmsCanFetch}),
			ctx.dispatch("fetchFarmUserStakedBalances", {account, farmsToFetch: farmsCanFetch}),
			ctx.dispatch("fetchFarmUserEarnings", {account, farmsToFetch: farmsCanFetch}),
		]);

		return userFarmAllowances.map((_: any, index: number) => {
			return {
				pid: farmsCanFetch[index].pid,
				allowance: userFarmAllowances[index],
				tokenBalance: userFarmTokenBalances[index],
				stakedBalance: userStakedBalances[index],
				earnings: userFarmEarnings[index],
			};
		});
	},

	async pollFarmsWithUserData(ctx: any) {
		const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid);

		const farmsPublicData = await ctx.dispatch("fetchFarmsPublicDataAsync", {pids});
		ctx.commit("setFarmsPublicData", farmsPublicData);
		const account = ctx.rootGetters["web3Store/account"];
		if (!account) return;

		if (account) {
			const farmsUserData = await ctx.dispatch("fetchFarmUserDataAsync", {account, pids});
			ctx.commit("setFarmsUserData", farmsUserData);
		}
	}
};

export const getters: GetterTree<PancakeSwapStore, Web3State> = {
	multiCallContract: (_state: any, _getters: any, _store: any) => {
		const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.ninicoin.io"));
		return new web3.eth.Contract(MulticallABI as AbiItem[], getMulticallAddress());
	},
	masterChefContract: (_state: any, _getters: any, _store: any) => {
		const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.ninicoin.io"));
		return new web3.eth.Contract(MasterchefABI as AbiItem[], getMasterChefAddress());
	},
	getMasterChefContractPoolLength: (_state: any, getters: any, _store: any) => async () => {
		return await getters.masterChefContract.methods.poolLength().call();
	}
};
