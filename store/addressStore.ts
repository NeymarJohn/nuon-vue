import { GetterTree } from "vuex";
import { Web3State } from "./web3Store";
import { chainData } from "~/constants/addresses";

export const state = () => ({
	addr: chainData,
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
		const addr = state.addr[store.web3Store.chainId as number].router;
		return addr;
	},

	nuonController: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number].nuonController;
		return addr;
	},

	oracle: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number].oracle;
		return addr;
	},

	weth: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number].weth;
		return addr;
	},

	treasury: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number].treasury;
		return addr;
	},

	uniswapV2Pair: (state: any, _getters: any, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number].uniswapV2Pair;
		return addr;
	},

	addresses: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number];
		return addr;
	},

	tokens: (state: any, _getters, store: any) => {
		const tokenAddresses = state.addr[store.web3Store.chainId as number].tokens;
		return tokenAddresses;
	},

	tokenByAddress: (state: any, _getters, store: any) => (address: string) => {
		const tokenAddresses = state.addr[store.web3Store.chainId as number].tokens;
		const addressMap: any = {};
		Object.keys(tokenAddresses).forEach(key => {
			addressMap[tokenAddresses[key]] = key;
		});
		return addressMap[address];
	}
};
