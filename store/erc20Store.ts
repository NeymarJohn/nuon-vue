import { GetterTree, ActionTree, MutationTree } from "vuex";
import { Web3State } from "./web3Store";
import erc20 from "./abi/erc20.json";
import { ETH, HX, NUON, USDC } from "~/constants/tokens";
import { ETH_ADDRESS, HYDRO_ADDRESS, NUON_ADDRESS, USDC_ADDRESS } from "~/constants/addresses";
import { fromWei } from "~/utils/bnTools";

type StateType = {
	balance: {
		NUON: string,
		HX: string,
		USDC: string,
		ETH: string
	},
	decimals: {
		NUON: number,
		HX: number,
		USDC: number,
		ETH: number
	}
}
/**
 * @TODO required to refactor, to accept any ERC20
 */
export const state = (): StateType => ({
	balance: {
		NUON: "0",
		HX: "0",
		USDC: "0",
		ETH: "0"
	},
	decimals: {
		NUON: 18,
		HX: 18,
		USDC: 6,
		ETH: 18
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
		const nuonBalance = fromWei(await ctx.getters.nuon.methods.balanceOf(address).call(), ctx.state.decimals.NUON);
		const hydroBalance = fromWei(await ctx.getters.hydro.methods.balanceOf(address).call(), ctx.state.decimals.HX) ;
		const usdcBalance = fromWei(await ctx.getters.usdc.methods.balanceOf(address).call(), usdcDecimals);
		const ethBalance = fromWei(await ctx.getters.eth.methods.balanceOf(address).call(), ctx.state.decimals.ETH);

		ctx.commit("setBalance", {
			HX: hydroBalance,
			NUON: nuonBalance,
			USDC: usdcBalance,
			ETH: ethBalance
		});
		ctx.commit("setDecimals", {
			HX: 18,
			NUON: 18,
			USDC: usdcDecimals,
			ETH: 18
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

	nuon: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = NUON_ADDRESS;
		return new web3.eth.Contract(erc20, addr);
	},

	usdc: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = USDC_ADDRESS;
		return new web3.eth.Contract(erc20, addr);
	},

	eth: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = ETH_ADDRESS;
		return new web3.eth.Contract(erc20, addr);
	},

	getHydroInfo: (state: any) => state.hydro,

	getNuonInfo: (state: any) => state.nuon,

	hxBalance: (state: StateType, _getters: any) => {
		return parseFloat(state.balance.HX);
	},

	nuonBalance: (state: StateType, _getters: any) => {
		return parseFloat(state.balance.NUON);
	},

	tokenBalance: (state: StateType) => {
		const hxBalance = parseFloat(state.balance.HX);
		const nuonBalance = parseFloat(state.balance.NUON);
		const usdcBalance = parseFloat(state.balance.USDC);
		const ethBalance = parseFloat(state.balance.ETH);

		return {
			NUON: nuonBalance,
			HX: hxBalance,
			USDC: usdcBalance,
			ETH: ethBalance
		};
	},

	getContractBySymbol: (_state: any, getters: any) => (symbol: string) => {
		switch (symbol) {
		case NUON.symbol:
			return getters.nuon;
		case HX.symbol:
			return getters.hydro;
		case USDC.symbol:
			return getters.usdc;
		case ETH.symbol:
			return getters.eth;
		default:
			return getters.hx;
		}
	}
};
