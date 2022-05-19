import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { GetterTree, ActionTree, MutationTree } from "vuex";
import { Web3State } from "./web3Store";
import { getMasterChefAddress, getMulticallAddress } from "~/utils/pancakeswap/addressHelpers";
// import { fromWei } from "~/utils/bnTools";
import farmsConfig from "~/constants/pancakeswap/farms";
import MulticallABI from "~/store/abi/pancakeswap/Multicall.json";
import MasterchefABI from "~/store/abi/pancakeswap/Masterchef.json";

type StateType = {
	farms: any,
	pids: any,
}

export const state = (): StateType => ({
	farms: [],
	pids: [],
});

export type PancakeSwapStore = ReturnType<typeof state>;

export const mutations: MutationTree<PancakeSwapStore> = {

};

export const actions: ActionTree<PancakeSwapStore, PancakeSwapStore> = {
	initialize(_ctx:any) {
		// ctx.dispatch("updateStatus");
		// ctx.dispatch("pollFarmsWithUserData");
	},

	// async updateStatus({dispatch, getters, commit}) {

	// },

	async multiCall(ctx: any, { _abi, calls }) {
		const multi = ctx.getters.multiCallContract;
		const masterChef = ctx.getters.masterChefContract;

		const calldata = calls.map((call: any) => {
			const method = masterChef.methods[call.name];
			let callData;

			if (call.params && call.params.length > 0) {
				callData = method(call.params).encodeABI();
			} else {
				callData = method().encodeABI();
			}

			return {
				target: call.address.toLowerCase(),
				callData
			};
		});
		const { returnData } = await multi.methods.aggregate(calldata).call();

		const res = returnData.map((result: any) => ctx.rootState.web3Store.instance().eth.abi.decodeParameter("uint256", result));

		return res;
	},

	async fetchFarmsPublicDataAsync(ctx: any, {_pids}) {
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
		const test = await ctx.dispatch("multiCall", {_abi: MasterchefABI, calls});

		return test;
		// const regularCakePerBlock = fromWei(cakePerBlockRaw);
		// const farmsToFetch = farmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid));
		// const farmsCanFetch = farmsToFetch.filter((f) => poolLength.gt(f.pid));

		// const farms = await fetchFarms(farmsCanFetch);
		// const farmsWithPrices = getFarmsPrices(farms);

		// return [farmsWithPrices, poolLength.toNumber(), regularCakePerBlock.toNumber()];
	},

	fetchFarmUserDataAsync(_ctx, {_account, _pids}) {
		// console.log(account, pids);
	},

	async pollFarmsWithUserData(ctx: any) {
		const pids = farmsConfig.map((farmToFetch) => farmToFetch.pid);

		await ctx.dispatch("fetchFarmsPublicDataAsync", {_pids: pids});
		// console.log(test);
		// const account = ctx.rootGetters["web3Store/account"];
		// if (!account) return;

		// if (account) {
		// 	ctx.dispatch("fetchFarmUserDataAsync", {account, pids});
		// }
	}
};

export const getters: GetterTree<PancakeSwapStore, Web3State> = {
	// collateralHubContract: (_state: any, _getters: any, store: any) => {
	// 	const web3 = store.web3Store.instance();
	// 	return new web3.eth.Contract(collateralHubAbi, COLLATERAL_HUB_ADDRESS);
	// },
	multiCallContract: (_state: any, _getters: any, _store: any) => {
		const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.ninicoin.io"));
		return new web3.eth.Contract(MulticallABI as AbiItem[], getMulticallAddress());
	},
	masterChefContract: (_state: any, _getters: any, _store: any) => {
		const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.ninicoin.io"));
		return new web3.eth.Contract(MasterchefABI as AbiItem[], getMasterChefAddress());
	},
};
