import { GetterTree, ActionTree, MutationTree } from "vuex";
import BN from "bn.js";
import { Web3State } from "./web3Store";
import stabilityFlash from "./abi/stability_flash.json";
import { calculateGasMargin } from "~/utils/calculateGasMargin";
import { fromWei } from "~/utils/bnTools";
import { STABILITYFLASH_ADDRESS } from "~/constants/addresses";

/**
 * @dev Smart contracts being exposed from:
 * Hydro-Ecosystem: contracts/USX/StabilityFlash.sol
 */

type TransactionName = "claim" | "burn" | "approve";
type TrackingData = {
	key: TransactionName,
	onStop: any
}
type UserType = {
	user: string,
	USXamountBurned: BN,
	minted: BN,
	lastClaimDate: number,
	nextClaim: number,
	outstanding: BN
}
type StateType = {
	user: UserType | null,
	readyToClaim: boolean,
	pendingTransactions: any,
	trackId: number,
	mintingFee: number,
	allowance: {HX: number, USX: number},
}
export const state = (): StateType => ({
	user: null,
	readyToClaim: false,
	pendingTransactions: {
		claim: "",
		burn: "",
		approve: ""
	},
	trackId: 0,
	mintingFee: 0,
	allowance: {HX:0, USX: 0},
});

export type StabilityState = ReturnType<typeof state>

export const mutations: MutationTree<StabilityState> = {
	setReadyToClaim (state, payload: boolean) {
		state.readyToClaim = payload;
	},
	setUser (state, payload: UserType ) {
		state.user = payload;
	},
	setPendingTransactions(state, payload: any) {
		state.pendingTransactions = payload;
	},
	setTrackId(state, trackId: number) {
		state.trackId = trackId;
	},
	setAllowance(state, payload: {HX:number, USX: number}) {
		state.allowance = payload;
	},
	setMintingFee(state, payload: number) {
		state.mintingFee = payload;
	}
};


export const actions: ActionTree<StabilityState, StabilityState> = {
	initialize(ctx:any) {
		ctx.dispatch("updateStatus");
	},
	updateStatus(ctx: any) {
		ctx.dispatch("getAllowance");
		ctx.dispatch("getMintingFee");
	},
	async getAllowance (ctx: any) {
		const address = ctx.rootGetters["web3Store/account"];
		if (!address) return;
		const getUsxAllowance = fromWei(await ctx.rootGetters["erc20Store/usx"].methods.allowance(address, STABILITYFLASH_ADDRESS).call());
		const getHydroAllowance = fromWei(await  ctx.rootGetters["erc20Store/hydro"].methods.allowance(address, STABILITYFLASH_ADDRESS).call());
		ctx.commit("setAllowance", {HX: getHydroAllowance, USX: getUsxAllowance});
	},
	approveToken(ctx: any, {tokenName,  onConfirm, onReject, onCallback}): void {
		const contractAddress = STABILITYFLASH_ADDRESS;
		ctx.dispatch("erc20Store/approveToken", {tokenName, contractAddress, onConfirm, onReject, onCallback}, {root:true} )
			.then(() =>{
				ctx.dispatch("getAllowance").then(() => {
					if (onCallback) onCallback(null);
				});
			}).catch((err: Error) => {
				if (onCallback) onCallback(err);
			});
	},
	async getUser(ctx: any, { address }) {
		if (address) {
			const user: UserType = await ctx.getters.contract.methods.getUser(address).call();
			ctx.commit("setUser", user);
			return user;
		} else {
			const account = ctx.rootState.web3Store.account;
			if (account) {
				const user = await ctx.getters.contract.methods.getUser(account).call();
				ctx.commit("setUser", user);
				return user;
			} else {
				ctx.commit("setUser", null);
				return null;
			}
		}
	},
	getMintingFee({commit, getters}) {
		getters.contract.methods.mintingFees().call().then((res: number) => {
			commit("setMintingFee", res);
		});
	},
	async getViewEarned(ctx: any, { address }) {
		return await ctx.getters.contract.methods.viewEarned(address).call();
	},

	burnHydro(ctx: any, { address, amount, onConfirm, onError, onComplete }) {
		const web3 = ctx.rootGetters["web3Store/instance"]();
		
		try {
			ctx.getters.contract.methods.burnHYDRO(
				web3.utils.toWei(amount, "ether")
			).send({from: address})
			 .on("error", function() {
				 	onError();
			 })
			 .on("transactionHash", function(hash: string) {
					onConfirm(hash);
			 })
			 .then((_res:any) => {
				 	ctx.dispatch("erc20Store/initializeBalance", {address}, {root:true});
				 	onComplete();
			 });
		} catch (e) {
			onError(e);
		}
	},

	burnUsx(ctx: any, { address, amount, onConfirm, onError, onComplete }) {
		const web3 = ctx.rootGetters["web3Store/instance"]();
		
		try {
			ctx.getters.contract.methods.burnUSX(
				web3.utils.toWei(amount, "ether")
			).send({from: address})
			 .on("error", function() {
				 	onError();
			 })
			 .on("transactionHash", function(hash: string) {
				 	onConfirm(hash);
			 })
			 .then((_res: any) => {
					ctx.dispatch("erc20Store/initializeBalance", {address}, {root:true});
				 	onComplete();
			 });
		} catch (e) {
			onError(e);
		}
	},

	async claimHydroProfits(ctx: any, {_claimInHYDRO, _paidIn, _HYDROToChosenRoute, _callback}) {
		const accountAddress = ctx.state.user.user;
		const web3 = ctx.rootGetters["web3Store/instance"]();
		const BN = web3.utils.BN;
		let gasLimit = 210000;
		await web3.eth.getBlock("latest", false, (error:Error, result:any) => {
			if (!error && gasLimit > result.gasLimit) {
				gasLimit = result.gasLimit;
			}
		});
		let estimatedGas = new BN(0);
		try {
			estimatedGas = await ctx.getters.contract.methods.claimHYDROProfits(_claimInHYDRO, _paidIn, _HYDROToChosenRoute).estimateGas();
		} catch(error: any) {
			estimatedGas =  new BN(130000);
		}
		estimatedGas = calculateGasMargin(estimatedGas);

		ctx.getters.contract.methods.claimHYDROProfits(_claimInHYDRO, _paidIn, _HYDROToChosenRoute).send({from: accountAddress, gasPrice: estimatedGas.toString(), gas: gasLimit})
			.on("transactionHash", function(hash: string){
				if (_callback) _callback();
				ctx.dispatch("getUser", {address: accountAddress});
				ctx.dispatch("trackPendingTransactions", {key: "claim", hash});
				ctx.commit("modalStore/setModalInfo", {name: "claimResultModal", info: `You claimed successfully, here is a transaction hash ${hash}`});
				ctx.commit("modalStore/setModalVisibility", {name: "claimResultModal", visibility: true});
			})
			.on("error", function(error: Error) {
				if (_callback) _callback();
				if (error) {
					ctx.commit("modalStore/setModalInfo", {name: "claimResultModal", info: "Your claim request has failed. Please try again later"});
					ctx.commit("modalStore/setModalVisibility", {name: "claimResultModal", visibility: true});
				}
			});
	},

	async getReservesInUSD({getters, rootGetters}, hxAmount:string) {
		const web3 = rootGetters["web3Store/instance"]();
		const BN = web3.utils.BN;
		const reservesInUSD = new BN(await getters.contract.methods.reservesInUSD(new BN(hxAmount)).call());
		return web3.utils.fromWei(reservesInUSD);
	},

	trackPendingTransactions({state, commit, dispatch}, {key, hash, onStop}) {
		commit("setPendingTransactions", {...state.pendingTransactions, [key]:hash});
		localStorage.setItem("pending_transaction", JSON.stringify(state.pendingTransactions));
		if (hash) {
			dispatch("startTrackingTransactions", {key, onStop});
		}
	},

	async checkPendingTransactions({rootGetters}, hash) {
		const web3 = rootGetters["web3Store/instance"]();
		const transactionReceipt = await web3.eth.getTransactionReceipt(hash);

		if (!transactionReceipt) return true;  // if pending return true;
		return false;
	},

	startTrackingTransactions({state, dispatch, commit}, params:TrackingData) {
		const {key, onStop} = params;
		if (state.pendingTransactions[key] && !state.trackId) {
			const trackId = setInterval(() => {
				dispatch("checkPendingTransactions", state.pendingTransactions[key]).then(status => {
					if (!status) {
						if (state.trackId) clearInterval(state.trackId);
						if (onStop) onStop();
						if (state.user) {
							dispatch("getUser", {});
						}
						commit("setTrackId", 0);
						dispatch("trackPendingTransactions", {key, hash: ""});
					}
				});
			}, 3000);
			commit("setTrackId", trackId);
		}
	},

	async getReserves({getters}) {
		const reserves = await getters.contract.getReserves();
		return reserves;
	}
};

export const getters: GetterTree<StabilityState, Web3State> = {
	contract: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].stabilityFlash;
		return new web3.eth.Contract(stabilityFlash, addr);
	},

	getToleranceHigh: async (_state: any, getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		return web3.utils.fromWei(await getters.contract.methods.toleranceHigh().call());
	},

	getToleranceLow: async (_state: any, getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		return web3.utils.fromWei(await getters.contract.methods.toleranceLow().call());
	},

	getRebalanceFees: async (_state: any, getters: any, _store: any) => {
		return await getters.contract.methods.mintingFees().call();
	},

	getStakedBalance: async (_state: any, getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		return store.web3Store.account ? web3.utils.fromWei(await getters.contract.methods.viewStakedBalance(store.web3Store.account).call()) : 0;
	},

	getClaimRatio: async (_state: any, getters: any, _store: any) => {
		return await getters.contract.methods.claimRatio().call();
	},

	getHYDROPriceInUSDC: async (_state: any, getters: any, _store: any) => {
		return fromWei(await getters.contract.methods.getHYDROPriceInUSDC().call(), 6);
	},

	getUSXPriceInUSDC: async (_state: any, getters: any, _store: any) => {
		return fromWei(await getters.contract.methods.getUSXPriceInUSDC().call(), 6);
	},

	getViewRatio: (_state: any, getters: any, _store: any) => {
		return getters.contract.methods;
	},

	getReadyToClaim: state => state.readyToClaim,

	userClaimRatio: async (state: any, getters: any, _store: any) => {
		const accountAddress = state.user?.user;
		if (!accountAddress) return 0;
		return await getters.contract.methods.userClaimRatio(accountAddress).call();
	},

	getPegStatus: (_state: any, getters: any, _store: any) => async (hxAmount: any) => {
		return await getters.contract.methods.getPegStatus(hxAmount).call();
	},

	getEstimatedUSXOut: (_state: any, getters: any, _store: any) => async (hxAmount: any) => {
		return await getters.contract.methods.getEstimatedUSXOut(hxAmount).call();
	},

	getEstimatedHYDROOut: (_state: any, getters: any, _store: any) => async (usxAmount: any) => {
		return await getters.contract.methods.getEstimatedHYDROOut(usxAmount).call();
	},
};
