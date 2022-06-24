import { GetterTree } from "vuex";
import { Web3State } from "./web3Store";
import { BOARDROOM_ADDRESS, HYDRO_ADDRESS, NUON_USDC_PAIR_ADDRESS, ROUTER_ADDRESS, tokenPairs, TREASURY_ADDRESS, WETH_ADDRESS, USDC_ADDRESS, NUON_CONTROLLER_ADDRESS, NUON_ADDRESS } from "~/constants/addresses";

export const state = () => ({
	addr: {
		/**
     * @dev Hydro Testnet
     */
		 31010: {
			boardroom: BOARDROOM_ADDRESS,
			router: ROUTER_ADDRESS,
			nuonController: NUON_CONTROLLER_ADDRESS,
			oracle: NUON_USDC_PAIR_ADDRESS,
			weth: WETH_ADDRESS,
			hydro: HYDRO_ADDRESS,
			nuon: NUON_ADDRESS,
			usdc: USDC_ADDRESS,
			treasury: TREASURY_ADDRESS,
			uniswapV2Pair: tokenPairs
		},
		4: {
			boardroom: "0x0a5e2EeA70B9Db9f801750feEcA9b245aBC7a388",
			router: ROUTER_ADDRESS,
			nuonController: "0x0AF39204257a41c7B09d8AF8993dc5D03141a1CA",
			oracle: "0x9649329FbaBF1b49b3c1d8E04ea1A1978d691521",
			weth: "0x1AB158d908aCFD0D4FdD0082675c411a203ECAB6",
			hydro: "0xB02322B6Cf0c8C25Ebd0Cad4aDC8ab935413a177",
			nuon: "0xE66Edfc2F5B2E98A35074eeAd30f5B6Ed2cccE4E",
			usdc: "0xBD9c0bc5AeB998A9d6C4e8293d2A49111EdE5509",
			treasury: "0xD3902ce5C4b4c4bdC7Fb5E7481b2B70fA1e4aB75",
			uniswapV2Pair: tokenPairs
		}
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
