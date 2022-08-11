import { GetterTree, ActionTree, MutationTree } from "vuex";
import { Web3State } from "./web3Store";
import erc20 from "./abi/erc20.json";
import usdc from "./abi/usdc.json";
import ethFaucet from "./abi/eth_faucet.json";
import { ETH, nuMINT, NUON, USDC } from "~/constants/tokens";
import { fromWei } from "~/utils/bnTools";

type StateType = {
	balance: {
		NUON: string,
		nuMINT: string,
		USDC: string,
		ETH: string
	},
	decimals: {
		NUON: number,
		nuMINT: number,
		USDC: number,
		ETH: number
	},
	supply: {
		NUON: string,
		nuMINT: string
	}
}
/**
 * @TODO required to refactor, to accept any ERC20
 */
export const state = (): StateType => ({
	balance: {
		NUON: "0",
		USDC: "0",
		ETH: "0",
		nuMINT:"0"
	},
	decimals: {
		NUON: 18,
		USDC: 6,
		ETH: 18,
		nuMINT:18

	},
	supply: {
		NUON: "0",
		nuMINT:"0"
	}
});

export type Erc20State = ReturnType<typeof state>

export const mutations: MutationTree<Erc20State> = {
	setBalance(state, payload: any) {
		state.balance = payload;
	},
	setDecimals(state, payload: any) {
		state.decimals = payload;
	},
	setSupply(state, payload: any) {
		state.supply = payload;
	}
};

export const actions: ActionTree<Erc20State, Erc20State> = {
	async initializeBalance (ctx: any, {address}) {
		const usdcDecimals = await ctx.getters.usdc.methods.decimals().call();
		const nuonBalance = fromWei(await ctx.getters.nuon.methods.balanceOf(address).call(), ctx.state.decimals.NUON);
		const nuMintBalance = fromWei(await ctx.getters.nuMint.methods.balanceOf(address).call(), ctx.state.decimals.nuMINT);
		const usdcBalance = fromWei(await ctx.getters.usdc.methods.balanceOf(address).call(), usdcDecimals);
		const ethBalance = fromWei(await ctx.rootGetters["web3Store/instance"]().eth.getBalance(address));
		const nuonSupply = fromWei(await ctx.rootGetters["collateralVaultStore/getNUONSupply"]());
		const nuMintSupply = fromWei(await ctx.getters.nuMint.methods.totalSupply().call());

		ctx.commit("setBalance", {
			NUON: nuonBalance,
			USDC: usdcBalance,
			ETH: ethBalance,
			[nuMINT.symbol]: nuMintBalance
		});
		ctx.commit("setDecimals", {
			NUON: 18,
			USDC: usdcDecimals,
			ETH: 18,
			[nuMINT.symbol]: 18
		});
		ctx.commit("setSupply", {
			NUON: nuonSupply,
			[nuMINT.symbol]: nuMintSupply
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

	nuMint: (_state: any, _getters: any, store: any, rootGetters:any) => {
		const web3 = store.web3Store.instance();
		return new web3.eth.Contract(erc20, rootGetters["addressStore/tokens"]?.nuMINT);
	},

	nuon: (_state: any, _getters: any, store: any, rootGetters: any) => {
		const web3 = store.web3Store.instance();
		return new web3.eth.Contract(erc20, rootGetters["addressStore/tokens"]?.NUON);
	},

	usdc: (_state: any, _getters: any, store: any, rootGetters: any) => {
		const web3 = store.web3Store.instance();
		return new web3.eth.Contract(usdc, rootGetters["addressStore/tokens"]?.USDC);
	},

	eth: (_state: any, _getters: any, store: any, rootGetters: any) => {
		const web3 = store.web3Store.instance();
		return new web3.eth.Contract(erc20, rootGetters["addressStore/tokens"]?.ETH);
	},

	ethFaucet: (_state: any, _getteres: any, store: any, rootGetters: any) => {
		const web3 = store.web3Store.instance();
		return new web3.eth.Contract(ethFaucet, rootGetters["addressStore/ethFaucet"]);
	},

	getNuMintInfo: (state: any) => state.nuMint,

	getNuonInfo: (state: any) => state.nuon,

	nuMintBalance: (state: StateType, _getters: any) => {
		return parseFloat(state.balance.nuMINT);
	},

	nuonBalance: (state: StateType, _getters: any) => {
		return parseFloat(state.balance.NUON);
	},

	tokenBalance: (state: StateType) => {
		const nuMintBalance = parseFloat(state.balance.nuMINT);
		const nuonBalance = parseFloat(state.balance.NUON);
		const usdcBalance = parseFloat(state.balance.USDC);
		const ethBalance = parseFloat(state.balance.ETH);

		return {
			NUON: nuonBalance,
			nuMINT: nuMintBalance,
			USDC: usdcBalance,
			ETH: ethBalance
		};
	},

	getContractBySymbol: (_state: any, getters: any) => (symbol: string) => {
		switch (symbol) {
		case NUON.symbol:
			return getters.nuon;
		case nuMINT.symbol:
			return getters.nuMint;
		case USDC.symbol:
			return getters.usdc;
		case ETH.symbol:
			return getters.eth;
		default:
			return getters.nuMint;
		}
	}
};
