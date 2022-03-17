import { GetterTree, ActionTree, MutationTree } from "vuex";
import BN from "bn.js";
import { Web3State } from "./web3Store";
import usxYearnPoolABI from "./abi/usx_yearn_pool.json";
import treasuryAbi from "./abi/treasury.json";
import { fromWei, toWei } from "~/utils/bnTools";
import { BOARDROOM_ADDRESS } from "~/constants/addresses";

type StateType = {
	allowance: {HX: number, USX: number},
}
export const state = (): StateType => ({
	allowance: {HX:0, USX: 0},
});

export type BoardroomState = ReturnType<typeof state>;

export const mutations: MutationTree<BoardroomState> = {
	
	setAllowance(state, payload: {HX:number, USX: number}) {
		state.allowance = payload;
	},
};

export const actions: ActionTree<BoardroomState, BoardroomState> = {
	initialize(ctx:any) {
		ctx.dispatch("updateStatus");
	},
	async getAllowance (ctx: any) {
		const address = ctx.rootGetters["web3Store/account"];
		if (!address) return;
		const getUsxAllowance = parseFloat(fromWei(await ctx.rootGetters["erc20Store/usx"].methods.allowance(address, BOARDROOM_ADDRESS).call()));
		const getHydroAllowance = parseFloat(fromWei(await  ctx.rootGetters["erc20Store/hydro"].methods.allowance(address, BOARDROOM_ADDRESS).call()));
		ctx.commit("setAllowance", {HX: getHydroAllowance, USX: getUsxAllowance});
	},
	approveToken(ctx: any, {tokenName,  onConfirm, onReject, onCallback}): void {
		const contractAddress = BOARDROOM_ADDRESS;
		ctx.dispatch("erc20Store/approveToken", {tokenName, contractAddress, onConfirm, onReject, onCallback}, {root:true} )
			.then(() =>{
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
	async allocateHydroToBoardroom(ctx:any, {onConfirm, onReject}) {
		const accountAddress = ctx.rootState.web3Store.account;
		return await ctx.getters.treasury.methods.allocateHydroToBoardroom().send({from: accountAddress})
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
	updateStatus({commit: _commit, getters: _getters, dispatch}) {
		dispatch("getAllowance");
	}
};

export const getters: GetterTree<BoardroomState, Web3State> = {
	poolContract: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].boardroom;
		return new web3.eth.Contract(usxYearnPoolABI, addr);
	},
	libraryContract: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].boardroom;
		return new web3.eth.Contract(usxYearnPoolABI, addr);
	},

	treasury: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].treasury;
		return new web3.eth.Contract(treasuryAbi, addr);
	},

	getEarned:  (_state: any, getters: any, store: any ) => async () => {
		const account = store.web3Store.account;
		if (!account) return 0;
		const earned =  await getters.contract.methods.earned(account).call();
		return earned;
	},
	getCanClaimRewards: (_state: any, getters: any, store: any ) => async () => {
		const account = store.web3Store.account;
		return account !== "" ? await getters.contract.methods.canClaimReward(account).call() : false;
	},
	getCanWithdraw: (_state: any, getters: any, store: any ) => async () => {
		const account = store.web3Store.account;
		return account !== "" ? await getters.contract.methods.canWithdraw(account).call() : false;
	},
	getTotalSupply: (_state: any, getters: any) => async () => {
		return await getters.contract.methods.totalSupply().call();
	},
	getNextEpochPoint: (_state: any, getters: any) => async () => {
		return await getters.contract.methods.nextEpochPoint().call();
	},
	getEpoch: (_state: any, getters: any) => async () => {
		return await getters.contract.methods.epoch().call();
	},
	getBalanceOf: (_state: any, getters: any, store: any) => async () => {
		const account = store.web3Store.account;
		return account !== "" ? await getters.contract.methods.balanceOf(account).call() : new BN(0);
	},
	getDirector:  (_state: any, getters: any, store: any) => async () => {
		const account = store.web3Store.account;
		return account !== "" ? await getters.contract.methods.getDirectorInfo(account).call() : new BN(0);
	},
	getFees: (_state: any, getters: any, store: any) => async () => {
		const account = store.web3Store.account;
		return account !== "" ? await getters.contract.methods.getFees().call() : new BN(0);
	},
	checkApprovedToken: (state:any) => (tokenName: string):boolean => {
		return state.allowance[tokenName] > 0;
	},
};
