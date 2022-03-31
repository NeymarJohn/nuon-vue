import { GetterTree } from "vuex";
import { RootState } from "./rootStore";
import boardroomAbi from "./abi/boardroom.json";
import uniswapV2PairAbi from "./abi/uniswap_v2_pair.json";
import stabilityFlashAbi from "./abi/stability_flash.json";
import { tokenPairs } from "~/constants/addresses";

export const state = () => ({
	
});

export type ContractState = ReturnType<typeof state>

export const getters: GetterTree<ContractState, RootState> = {
	boardroom: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].boardroom;
		return new web3.eth.Contract(boardroomAbi, addr);
	},
	uniswapV2Pair: (_state: any, _getters: any, store: any) => (tokens: Array<string>) => {
		const tokenPair = tokenPairs.find(token => token.pairName.includes(tokens[0]) && token.pairName.includes(tokens[1]));
		const web3 = store.web3Store.instance();
		const addr = tokenPair?.address;
		return new web3.eth.Contract(uniswapV2PairAbi, addr);
	},
	stabilityFlash: (_state: any, _getters, store: any) => {
		const web3 = store.web3Store.instance();
		const addr = store.addressStore.addr[store.web3Store.chainId as number].stabilityFlash;
		return new web3.eth.Contract(stabilityFlashAbi, addr);
	}
};
