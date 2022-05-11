import { GetterTree, ActionTree, MutationTree } from "vuex";
import BN from "bn.js";
import Web3 from "web3";
import { Web3State } from "./web3Store";
import erc20 from "./abi/erc20.json";
import { USX } from "~/constants/tokens";

type StateType = {
	balance: {
		USX: BN,
		HX: BN
	}
}
/**
 * @TODO required to refactor, to accept any ERC20
 */
export const state = (): StateType => ({
	balance: {
		USX: new BN(0),
		HX: new BN(0)
	}
});

export type Erc20State = ReturnType<typeof state>

export const mutations: MutationTree<Erc20State> = {
	setBalance(state, payload: any) {
		state.balance = payload;
	}
};

export const actions: ActionTree<Erc20State, Erc20State> = {
	async initializeBalance (ctx: any, {address}) {
		const usxBalance = await ctx.getters.usx.methods.balanceOf(address).call();
		const hydroBalance = await ctx.getters.hydro.methods.balanceOf(address).call();
		ctx.commit("setBalance", {
			HX: hydroBalance,
			USX: usxBalance
		});
	},

	approveToken(ctx: any, {tokenName, contractAddress, onConfirm, onReject}): void {
		const web3 = ctx.rootGetters["web3Store/instance"]();
		const MAX_VALUE = new web3.utils.BN("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
		const accountAddress = ctx.rootGetters["web3Store/account"];
		const tokenContract = tokenName === USX.symbol ? ctx.getters.usx : ctx.getters.hydro;
		return tokenContract.methods.approve(contractAddress, MAX_VALUE)
			.send({from: accountAddress
			}).on("transactionHash", function() {
				if (onConfirm) onConfirm();
			}).on("error", function(err: string) {
				if (onReject) onReject(err);
			});
	}
};

export const getters: GetterTree<Erc20State, Web3State> = {

	/**
	 * @TODO implement abstract ERC20 store
	 */
	contract: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].erc20;
		return new web3.eth.Contract(erc20, addr);
	},

	hydro: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].hydro;
		return new web3.eth.Contract(erc20, addr);
	},

	usx: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].usx;
		return new web3.eth.Contract(erc20, addr);
	},

	getHydroInfo: (state: any) => state.hydro,

	getUsxInfo: (state: any) => state.usx,

	getName: async (_state: StateType, getters: any, _store: any) => {
		return await getters.contract.methods.name().call();
	},

	getSymbol: async (_state: StateType, getters: any, _store: any) => {
		return await getters.contract.methods.symbol().call();
	},

	hxBalance: (state: StateType, _getters: any) => {
		return parseFloat(Web3.utils.fromWei(state.balance.HX.toString(), "ether"));
	},

	usxBalance: (state: StateType, _getters: any) => {
		return parseFloat(Web3.utils.fromWei(state.balance.USX.toString(), "ether"));
	},

	tokenBalance: (state: StateType) => {
		const hxBalance = parseFloat(Web3.utils.fromWei(state.balance.HX.toString(), "ether"));
		const usxBalance = parseFloat(Web3.utils.fromWei(state.balance.USX.toString(), "ether"));
		return {
			USX: usxBalance,
			HX: hxBalance
		};
	}
};
