import { GetterTree, ActionTree, MutationTree } from "vuex";
import BN from "bn.js";
import { Web3State } from "./web3Store";
import boardroomAbi from "./abi/boardroom.json";
import treasuryAbi from "./abi/treasury.json";
import { fromWei, toWei } from "~/utils/bnTools";
import { BOARDROOM_ADDRESS } from "~/constants/addresses";

type StateType = {
	stakedBalance: BN,
	earned: BN,
	totalSupply: BN,
	epoch: number,
	nextEpochPoint: number,
	canWithdraw: boolean,
	canClaimRewards: boolean,
	allowance: {HX: number, USX: number},
	lastSnapshot: {lastSnapshotIndex: number, rewardEarned: BN, epochTimerStart: number},
	claimFee: number,
	director: any
}
export const state = (): StateType => ({
	stakedBalance: new BN(0),
	earned: new BN(0),
	totalSupply: new BN(0),
	epoch: 0,
	nextEpochPoint: 0,
	canWithdraw: false,
	canClaimRewards: false,
	allowance: {HX:0, USX: 0},
	lastSnapshot: {lastSnapshotIndex: 0, rewardEarned: new BN(0), epochTimerStart: 0},
	claimFee: 0,
	director: null
});

export type BoardroomState = ReturnType<typeof state>;

export const mutations: MutationTree<BoardroomState> = {
	setStakedBalance(state, payload: BN) {
		state.stakedBalance = payload;
	},
	setEarned(state, payload: BN) {
		state.earned = payload;
	},
	setTotalSupply(state, payload: BN) {
		state.totalSupply = payload;
	},
	setEpoch(state, payload: number) {
		state.epoch = payload;
	},
	setNextEpochPoint(state, payload: number) {
		state.nextEpochPoint = payload;
	}, 
	setCanClaimRewards(state, payload: boolean) {
		state.canClaimRewards = payload;
	},
	setCanWithdraw(state, payload: boolean) {
		state.canWithdraw = payload;
	},
	setAllowance(state, payload: {HX:number, USX: number}) {
		state.allowance = payload;
	},
	setLastSnapshot(state, payload: {lastSnapshotIndex: number, rewardEarned: BN, epochTimerStart: number}) {
		state.lastSnapshot = payload;
	},
	setClaimFee(state, payload: number) {
		state.claimFee = payload;
	},
	setDirector(state, payload: any) {
		state.director = payload;
	}
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
			.on("transactionHash", (hash: string) => {
				if (onConfirm) onConfirm(hash);
			})
			.on("error", (err: string) => {
				if (onReject) onReject(err);
			});
	},
	claimReward(ctx: any, {onConfirm, onReject}) {
		const accountAddress = ctx.rootState.web3Store.account;
		return ctx.getters.contract.methods.claimReward(
			true, 
			"0x000000000000000000000000000000000000dEaD",
			["0x000000000000000000000000000000000000dEaD", "0x000000000000000000000000000000000000dEaD"]
		).send({from: accountAddress})
			.on("transactionHash", (hash: string) => {
				if (onConfirm) onConfirm(hash);
			})
			.on("error", (err: string) => {
				if (onReject) onReject(err);
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
			.on("transactionHash", (hash: string) => {
				if (onConfirm) onConfirm(hash);
			})
			.on("error", (err: string) => {
				if (onReject) onReject(err);
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
	updateStatus({commit, getters, dispatch}) {
		dispatch("getAllowance");
		dispatch("getLastSnapshot");
		getters.getEarned().then((earned: BN) => {
			commit("setEarned", earned);
		});
		getters.getBalanceOf().then((myBalance: BN) => {
			commit("setStakedBalance", myBalance);
		});
		getters.getTotalSupply().then((totalSupply: BN) => {
			commit("setTotalSupply", totalSupply);
		});
		getters.getCanClaimRewards().then((canClaim: boolean) => {
			commit("setCanClaimRewards", canClaim);
		});
		getters.getCanWithdraw().then((canWithdraw: boolean) => {
			commit("setCanWithdraw", canWithdraw);
		});
		getters.getNextEpochPoint().then((nextEpochPoint: number) => {
			commit("setNextEpochPoint", nextEpochPoint);
		});
		getters.getEpoch().then((epoch: number) => {
			commit("setEpoch", epoch);
		});
		getters.getDirector().then((seat:any) => {
			commit("setDirector", seat);
		});
		getters.getFees().then((fee:number) => {
			commit("setClaimFee", fee / 10); // we got the fee value as 1000 rate. 5 means 0.5% and 10 means 1%
		});
	}
};

export const getters: GetterTree<BoardroomState, Web3State> = {
	contract: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].boardroom;
		return new web3.eth.Contract(boardroomAbi, addr);
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
