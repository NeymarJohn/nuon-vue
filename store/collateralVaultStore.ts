import { GetterTree, ActionTree, MutationTree } from "vuex";
import BN from "bn.js";
import { Web3State } from "./web3Store";
import collateralHubAbi from "./abi/collateral_hub_native.json";
import collateralHubUSDTAbi from "./abi/collateral_hub_usdt.json";
import nuonControllerAbi from "./abi/nuon_controller.json";
import truflationAbi from "./abi/truflation.json";
import boardroomAbi from "./abi/boardroom.json";
import { fromWei, toWei } from "~/utils/bnTools";
import { WETH, USDT } from "~/constants/tokens";

type StateType = {
	allowance: any,
	userCollateralAmount: number,
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
	userJustMinted: boolean,
	currentCollateralToken: string,
	abis: any,
	mintedAmount: any,
	targetPeg: number
}
export const state = (): StateType => ({
	allowance: {HX:0, NUON: 0},
	userCollateralAmount: 0,
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
	userJustMinted: false,
	currentCollateralToken: "WETH",
	abis: {
		WETH: collateralHubAbi,
		USDT: collateralHubUSDTAbi
	},
	mintedAmount: {
		[WETH.symbol] :0,
		[USDT.symbol] :0
	},
	targetPeg: 0
});

export type BoardroomState = ReturnType<typeof state>;

export const mutations: MutationTree<BoardroomState> = {
	setAllowance(state, payload: {HX:number, USX: number}) {
		state.allowance = payload;
	},
	setUserCollateralAmount(state, payload) {
		state.userCollateralAmount = payload;
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
	},
	setCollateralToken(state, payload) {
		state.currentCollateralToken = payload;
	},
	setMintedAmount(state, {token, amount}) {
		state.mintedAmount = {...state.mintedAmount, [token]: amount};
	},
	setTargetPeg(state, payload) {
		state.targetPeg = payload;
	}
};

export const actions: ActionTree<BoardroomState, BoardroomState> = {
	initialize(ctx: any) {
		ctx.dispatch("updateStatus");
	},
	async getAllowance (ctx: any) {
		const address = ctx.rootGetters["web3Store/account"];
		if (!address) return;
		const collateralHubAddress = ctx.rootGetters["addressStore/collateralHubs"][ctx.state.currentCollateralToken];

		const getNuonAllowance = fromWei(await ctx.rootGetters["erc20Store/nuon"].methods.allowance(address, collateralHubAddress).call());
		const getHydroAllowance = fromWei(await ctx.rootGetters["erc20Store/hydro"].methods.allowance(address, collateralHubAddress).call());
		const getUSDTAllowance = fromWei(await ctx.rootGetters["erc20Store/usdt"].methods.allowance(address, collateralHubAddress).call());
		const getWETHAllownace = fromWei(await ctx.rootGetters["erc20Store/weth"].methods.allowance(address, collateralHubAddress).call());
		ctx.commit("setAllowance", {HX: getHydroAllowance, NUON: getNuonAllowance, USDT: getUSDTAllowance, WETH: getWETHAllownace});
	},
	approveToken(ctx: any, {tokenSymbol,  onConfirm, onReject, onCallback}): void {
		const contractAddress = ctx.rootGetters["addressStore/collateralHubs"][ctx.state.currentCollateralToken];

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
	async updateStatus({state, dispatch, commit, getters, rootState, rootGetters}: {state: any, dispatch:any, commit:any, getters:any, rootState:any, rootGetters: any}) {
		dispatch("getAllowance");
		const accountAddress = rootState?.web3Store.account;
		if (!accountAddress) return;

		const myCollateralAmount = await getters.getUserCollateralAmount(accountAddress);
		commit("setUserCollateralAmount", myCollateralAmount);

		const chubAddr = rootGetters["addressStore/collateralHubs"][state.currentCollateralToken];
		const mintingFee = await getters.getMintingFee(chubAddr);
		commit("setMintingFee",  fromWei(mintingFee));
		const redeemFee = await getters.getRedeemFee(chubAddr);
		commit("setRedeemFee", fromWei(redeemFee));

		dispatch("updateMintedAmount", WETH.symbol);
		dispatch("updateMintedAmount", USDT.symbol);

		setInterval(() => {
			dispatch("getTargetPeg");
		},1000);
	},
	async mintNuon(ctx: any, {collateralRatio, collateralAmount, onTxHash, onConfirm, onReject}) {
		const accountAddress = ctx.rootState.web3Store.account;
		const payload: {from: string, value?: string} = {from: accountAddress};
		const args: string[] = [collateralRatio, collateralAmount];

		return await ctx.getters.collateralHubContract.methods.mint.apply(null, args)
			.send(payload)
			.on("transactionHash", (txHash: string) => {
				if (onTxHash) onTxHash(txHash);
			})
			.on("confirmation", (confNumber: any, _receipt: any, _latestBlockHash: any) => {
				if (onConfirm && confNumber === 0) onConfirm(confNumber, _receipt, _latestBlockHash);
			})
			.on("error", (err: any) => {
				if (onReject) onReject(err);
			});
	},
	async redeem(ctx: any, {nuonAmount, onConfirm, onReject}) {
		const accountAddress = ctx.rootState.web3Store.account;
		return await ctx.getters.collateralHubContract.methods.redeem(nuonAmount).send({from: accountAddress})
			.on("confirmation", (confNumber: any, _receipt: any, _latestBlockHash: any) => {
				if (onConfirm && confNumber === 0) onConfirm(confNumber, _receipt, _latestBlockHash);
			})
			.on("error", (err: any) => {
				if (onReject) onReject(err);
			});
	},
	changeCollateral(ctx, token) {
		ctx.commit("setCollateralToken", token);
	},
	async updateMintedAmount(ctx: any, token) {
		const web3 = ctx.rootState.web3Store.instance();
		const addr = ctx.rootGetters["addressStore/collateralHubs"][token];
		const abi = ctx.state.abis[token];
		const chubContract =  new web3.eth.Contract(abi, addr);
		const accountAddress = ctx.rootState.web3Store.account;
		const decimals = ctx.rootState.erc20Store.decimals[token];
		const mintedAmount = fromWei(await chubContract.methods.viewUserMintedAmount(accountAddress).call(), decimals);
		ctx.commit("setMintedAmount",  {token, amount: mintedAmount});
	},
	async getTargetPeg(ctx) {
		const result = await ctx.getters.getTruflationPeg();
		ctx.commit("setTargetPeg", Number(fromWei(result)));
	}
};

export const getters: GetterTree<BoardroomState, Web3State> = {
	collateralHubContract: (state: any, _getters: any, store: any, rootGetters: any) => {
		const web3 = store.web3Store.instance();
		const addr = rootGetters["addressStore/collateralHubs"][state.currentCollateralToken];
		const abi = state.abis[state.currentCollateralToken];
		return new web3.eth.Contract(abi, addr);
	},
	boardroomContract: (_state: any, _getters: any, store: any, rootGetters) => {
		const web3 = store.web3Store.instance();
		const addr = rootGetters["addressStore/addresses"].boardroom;
		return new web3.eth.Contract(boardroomAbi, addr);
	},
	nuonControllerContract:  (_state: any, _getters: any, store: any, rootGetters: any) => {
		const web3 = store.web3Store.instance();
		const addr = rootGetters["addressStore/addresses"].nuonController;
		return new web3.eth.Contract(nuonControllerAbi, addr);
	},
	truflationContract: (_state: any, _getters: any, store: any, rootGetters) => {
		const truffleAddress = rootGetters["addressStore/addresses"].truflation;
		const web3 = store.web3Store.instance();
		return new web3.eth.Contract(truflationAbi, truffleAddress);
	},
	checkApprovedToken: (state:any) => (tokenName: string):boolean => {
		return state.allowance[tokenName] > 0;
	},
	getMintingFee: (_state: any, getters: any) => async (chubAddress: string) => {
		return await getters.nuonControllerContract.methods.getMintingFee(chubAddress).call();
	},
	getRedeemFee: (_state: any, getters: any) => async (chubAddress: string) => {
		return await getters.nuonControllerContract.methods.getRedeemFee(chubAddress).call();
	},
	getAmountsStakedInVault: (_state: any, getters: any) => async () => {
		return await getters.collateralHubContract.methods.totalCollateralInCHUB().call();
	},
	getInflation: (_state: any, getters: any) => async () => {
		return await getters.truflationContract.methods.inflation().call();
	},
	getDailyInflationRate: (_state: any, getters: any) => async () => {
		return await getters.truflationContract.methods.getDailyInflationRate().call();
	}, // old methods end here
	getGlobalCollateralRatio: (_state: any, getters: any) => async () => {
		return await getters.nuonControllerContract.methods.getGlobalCollateralRatio().call();
	},
	getUserCollateralAmount: (_state: any, getters: any) => async (userAddress: string) => {
		return await getters.collateralHubContract.methods.viewUserCollateralAmount(userAddress).call();
	},
	getUserMintedAmount: (_state: any, getters: any) => async (userAddress: string) => {
		return await getters.collateralHubContract.methods.viewUserMintedAmount(userAddress).call();
	},
	getUserIndex: (_state: any, getters: any) => async (userAddress: string) => {
		return await getters.collateralHubContract.methods.getUserIndex(userAddress).call();
	},
	getTruflationPeg: (_state: any, getters: any) => async () => {
		return await getters.nuonControllerContract.methods.getTruflationPeg().call();
	},
	getNuonPrice: (_state: any, getters: any) => async () => {
		return await getters.collateralHubContract.methods.getNUONPrice().call();
	},
	getAllUsers: (_state: any, getters: any) => async () => {
		return await getters.collateralHubContract.methods.getAllUsers().call();
	},
	getCollateralsValue: (_state: any, getters: any) => async () => {
		return await getters.collateralHubContract.methods.getCollateralsValue().call();
	},
	getGlobalCR: (_state: any, getters: any) => async (chubAddress: string) => {
		return await getters.nuonControllerContract.methods.getCollateralRatioInPercent(chubAddress).call();
	},
	getUserCollateralRatioInPercent: (_state: any, getters: any) => async (userAddress: string) => {
		return await getters.collateralHubContract.methods.getUserCollateralRatioInPercent(userAddress).call();
	},
	getCollateralPercentToRatio: (_state: any, getters: any) => async (userAddress: string, _percent: number) => {
		return await getters.collateralHubContract.methods.collateralPercentToRatio(_percent, userAddress).call();
	},
	getUserSupposedCollateralsValue: (_state: any, getters: any) => async (userAddress: string) => {
		return await getters.collateralHubContract.methods.getUserSupposedCollateralsValue(userAddress).call();
	},
	getEstimateMintedNUONAmount: (_state: any, getters: any) => async (collateralAmount: number, _collateralRatio: number) => {
		return await getters.collateralHubContract.methods.estimateMintedNUONAmount(collateralAmount, _collateralRatio).call();
	},
	getCollateralPrice: (_state: any, getters: any) => async () => {
		return await getters.collateralHubContract.methods.getCollateralPrice().call();
	},
	getEstimateCollateralsOut: (_state: any, getters: any) => async (_userAddress: string, nuonAmount: number) => {
		return await getters.collateralHubContract.methods.estimateCollateralsOut(_userAddress, nuonAmount).call();
	},
	getCalcOverCollateralizedMintAmounts: (_state: any, getters: any) => async (collateralRatio: number, collateralPrice: number, collateralAmountD18: number) => {
		return await getters.collateralHubContract.methods.calcOverCollateralizedMintAmounts(collateralRatio, collateralPrice, collateralAmountD18).call();
	},
	getCalcOverCollateralizedRedeemAmounts: (_state: any, getters: any) => async (collateralRatio: number, collateralPrice: number, nuonAmount: number, multiplier: number) => {
		return await getters.collateralHubContract.methods.calcOverCollateralizedRedeemAmounts(collateralRatio, collateralPrice, nuonAmount, multiplier).call();
	},
	getMinimumDepositAmount: (_state: any, getters: any) => async () => {
		return await getters.collateralHubContract.methods.minimumDepositAmount().call();
	},
	getMaxCRatio: (_state: any, getters: any) => async (chubAddress: string) => {
		return await getters.nuonControllerContract.methods.getMaxCratio(chubAddress).call();
	},
	getNUONSupply: (_state: any, getters: any) => async () => {
		return await getters.nuonControllerContract.methods.getNUONSupply().call();
	},
	getCollateralRatioInPercent: (_state: any, getters: any) => async () => {
		return await getters.nuonControllerContract.methods.getCollateralRatioInPercent().call();
	},
	getCollateralUsed: (_state: any, getters: any) => async () => {
		return await getters.collateralHubContract.methods.collateralUsed().call();
	},
	depositWithoutMint: (_state: any, getters: any) => async (collateralAmount: number) => {
		return await getters.collateralHubContract.methods.depositWithoutMint(collateralAmount).call();
	},
	mintWithoutDeposit: (_state: any, getters: any) => async (collateralAmount: number) => {
		return await getters.collateralHubContract.methods.mintWithoutDeposit(collateralAmount).call();
	},
	redeemWithoutNuon: (_state: any, getters: any) => async (collateralAmount: number) => {
		return await getters.collateralHubContract.methods.redeemWithoutNuon(collateralAmount).call();
	},
	burnNUON: (_state: any, getters: any) => async (nuonAmount: number) => {
		return await getters.collateralHubContract.methods.burnNUON(nuonAmount).call();
	}
};
