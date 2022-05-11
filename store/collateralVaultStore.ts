import { GetterTree, ActionTree, MutationTree } from "vuex";
import BN from "bn.js";
import { Web3State } from "./web3Store";
import collateralHubAbi from "./abi/collateral_hub.json";
import usxControllerAbi from "./abi/usx_controller.json";
import truflationAbi from "./abi/truflation.json";
import { fromWei, toWei } from "~/utils/bnTools";
import { COLLATERAL_HUB_ADDRESS, USX_CONTROLLER_ADDRESS, TRUFLATION_ADDRESS } from "~/constants/addresses";

type StateType = {
	allowance: any,
	targetCollateralValue: number,
	globalCollateralRatioValue: number,
	aprInflation: number,
	aprCollateral: number,
	totalLockedCollateral: number,
	allCollaterals: any,
	userUSXMintedAmount: number,
	mintingFee: 0,
	redeemFee: number,
	inflation: number,
	dailyInflationRate: number,
	userTVL: number,
	userJustMinted: boolean
}
export const state = (): StateType => ({
	allowance: {HX:0, USX: 0},
	targetCollateralValue: 0,
	globalCollateralRatioValue: 0,
	aprInflation: 0,
	aprCollateral: 0,
	totalLockedCollateral: 0,
	allCollaterals: [],
	userUSXMintedAmount: 0,
	mintingFee: 0,
	redeemFee: 0,
	inflation: 0,
	dailyInflationRate: 0,
	userTVL: 0,
	userJustMinted: false
});

export type BoardroomState = ReturnType<typeof state>;

export const mutations: MutationTree<BoardroomState> = {
	setAllowance(state, payload: {HX:number, USX: number}) {
		state.allowance = payload;
	},
	setTargetCollateralValue(state, payload) {
		state.targetCollateralValue = payload;
	},
	setGlobalCollateralRatioValue(state, payload) {
		state.globalCollateralRatioValue = payload;
	},
	setAllCollaterals(state, payload) {
		state.allCollaterals = payload;
	},
	setTotalLockedCollateral(state, payload) {
		state.totalLockedCollateral = payload;
	},
	setUserUSXMintedAmount(state, payload) {
		state.userUSXMintedAmount = payload;
	},
	setMintingFee(state, payload) {
		state.mintingFee = payload;
	},
	setRedeemFee(state, payload) {
		state.redeemFee = payload;
	},
	setInflation(state, payload) {
		state.inflation = payload;
	},
	setDailyInflationRate(state, payload) {
		state.dailyInflationRate = payload;
	},
	setUserTVL(state, payload) {
		state.userTVL = payload;
	},
	setUserJustMinted(state, payload) {
		state.userJustMinted = payload;
	}
};

export const actions: ActionTree<BoardroomState, BoardroomState> = {
	initialize(ctx:any) {
		ctx.dispatch("updateStatus");
	},
	async getAllowance (ctx: any) {
		const address = ctx.rootGetters["web3Store/account"];
		if (!address) return;
		const getUsxAllowance = fromWei(await ctx.rootGetters["erc20Store/usx"].methods.allowance(address, COLLATERAL_HUB_ADDRESS).call());
		const getHydroAllowance = fromWei(await  ctx.rootGetters["erc20Store/hydro"].methods.allowance(address, COLLATERAL_HUB_ADDRESS).call());
		// const getDaiAllowance = fromWei(await  ctx.rootGetters["erc20Store/dai"].methods.allowance(address, COLLATERAL_HUB_ADDRESS).call());
		const getUSDCAllowance = fromWei(await  ctx.rootGetters["erc20Store/usdc"].methods.allowance(address, COLLATERAL_HUB_ADDRESS).call());
		ctx.commit("setAllowance", {HX: getHydroAllowance, USX: getUsxAllowance, USDC: getUSDCAllowance});
	},
	approveToken(ctx: any, {tokenSymbol,  onConfirm, onReject, onCallback}): void {
		const contractAddress = COLLATERAL_HUB_ADDRESS;
		ctx.dispatch("erc20Store/approveToken", {tokenSymbol, contractAddress, onConfirm, onReject, onCallback}, {root:true} )
			.then(() => {
				ctx.dispatch("getAllowance").then(() => {
					if (onCallback) onCallback(null);
				});
			}).catch((err: Error) => {
				if (onCallback) onCallback(err);
			});
	},
	async stake(ctx: any, {amount, onConfirm, onReject}) {
		const accountAddress = ctx.rootState.web3Store.account;
		const weiAmount = toWei(amount);
		return await ctx.getters.contract.methods.stake(weiAmount).send({from: accountAddress})
			.on("transactionHash", () => {
				if (onConfirm) onConfirm();
			})
			.on("error", () => {
				if (onReject) onReject();
			});
	},
	async claimReward(ctx: any, {onConfirm, onReject}) {
		const accountAddress = ctx.rootState.web3Store.account;
		return await ctx.getters.contract.methods.claimReward(
			true,
			"0x000000000000000000000000000000000000dEaD",
			["0x000000000000000000000000000000000000dEaD", "0x000000000000000000000000000000000000dEaD"]
		).send({from: accountAddress})
			.on("transactionHash", () => {
				if (onConfirm) onConfirm();
			})
			.on("error", () => {
				if (onReject) onReject();
			});
	},
	async reward(ctx: any, {amount, onConfirm, onReject}) {
		const accountAddress = ctx.rootState.web3Store.account;
		const weiAmount = toWei(amount);
		return await ctx.getters.contract.methods.reward(weiAmount).send({from: accountAddress})
			.on("transactionHash", () => {
				if (onConfirm) onConfirm();
			})
			.on("error", () => {
				if (onReject) onReject();
			});
	},
	async withdraw(ctx: any, {amount, onConfirm, onReject}) {
		const accountAddress = ctx.rootState.web3Store.account;
		const weiAmount = toWei(amount);
		return await ctx.getters.contract.methods.withdraw(weiAmount).send({from: accountAddress})
			.on("transactionHash", () => {
				if (onConfirm) onConfirm();
			})
			.on("error", () => {
				if (onReject) onReject();
			});
	},
	async claimRewardsAndWithdraw(ctx:any, {onConfirm, onReject}) {
		const accountAddress = ctx.rootState.web3Store.account;
		return await ctx.getters.contract.methods.exit().send({from: accountAddress})
			.on("transactionHash", () => {
				if (onConfirm) onConfirm();
			})
			.on("error", () => {
				if (onReject) onReject();
			});
	},
	getLastSnapshot(ctx: any) {
		const accountAddress = ctx.rootState?.web3Store.account;
		if (!accountAddress) return;
		ctx.getters.contract.methods.getLastSnapshotIndexOf(accountAddress).call().then((lastSnapshot: any) => {
			ctx.commit("setLastSnapshot", {lastSnapshotIndex: lastSnapshot, rewardEarned: new BN(0), epochTimerStart: 0});
		});
	},
	async updateStatus({dispatch, getters, commit}) {
		dispatch("getAllowance");

		const allCollaterals = await getters.getCollaterals();
		commit("setAllCollaterals", allCollaterals);
		// const totalLockedCollateral = await getters.getTotalLockedCollareralValue();
		// commit("setTotalLockedCollateral", totalLockedCollateral);

		const mintingFee = await getters.getMintingFee();
		commit("setMintingFee",  fromWei(mintingFee));
		const redeemFee = await getters.getRedeemFee();
		commit("setRedeemFee", fromWei(redeemFee));

		const inflation = Number(await getters.getInflation());
		commit("setInflation", inflation);

		const dailyInflationRate = Number(await getters.getDailyInflationRate());
		commit("setDailyInflationRate", dailyInflationRate);
	},
	async mint(ctx: any, {amount, cid, onConfirm, onReject}) {
		if (cid === -1) return;
		const accountAddress = ctx.rootState.web3Store.account;
		return await ctx.getters.collateralHubContract.methods.mint(amount, cid).send({from: accountAddress})
			.on("transactionHash", (txHash: string) => {
				if (onConfirm) onConfirm(txHash);
			})
			.on("error", (err: any) => {
				if (onReject) onReject(err);
			});
	},
	async redeem(ctx: any, {usxAmount, cid, onConfirm, onReject}) {
		if (cid === -1) return;
		const accountAddress = ctx.rootState.web3Store.account;
		return await ctx.getters.collateralHubContract.methods.redeem(usxAmount, cid).send({from: accountAddress})
			.on("transactionHash", (txHash: string) => {
				if (onConfirm) onConfirm(txHash);
			})
			.on("error", (err: any) => {
				if (onReject) onReject(err);
			});
	}
};

export const getters: GetterTree<BoardroomState, Web3State> = {
	collateralHubContract: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		return new web3.eth.Contract(collateralHubAbi, COLLATERAL_HUB_ADDRESS);
	},
	libraryContract: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].boardroom;
		return new web3.eth.Contract(collateralHubAbi, addr);
	},
	usxControllerContract:  (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		return new web3.eth.Contract(usxControllerAbi, USX_CONTROLLER_ADDRESS);
	},
	truflationContract: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		return new web3.eth.Contract(truflationAbi, TRUFLATION_ADDRESS);
	},
	checkApprovedToken: (state:any) => (tokenName: string):boolean => {
		return state.allowance[tokenName] > 0;
	},
	getCollaterals: (_state:any, getters: any) => async () => {
		return await getters.collateralHubContract.methods.getCollaterals().call();
	},
	getEstimatedMintedUSXAmount: (_state:any, getters: any) => async (amount: number, cid: string) => {
		return await getters.collateralHubContract.methods.estimateMintedUSXAmount(amount, cid).call();
	},
	getMintingFee: (_state: any, getters: any) => async () => {
		return await getters.usxControllerContract.methods.getMintingFee().call();
	},
	getCollateralPrice: (_state: any, getters: any) => async (tokenAddress: string) => {
		return await getters.collateralHubContract.methods.viewCollateralPrice(tokenAddress).call();
	},
	getUserCollateralInVault: (_state: any, getters: any) => async (address: string, cid: number) => {
		return await getters.collateralHubContract.methods.getUserCollateralInVault(address, cid).call();
	},
	getRedeemFee: (_state: any, getters: any) => async () => {
		return await getters.usxControllerContract.methods.getRedeemFee().call();
	},
	getEstimateCollateralsOut: (_state: any, getters: any) => async (cid: number, userAddress: string, usxAmount: number) => {
		return await getters.collateralHubContract.methods.estimateCollateralsOut(cid, userAddress, usxAmount).call();
	},
	getAmountsStakedInVault: (_state: any, getters: any) => async (cid: number) => {
		return await getters.collateralHubContract.methods.getAmountsStakedInVault(cid).call();
	},
	getInflation: (_state: any, getters: any) => async () => {
		return await getters.truflationContract.methods.inflation().call();
	},
	getDailyInflationRate: (_state: any, getters: any) => async () => {
		return await getters.truflationContract.methods.getDailyInflationRate().call();
	},
	getUserAmounts: (_state: any, getters: any) => async (userAddress: string, cid: number) => {
		return await getters.collateralHubContract.methods.getUsersAmounts(userAddress, cid).call();
	},
	getGlobalCollateralRatio: (_state: any, getters: any) => async () => {
		return await getters.usxControllerContract.methods.getGlobalCollateralRatio().call();
	}
};