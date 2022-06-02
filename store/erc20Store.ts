import { GetterTree, ActionTree, MutationTree } from "vuex";
import { Web3State } from "./web3Store";
import erc20 from "./abi/erc20.json";
import { HX, USX, USDC } from "~/constants/tokens";
import { HYDRO_ADDRESS, USX_ADDRESS, USDC_ADDRESS } from "~/constants/addresses";
import { fromWei } from "~/utils/bnTools";

type StateType = {
	balance: {
		USX: string,
		HX: string,
		USDC: string
	},
	decimals: {
		USX: number,
		HX: number,
		USDC: number
	}
}
/**
 * @TODO required to refactor, to accept any ERC20
 */
export const state = (): StateType => ({
	balance: {
		USX: "0",
		HX: "0",
		USDC: "0"
	},
	decimals: {
		USX: 18,
		HX: 18,
		USDC: 6
	}
});

export type Erc20State = ReturnType<typeof state>

export const mutations: MutationTree<Erc20State> = {
	setBalance(state, payload: any) {
		state.balance = payload;
	},
	setDecimals(state, payload: any) {
		state.decimals = payload;
	}
};

export const actions: ActionTree<Erc20State, Erc20State> = {
	async initializeBalance (ctx: any, {address}) {
		const usdcDecimals = await ctx.getters.usdc.methods.decimals().call();
		const usxBalance = fromWei(await ctx.getters.usx.methods.balanceOf(address).call(), ctx.state.decimals.USX);
		const hydroBalance = fromWei(await ctx.getters.hydro.methods.balanceOf(address).call(), ctx.state.decimals.HX) ;
		const usdcBalance = fromWei(await ctx.getters.usdc.methods.balanceOf(address).call(), usdcDecimals);

		ctx.commit("setBalance", {
			HX: hydroBalance,
			USX: usxBalance,
			USDC: usdcBalance
		});
		ctx.commit("setDecimals", {
			HX: 18,
			USX: 18,
			USDC: usdcDecimals
		});
	},

	approveToken(ctx: any, {tokenSymbol, contractAddress, onConfirm, onReject}): void {
		const web3 = ctx.rootGetters["web3Store/instance"]();
		const MAX_VALUE = new web3.utils.BN("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
		const accountAddress = ctx.rootGetters["web3Store/account"];
		const tokenContract = ctx.getters.getContractBySymbol(tokenSymbol);
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
		const addr = HYDRO_ADDRESS;
		return new web3.eth.Contract(erc20, addr);
	},

	usx: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = USX_ADDRESS;
		return new web3.eth.Contract(erc20, addr);
	},

	usdc: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = USDC_ADDRESS;
		return new web3.eth.Contract(erc20, addr);
	},

	getHydroInfo: (state: any) => state.hydro,

	getUsxInfo: (state: any) => state.usx,

	hxBalance: (state: StateType, _getters: any) => {
		return parseFloat(state.balance.HX);
	},

	usxBalance: (state: StateType, _getters: any) => {
		return parseFloat(state.balance.HX);
	},

	tokenBalance: (state: StateType) => {
		const hxBalance = parseFloat(state.balance.HX);
		const usxBalance = parseFloat(state.balance.HX);
		return {
			USX: usxBalance,
			HX: hxBalance
		};
	},

	getContractBySymbol: (_state: any, getters: any) => (symbol: string) => {
		switch (symbol) {
		case USX.symbol:
			return getters.usx;
		case HX.symbol:
			return getters.hydro;
		case USDC.symbol:
			return getters.usdc;
		default:
			return getters.hx;
		}
	}
};
