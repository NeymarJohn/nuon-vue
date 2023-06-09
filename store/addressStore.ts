import { GetterTree } from "vuex";
import { Web3State } from "./web3Store";
import { ADDRESS_CHAIN_DATA } from "~/constants/addresses";

export const state = () => ({
	addr: ADDRESS_CHAIN_DATA,
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

	nuMint: (state: any, _getters, store: any) => {
		const addr = state.addr[store.web3Store.chainId as number].nuMint;
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
	},

	collateralHubs: (state: any, _getters, store: any) => {
		const collateralHubs = state.addr[store.web3Store.chainId as number].collatralHubs;
		return collateralHubs;
	},

	ethFaucet: (state: any, _getters, store: any) => {
		const ethFaucet = state.addr[store.web3Store.chainId as number].ethFaucet;
		return ethFaucet;
	},

	vaultRelayers: (state: any, _getters, store: any) => {
		const relayers = state.addr[store.web3Store.chainId as number].vaultRelayers;
		return relayers;
	}
};
