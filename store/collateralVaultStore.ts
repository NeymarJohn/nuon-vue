import { GetterTree, ActionTree, MutationTree } from "vuex";
import BN from "bn.js";
import { Web3State } from "./web3Store";
import collateralHubAbi from "./abi/collateral_hub_native.json";
import collateralHubUSDTAbi from "./abi/collateral_hub_usdt.json";
import vaultRelayerNativeAbi from "./abi/vault_relayer_native.json";
import vaultRelayerUsdtAbi from "./abi/vault_relayer_usdt.json";
import nuonControllerAbi from "./abi/nuon_controller.json";
import truflationAbi from "./abi/truflation.json";
import boardroomAbi from "./abi/boardroom.json";
import { fromWei, toWei } from "~/utils/bnTools";
import { collateralTokens } from "~/constants/tokens";

const DEFAULVALUES = {
	WETH: 0,
	USDT: 0
};

type StateType = {
	allowance: any,
	userCollateralAmount: number,
	targetCollateralValue: number,
	globalCollateralRatioValue: number,
	aprInflation: number,
	aprCollateral: number,
	totalLockedCollateral: number,
	allCollaterals: any,
	mintingFee: 0,
	redeemFee: number,
	inflation: number,
	dailyInflationRate: number,
	userTVL: number,
	userJustMinted: boolean,
	currentCollateralToken: string,
	abis: any,
	vaultRelayerAbis: any,
	mintedAmount: any,
	lockedAmount: any
	collateralRatio: any,
	targetPeg: number,
	collateralPrices: any,
	lpValueOfUser: any,
	globalRatio: any,
}
export const state = (): StateType => ({
	allowance: {
		nuMINT:0,
		NUON: 0
	},
	userCollateralAmount: 0,
	targetCollateralValue: 0,
	globalCollateralRatioValue: 0,
	aprInflation: 0,
	aprCollateral: 0,
	totalLockedCollateral: 0,
	allCollaterals: [],
	mintingFee: 0,
	redeemFee: 0,
	inflation: 0,
	dailyInflationRate: 0,
	userTVL: 0,
	userJustMinted: false,
	currentCollateralToken: "WETH",
	targetPeg: 0,
	abis: {
		WETH: collateralHubAbi,
		USDT: collateralHubUSDTAbi
	},
	vaultRelayerAbis: {
		WETH: vaultRelayerNativeAbi,
		USDT: vaultRelayerUsdtAbi
	},
	mintedAmount: {...DEFAULVALUES}, // {WETH: 0 USDT: 0} mintedNuon for all collateral tokens for user
	lockedAmount: {...DEFAULVALUES}, // {WETH: 0 USDT: 0} locked collateral for all collateral tokens for user
	collateralRatio: {...DEFAULVALUES}, // {WETH: 0 USDT: 0} collateral ratio for all collateral tokens for user
	collateralPrices:{...DEFAULVALUES}, // {WETH: 0 USDT: 0} collateral price for all collateral tokens
	lpValueOfUser: {...DEFAULVALUES}, // {WETH: 0 USDT: 0} collateral price for all collateral tokens
	globalRatio: {...DEFAULVALUES}
});

export type BoardroomState = ReturnType<typeof state>;

export const mutations: MutationTree<BoardroomState> = {
	setAllowance(state, payload: {nuMINT:number, NUON: number}) {
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
	setLockedAmount(state, {token, amount}) {
		state.lockedAmount = {...state.lockedAmount, [token]: amount};
	},
	setCollateralRatio(state, {token, value}) {
		state.collateralRatio = {...state.collateralRatio, [token]: value};
	},
	setTargetPeg(state, payload) {
		state.targetPeg = payload;
	},
	setCollateralPrices(state, payload) {
		state.collateralPrices = payload;
	},
	setLpValueOfUser(state, {token, value}) {
		state.lpValueOfUser = {...state.lpValueOfUser, [token]: value};
	},
	setGlobalRatio(state, {token, value}) {
		state.globalRatio = {...state.globalRatio, [token]: value};
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
		const getNuMintAllowance = fromWei(await ctx.rootGetters["erc20Store/nuMint"].methods.allowance(address, collateralHubAddress).call());
		const getUSDTAllowance = fromWei(await ctx.rootGetters["erc20Store/usdt"].methods.allowance(address, collateralHubAddress).call());
		const getWETHAllownace = fromWei(await ctx.rootGetters["erc20Store/weth"].methods.allowance(address, collateralHubAddress).call());
		ctx.commit("setAllowance", {HX: getNuMintAllowance, NUON: getNuonAllowance, USDT: getUSDTAllowance, WETH: getWETHAllownace});
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

		for (let i = 0; i < collateralTokens.length; i ++ ) {
			dispatch("updateCollateralTokenStatus", collateralTokens[i].symbol);
		}

		dispatch("getCollateralPrices");
		setInterval(() => {
			dispatch("getTargetPeg");
		},1000);
	},
	async mintNuon(ctx: any, {collateralToken, collateralRatio, collateralAmount, onTxHash, onConfirm, onReject}) {
		const chubContract = ctx.getters.getCollateralHubContract(collateralToken);

		const accountAddress = ctx.rootState.web3Store.account;
		const payload: {from: string, value?: string} = {from: accountAddress};
		const args: string[] = [collateralRatio, collateralAmount];

		return await chubContract.methods.mint.apply(null, args)
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
	async updateCollateralTokenStatus(ctx: any, token: string) {
		const chubContract = ctx.getters.getCollateralHubContract(token);
		const chubContractAddress = ctx.rootGetters["addressStore/collateralHubs"][token];

		const accountAddress = ctx.rootState.web3Store.account;

		// Update minted Nuon
		const mintedAmount = fromWei(await chubContract.methods.viewUserMintedAmount(accountAddress).call());
		ctx.commit("setMintedAmount",  {token, amount: Number(mintedAmount)});

		// update locked token amount
		const lockedAmount = fromWei(await chubContract.methods.viewUserCollateralAmount(accountAddress).call(),ctx.rootState.erc20Store.decimals[token]);
		ctx.commit("setLockedAmount",  {token, amount: Number(lockedAmount)});

		// update collateral ratio
		const collateralRatio = fromWei(await chubContract.methods.getUserCollateralRatioInPercent(accountAddress).call());
		ctx.commit("setCollateralRatio",  {token, value: Number(collateralRatio)});

		// Update getLPValueOfUser
		const lpValueOfUser = fromWei(await chubContract.methods.getLPValueOfUser(accountAddress).call(), ctx.rootState.erc20Store.decimals[token]);
		ctx.commit("setLpValueOfUser", {token, value: Number(lpValueOfUser)});

		// Update globalRatio 
		const globalRatio = fromWei(await ctx.getters.nuonControllerContract.methods.getCollateralRatioInPercent(chubContractAddress).call());
		ctx.commit("setGlobalRatio", {token, value: Number(globalRatio)});
	},
	async getTargetPeg(ctx) {
		const result = await ctx.getters.getTruflationPeg();
		ctx.commit("setTargetPeg", Number(fromWei(result)));
	},
	async getCollateralPrices(ctx: any) {
		// eslint-disable-next-line no-unreachable-loop
		const prices:any = {};
		const web3 = ctx.rootState.web3Store.instance();
		for (let i = 0; i < collateralTokens.length; i++) {
			const collateralToken = collateralTokens[i].symbol;
			const addr = ctx.rootGetters["addressStore/collateralHubs"][collateralToken];
			const abi = ctx.state.abis[collateralToken];
			const contract = new web3.eth.Contract(abi, addr);
			const price = fromWei(await contract.methods.getCollateralPrice().call());
			prices[collateralToken] = Number(price);
		}
		ctx.commit("setCollateralPrices",{...prices});
	},
	async mintWithoutDeposit(ctx: any, {collateral, collateralAmount,  onTxHash, onConfirm, onReject }) {
		const chubContract = ctx.getters.getCollateralHubContract(collateral);
		const accountAddress = ctx.rootState.web3Store.account;
		return await chubContract.methods.mintWithoutDeposit.apply(null, [collateralAmount])
			.send( {from: accountAddress})
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
	async burnNUON(ctx: any, {collateral, nuonAmount, onTxHash, onConfirm, onReject}) {
		const chubContract = ctx.getters.getCollateralHubContract(collateral);
		const accountAddress = ctx.rootState.web3Store.account;
		return await chubContract.methods.burnNUON.apply(null, [nuonAmount])
			.send({from: accountAddress})
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
};

export const getters: GetterTree<BoardroomState, Web3State> = {
	web3Instance: (_state: any, _getters: any, _store: any, rootGetters: any) => {
		const web3 = rootGetters["web3Store/instance"]();
		return web3;
	},
	collateralHubContract: (state: any, _getters: any, _store: any, rootGetters: any) => {
		const addr = rootGetters["addressStore/collateralHubs"][state.currentCollateralToken];
		const abi = state.abis[state.currentCollateralToken];
		return new _getters.web3Instance.eth.Contract(abi, addr);
	},
	getCollateralHubContract: (state: any, getters: any, _store: any, rootGetters: any) => (collateralToken:string) => {
		const addr = rootGetters["addressStore/collateralHubs"][collateralToken];
		const abi = state.abis[collateralToken];
		const chubContract = new getters.web3Instance.eth.Contract(abi, addr);
		return chubContract;
	},
	boardroomContract: (_state: any, _getters: any, _store: any, rootGetters) => {
		const addr = rootGetters["addressStore/addresses"].boardroom;
		return new _getters.web3Instance.eth.Contract(boardroomAbi, addr);
	},
	nuonControllerContract:  (_state: any, _getters: any, _store: any, rootGetters: any) => {
		const addr = rootGetters["addressStore/addresses"].nuonController;
		return new _getters.web3Instance.eth.Contract(nuonControllerAbi, addr);
	},
	truflationContract: (_state: any, _getters: any, _store: any, rootGetters) => {
		const truffleAddress = rootGetters["addressStore/addresses"].truflation;
		return new _getters.web3Instance.eth.Contract(truflationAbi, truffleAddress);
	},
	vaultRelayerContract: (state: any, _getters: any, _store: any, rootGetters: any) => {
		const addr = rootGetters["addressStore/vaultRelayers"][state.currentCollateralToken];
		const abi = state.vaultRelayerAbis[state.currentCollateralToken];
		return new _getters.web3Instance.eth.Contract(abi, addr);
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
	getEstimateMintedNUONAmount: (_state: any, getters: any) => async (token: string, collateralAmount: number, _collateralRatio: number) => {
		const collateralHubContract = getters.getCollateralHubContract(token);
		return await collateralHubContract.methods.estimateMintedNUONAmount(collateralAmount, _collateralRatio).call();
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
	depositWithoutMint: (_state: any, getters: any) => async (collateralAmount: number, userAddress: string) => {
		return await getters.collateralHubContract.methods.depositWithoutMint(collateralAmount).send({from: userAddress});
	},
	redeemWithoutNuon: (_state: any, getters: any) => async (collateralAmount: number, userAddress: string) => {
		return await getters.collateralHubContract.methods.redeemWithoutNuon(collateralAmount).send({from: userAddress});
	},
	depositWithoutMintEstimation: (_state: any, getters: any) => async (collateralAmount: number, userAddress: string) => {
		return await getters.collateralHubContract.methods._depositWithoutMintEstimation(collateralAmount, userAddress).call();
	},
	mintWithoutDepositEstimation: (_state: any, getters: any) => async (collateralAmount: number, userAddress: string) => {
		return await getters.collateralHubContract.methods._mintWithoutDepositEstimation(collateralAmount, userAddress).call();
	},
	redeemWithoutNuonEstimation: (_state: any, getters: any) => async (collateralAmount: number, userAddress: string) => {
		return await getters.collateralHubContract.methods._redeemWithoutNuonEstimation(collateralAmount, userAddress).call();
	},
	burnNUONEstimation: (_state: any, getters: any) => async (nuonAmount: number, userAddress: string) => {
		return await getters.collateralHubContract.methods._burnNUONEstimation(nuonAmount, userAddress).call();
	},
	mintLiquidityHelper: (_state: any, getters: any) => async (nuonAmount: number) => { // returns how much extra collateral is needed or will be added for an operation, already integrate in estimateNuon minted amount
		return await getters.collateralHubContract.methods.mintLiquidityHelper(nuonAmount).call();
	},
	redeemLiquidityHelper: (_state: any, getters: any) => async (nuonAmount: number, userAddress: string) => { // returns how much lp will be sent to a user, used only for burnNUON
		return await getters.collateralHubContract.methods.redeemLiquidityHelper(nuonAmount, userAddress).call();
	},
	getLPValueOfUser: (_state: any, getters: any) => async (userAddress: string) => { // gives back the LP value IN COLLATERALS of the user
		return await getters.collateralHubContract.methods.getLPValueOfUser(userAddress).call();
	},
	getUserLiquidityCoverage: (_state: any, getters: any) => async (extraAmount: number, userAddress: string) => { // a percentage that gives the user liq coverage, need to be compared with liquidityCheck
		return await getters.collateralHubContract.methods.getUserLiquidityCoverage(userAddress, extraAmount).call();
	},
	addLiquidityForUser: (_state: any, getters: any) => async (collateralAmount: number, userAddress: string) => {
		return await getters.collateralHubContract.methods.addLiquidityForUser(collateralAmount).send({from: userAddress});
	},
	removeLiquidityForUser: (_state: any, getters: any) => async (collateralAmount: number, userAddress: string) => {
		return await getters.collateralHubContract.methods.removeLiquidityForUser(collateralAmount).send({from: userAddress});
	},
	viewUserVaultSharesAmount: (_state: any, getters: any) => async (userAddress: string) => {
		return await getters.collateralHubContract.methods.viewUserVaultSharesAmount(userAddress).call();
	},
	getPPFS: (_state: any, getters: any) => async () => {
		return await getters.vaultRelayerContract.methods.getPPFS().call();
	},
};
