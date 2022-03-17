import { GetterTree } from "vuex";
import { Web3State } from "./web3Store";
import { BOARDROOM_ADDRESS, DAI_ADDRESS, HYDRO_ADDRESS, ORACLE_USX_DAI_ADDRESS, ROUTER_ADDRESS, STABILITYFLASH_ADDRESS, TREASURY_ADDRESS, USX_ADDRESS, USX_CONTROLLER_ADDRESS, WETH_ADDRESS } from "~/constants/addresses";

export const state = () => ({
	addr: {
		/**
     * @dev Hydro Testnet
     */
		 31010: {
			boardroom: BOARDROOM_ADDRESS,
			stabilityFlash: STABILITYFLASH_ADDRESS,
			router: ROUTER_ADDRESS,
			controller: USX_CONTROLLER_ADDRESS,
			oracle: ORACLE_USX_DAI_ADDRESS,
			weth: WETH_ADDRESS,
			hydro: HYDRO_ADDRESS,
			usx: USX_ADDRESS,
			dai: DAI_ADDRESS,
			treasury: TREASURY_ADDRESS,
		},
	},
	tokens: {
		ETH: WETH_ADDRESS,
		HX: HYDRO_ADDRESS,
		USX: USX_ADDRESS,
		DAI: DAI_ADDRESS
	},
});

export type ContractState = ReturnType<typeof state>

export const getters: GetterTree<ContractState, Web3State> = {
	boardroom: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number].boardroom;
		return addr;
	},

	stabilityFlash: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number].stabilityFlash;
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

	controller: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store].controller;
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
	}
};
