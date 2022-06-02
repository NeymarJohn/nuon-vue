import { GetterTree } from "vuex";
import { Web3State } from "./web3Store";
import { BOARDROOM_ADDRESS, HYDRO_ADDRESS, USX_USDC_PAIR_ADDRESS, ROUTER_ADDRESS, tokenPairs, TREASURY_ADDRESS, USX_ADDRESS, WETH_ADDRESS, USDC_ADDRESS, NUON_CONTROLLER_ADDRESS, NUON_ADDRESS } from "~/constants/addresses";

export const state = () => ({
	addr: {
		/**
     * @dev Hydro Testnet
     */
		 31010: {
			boardroom: BOARDROOM_ADDRESS,
			router: ROUTER_ADDRESS,
			nuonController: NUON_CONTROLLER_ADDRESS,
			oracle: USX_USDC_PAIR_ADDRESS,
			weth: WETH_ADDRESS,
			hydro: HYDRO_ADDRESS,
			nuon: NUON_ADDRESS,
			usdc: USDC_ADDRESS,
			treasury: TREASURY_ADDRESS,
			uniswapV2Pair: tokenPairs
		},
	},
	tokens: {
		ETH: WETH_ADDRESS,
		HX: HYDRO_ADDRESS,
		USDC: USDC_ADDRESS,
		NUON: NUON_ADDRESS
	},
});

export type ContractState = ReturnType<typeof state>

export const getters: GetterTree<ContractState, Web3State> = {
	boardroom: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number].boardroom;
		return addr;
	},

	nuon: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number].nuon;
		return addr;
	},

	hydro: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number].hydro;
		return addr;
	},

	router: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store].router;
		return addr;
	},

	nuonController: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store].nuonController;
		return addr;
	},

	oracle: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store].oracle;
		return addr;
	},

	weth: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store].weth;
		return addr;
	},

	treasury: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store].treasury;
		return addr;
	},

	uniswapV2Pair: (state: any, _getters: any, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number].uniswapV2Pair;
		return addr;
	}
};
