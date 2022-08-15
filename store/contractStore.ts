import { GetterTree } from "vuex";
import { RootState } from "./rootStore";
import boardroomAbi from "./abi/boardroom.json";
import uniswapV2FactoryAbi from "./abi/uniswap_v2_factory.json";
import uniswapV2PairAbi from "./abi/uniswap_v2_pair.json";
import nuonControllerAbi from  "./abi/nuon_controller.json";
import treasuryAbi from  "./abi/treasury.json";
import collateralNative from "./abi/collateral_hub_native.json";

export const state = () => ({
	
});

export type ContractState = ReturnType<typeof state>

export const getters: GetterTree<ContractState, RootState> = {
	boardroom: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].boardroom;
		return new web3.eth.Contract(boardroomAbi, addr);
	},
	uniswapV2Factory: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].uniswapV2Factory;
		return new web3.eth.Contract(uniswapV2FactoryAbi, addr);
	},
	uniswapV2Pair: (_state: any, _getters: any, store: any) => async (tokens: Array<string>) => {
		const token0Address = store.addressStore.addr[store.web3Store.chainId as number].tokens[tokens[0]];
		const token1Address = store.addressStore.addr[store.web3Store.chainId as number].tokens[tokens[1]];
		const pairAddress = await _getters.uniswapV2Factory.methods.getPair(token0Address, token1Address).call();
		const web3 = store.web3Store.instance();
		return new web3.eth.Contract(uniswapV2PairAbi, pairAddress);
	},
	nuonController: (_state: any, _getters, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].nuonController;
		return new web3.eth.Contract(nuonControllerAbi, addr);
	},
	treasury: (_state: any, _getters, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].treasury;
		return new web3.eth.Contract(treasuryAbi, addr);
	},
	collateralNative: (_state: any, _getters, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].collatralHubs.WETH;
		return new web3.eth.Contract(collateralNative, addr);
	}
};
