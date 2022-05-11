import { GetterTree, ActionTree, MutationTree } from "vuex";
import Web3 from "web3";

export const state = () => ({
	price: {}
});

export type Web3State = ReturnType<typeof state>

export const mutations: MutationTree<Web3State> = {
	setPrice (state, payload) {
		state.price = payload;
	},
};

export const actions: ActionTree<Web3State, Web3State> = {
	async getTokenPrices(ctx: any) {
		const stabilityFlashContract = ctx.rootGetters["contractStore/stabilityFlash"];
		const usxPrice = Web3.utils.fromWei(await stabilityFlashContract.methods.getUSXPriceInDAI().call());
		const hxPrice = Web3.utils.fromWei(await stabilityFlashContract.methods.getHYDROPriceInDAI().call());
		ctx.commit("setPrice", {
			USX: parseFloat(usxPrice),
			HX: parseFloat(hxPrice),
			DAI: 1
		});
	}
};

export const getters: GetterTree<Web3State, Web3State> = {
	
};
