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
import { collateralTokens, USDT, WETH} from "~/constants/tokens";

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
	mintingFee: any,
	redeemFee: any,
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
	estimation: any,
	userVaultShares: any
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
	globalRatio: {...DEFAULVALUES},
	userVaultShares: {...DEFAULVALUES},
	estimation: {},
	mintingFee: {...DEFAULVALUES},
	redeemFee: {...DEFAULVALUES},
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
	setRedeemFee(state, {token, value}) {
		state.redeemFee = {...state.mintingFee, [token]: value};
	},
	setMintingFee(state, {token, value}) {
		state.mintingFee = {...state.mintingFee, [token]: value};
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
	setUserVaultShares(state, {token, value}) {
		state.userVaultShares = {...state.userVaultShares, [token]: value};
	},
	setGlobalRatio(state, {token, value}) {
		state.globalRatio = {...state.globalRatio, [token]: value};
	},
	setEstimation(state, payload) {
		state.estimation = payload;
	}
};

export const actions: ActionTree<BoardroomState, BoardroomState> = {
	initialize(ctx: any) {
		ctx.dispatch("updateStatus");
	},
	async getAllowance (ctx: any) {
		const address = ctx.rootGetters["web3Store/account"];
		if (!address) return;
		const collateralUSDT = ctx.rootGetters["addressStore/collateralHubs"][USDT.symbol];
		const collateralNative = ctx.rootGetters["addressStore/collateralHubs"][WETH.symbol];
		// const getNuonAllowance = fromWei(await ctx.rootGetters["erc20Store/nuon"].methods.allowance(address, collateralHubAddress).call());
		const getUSDTAllowance = fromWei(await ctx.rootGetters["erc20Store/usdt"].methods.allowance(address, collateralUSDT).call());
		const getWETHAllownace = fromWei(await ctx.rootGetters["erc20Store/weth"].methods.allowance(address, collateralNative).call());
		ctx.commit("setAllowance", 
			{
				USDT: Number(getUSDTAllowance), 
				WETH: Number(getWETHAllownace)
			});
	},
	approveToken(ctx: any, {tokenSymbol, collateralToken, onConfirm, onReject, onCallback}): void {
		const contractAddress = ctx.rootGetters["addressStore/collateralHubs"][collateralToken];

		ctx.dispatch("erc20Store/approveToken", {tokenSymbol, contractAddress, onConfirm, onReject, onCallback}, {root:true} )
			.then(() => {
				ctx.dispatch("getAllowance", collateralToken).then(() => {
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
	async updateStatus({dispatch, commit, getters, rootState}: {dispatch:any, commit:any, getters:any, rootState:any}) {
		const accountAddress = rootState?.web3Store.account;
		if (!accountAddress) return;
		const myCollateralAmount = await getters.getUserCollateralAmount(accountAddress);
		commit("setUserCollateralAmount", myCollateralAmount);

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
	async redeem(ctx: any, {collateralToken, nuonAmount, onConfirm, onReject}) {
		const chubContract = ctx.getters.getCollateralHubContract(collateralToken);
		const accountAddress = ctx.rootState.web3Store.account;
		return await chubContract.methods.redeem(nuonAmount).send({from: accountAddress})
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
		const decimals = ctx.rootState.erc20Store.decimals[token];

		// Get Mint and Redeem Fees
		ctx.getters.getMintingFee(chubContractAddress).then((mintFee: string) => {
			ctx.commit("setMintingFee", {token, value: Number(fromWei(mintFee))});
		});
		ctx.getters.getRedeemFee(chubContractAddress).then((redeemFee: string) => {
			ctx.commit("setRedeemFee", {token, value: Number(fromWei(redeemFee))});
		});

		// Update minted Nuon
		const mintedAmount = fromWei(await chubContract.methods.viewUserMintedAmount(accountAddress).call());
		ctx.commit("setMintedAmount",  {token, amount: mintedAmount});

		// update locked token amount
		const lockedAmount = fromWei(await chubContract.methods.viewUserCollateralAmount(accountAddress).call(),decimals);
		ctx.commit("setLockedAmount",  {token, amount: lockedAmount});

		// update collateral ratio
		const collateralRatio = fromWei(await chubContract.methods.getUserCollateralRatioInPercent(accountAddress).call());
		ctx.commit("setCollateralRatio",  {token, value: Number(collateralRatio)});

		// Update getLPValueOfUser
		const lpValueOfUser = fromWei(await chubContract.methods.getLPValueOfUser(accountAddress).call(), decimals);
		ctx.commit("setLpValueOfUser", {token, value: Number(lpValueOfUser)});

		// Update globalRatio 
		const globalRatio = fromWei(await ctx.getters.nuonControllerContract.methods.getCollateralRatioInPercent(chubContractAddress).call());
		ctx.commit("setGlobalRatio", {token, value: Number(globalRatio)});

		// Update shared amount
		const sharesAmount = fromWei(await chubContract.methods.viewUserVaultSharesAmount(accountAddress).call(), decimals);
		ctx.commit("setUserVaultShares", {token, value: Number(sharesAmount)});
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

	// Methods for collateral management
	/**
	 * 
	 * @param ctx 
	 * @param {collateral, method, amount, onTxHash, onConfirm, onReject} 
	 * @returns 
	 * 
	 * method:  burnNUON | 
	 * 					mintWithoutDeposit | 
	 * 					depositWithoutMint | 
	 * 					redeemWithoutNuon | 
	 * 					addLiquidityForUser | 
	 * 					removeLiquidityForUser
	 */
	callManageMethods(ctx: any, {collateral, method, amount, onTxHash, onConfirm, onReject}) {
		const chubContract = ctx.getters.getCollateralHubContract(collateral);
		const accountAddress = ctx.rootState.web3Store.account;
		return chubContract.methods[method].apply(null, [amount])
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
	async calcEstimation(ctx:any, {action, selectedCollateral, value}){
		const estimationData:any = {};
		const accountAddress = ctx.rootState.web3Store.account;

		let method;
		if (action === "Burn") {
			method = "burnNUONEstimation";
		} else if (action === "Mint") {
			method = "mintWithoutDepositEstimation";
		} else if (action === "Deposit") {
			method = "depositWithoutMintEstimation";
		} else if (action === "Withdraw"){
			method = "redeemWithoutNuonEstimation";
		} else {
			method = "";
		}
		let decimals = ctx.rootState.erc20Store.decimals[selectedCollateral];
		if (action === "Mint" || action === "Burn") {
			decimals = 18;
		}
		const amount = toWei(value, decimals);
		let resp: any = {};
		let resp2: any  = {};
		try {
			resp = await ctx.getters[`${method}`](selectedCollateral, amount, accountAddress);
			if (action === "Mint") {
				resp2 = await ctx.getters.mintLiquidityHelper(selectedCollateral, resp[1]);
			}
		} catch (e: any) {
		} finally {
			if (action === "Mint" || action === "Burn") {
				estimationData.lockedCollateral = ctx.state.lockedAmount[selectedCollateral];
				estimationData.mintedNuon = fromWei(resp[2]);
				estimationData.extraRequiredCollateral = fromWei(resp2[0], decimals);
				estimationData.collateralRatio = fromWei(resp[0]);
				
				estimationData.liquidationRatio = ctx.state.globalRatio[selectedCollateral];
				estimationData.liquidationPosition = ctx.state.lpValueOfUser[selectedCollateral];
			}
			if (action === "Deposit" || action === "Withdraw") {
				const collateralPrice = ctx.rootState.tokenStore.price[selectedCollateral];
				if (action === "Deposit") {
					estimationData.lockedCollateral = Number(fromWei(resp[2], 18)) / collateralPrice;
				} else {
					estimationData.lockedCollateral = Number(fromWei(resp[2], decimals));
				}
				estimationData.mintedNuon = ctx.state.mintedAmount[selectedCollateral] ;
				estimationData.collateralRatio = fromWei(resp[0]);
				estimationData.liquidationPrice = fromWei(resp2[1]);
				estimationData.liquidationRatio = ctx.state.globalRatio[selectedCollateral];
				estimationData.liquidationPosition = ctx.state.lpValueOfUser[selectedCollateral];
			}
			if (action === "Add" || action === "remove") {
				estimationData.lockedCollateral = ctx.state.lockedAmount[selectedCollateral];
				estimationData.mintedNuon = ctx.state.mintedAmount[selectedCollateral] ;
				estimationData.collateralRatio = ctx.state.collateralRatio[selectedCollateral];
				estimationData.liquidationRatio = ctx.state.globalRatio[selectedCollateral];
				estimationData.liquidationPosition = ctx.state.lpValueOfUser[selectedCollateral];
			}
			const targetPeg = ctx.state.targetPeg;
			const mintedNuon = estimationData.mintedNuon;
			const globalRatio = ctx.state.globalRatio[selectedCollateral];
			const minimumCollateralRatio = Math.floor(globalRatio) + 10;
			const nounMinBacking = targetPeg * minimumCollateralRatio / 100;
			if (estimationData.lockedCollateral) {
				estimationData.liquidationPrice= nounMinBacking * mintedNuon / estimationData.lockedCollateral;
			}

		}
		ctx.commit("setEstimation", estimationData);
	}	
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
	getEstimateCollateralsOut: (_state: any, getters: any) => async (_userAddress: string, collateralToken: string, nuonAmount: number) => {
		const collateralHubContract = getters.getCollateralHubContract(collateralToken);
		return await collateralHubContract.methods.estimateCollateralsOut(_userAddress, nuonAmount).call();
	},
	getCalcOverCollateralizedMintAmounts: (_state: any, getters: any) => async (collateralRatio: number, collateralPrice: number, collateralAmountD18: number) => {
		return await getters.collateralHubContract.methods.calcOverCollateralizedMintAmounts(collateralRatio, collateralPrice, collateralAmountD18).call();
	},
	getCalcOverCollateralizedRedeemAmounts: (_state: any, getters: any) => async (collateralRatio: number, collateralPrice: number, nuonAmount: number, multiplier: number) => {
		return await getters.collateralHubContract.methods.calcOverCollateralizedRedeemAmounts(collateralRatio, collateralPrice, nuonAmount, multiplier).call();
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
	getCollateralUsed: (_state: any, getters: any) => async (token:string) => {
		const collateralHubContract = getters.getCollateralHubContract(token);
		return await collateralHubContract.methods.collateralUsed().call();
	},

	depositWithoutMintEstimation: (_state: any, getters: any) => async (token:string, collateralAmount: number, userAddress: string) => {
		const collateralHubContract = getters.getCollateralHubContract(token);
		return await collateralHubContract.methods._depositWithoutMintEstimation(collateralAmount, userAddress).call();
	},
	mintWithoutDepositEstimation: (_state: any, getters: any) => async (token: string, collateralAmount: number, userAddress: string) => {
		const collateralHubContract = getters.getCollateralHubContract(token);
		return await collateralHubContract.methods._mintWithoutDepositEstimation(collateralAmount, userAddress).call();
	},
	redeemWithoutNuonEstimation: (_state: any, getters: any) => async (token: string, collateralAmount: number, userAddress: string) => {
		const collateralHubContract = getters.getCollateralHubContract(token);
		return await collateralHubContract.methods._redeemWithoutNuonEstimation(collateralAmount, userAddress).call();
	},
	burnNUONEstimation: (_state: any, getters: any) => async (token:string, nuonAmount: number, userAddress: string) => {
		const collateralHubContract = getters.getCollateralHubContract(token);
		return await collateralHubContract.methods._burnNUONEstimation(nuonAmount, userAddress).call();
	},
	mintLiquidityHelper: (_state: any, getters: any) => async (token:string, nuonAmount: number) => { // returns how much extra collateral is needed or will be added for an operation, already integrate in estimateNuon minted amount
		const collateralHubContract = getters.getCollateralHubContract(token);
		return await collateralHubContract.methods.mintLiquidityHelper(nuonAmount).call();
	},
	redeemLiquidityHelper: (_state: any, getters: any) => async (token:string, nuonAmount: number, userAddress: string) => { // returns how much lp will be sent to a user, used only for burnNUON
		const collateralHubContract = getters.getCollateralHubContract(token);
		return await collateralHubContract.redeemLiquidityHelper(nuonAmount, userAddress).call();
	},
	getLPValueOfUser: (_state: any, getters: any) => async (token:string,userAddress: string) => { // gives back the LP value IN COLLATERALS of the user
		const collateralHubContract = getters.getCollateralHubContract(token);
		return await collateralHubContract.methods.getLPValueOfUser(userAddress).call();
	},
	getUserLiquidityCoverage: (_state: any, getters: any) => async (token:string, extraAmount: number, userAddress: string) => { // a percentage that gives the user liq coverage, need to be compared with liquidityCheck
		const collateralHubContract = getters.getCollateralHubContract(token);
		return await collateralHubContract.methods.getUserLiquidityCoverage(userAddress, extraAmount).call();
	},

	viewUserVaultSharesAmount: (_state: any, getters: any) => async (token:string, userAddress: string) => {
		const collateralHubContract = getters.getCollateralHubContract(token);
		return await collateralHubContract.methods.viewUserVaultSharesAmount(userAddress).call();
	},
	getPPFS: (_state: any, getters: any) => async () => {
		return await getters.vaultRelayerContract.methods.getPPFS().call();
	},

};
