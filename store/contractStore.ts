import { GetterTree } from "vuex";
import { RootState } from "./rootStore";
import boardroomAbi from "./abi/boardroom.json";
import uniswapV2PairAbi from "./abi/uniswap_v2_pair.json";
import stabilityFlashAbi from "./abi/stability_flash.json";

export const state = () => ({
	
});

export type ContractState = ReturnType<typeof state>

export const getters: GetterTree<ContractState, RootState> = {
	boardroom: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].boardroom;
		return new web3.eth.Contract(boardroomAbi, addr);
	},
	uniswapV2Pair: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].uniswapV2Pair;
		return new web3.eth.Contract(uniswapV2PairAbi, addr);
	},
	stabilityFlash: (_state: any, _getters, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].stabilityFlash;
		return new web3.eth.Contract(stabilityFlashAbi, addr);
	}
};
