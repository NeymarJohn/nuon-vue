import { GetterTree, ActionTree, MutationTree } from "vuex";
import { HX, USX } from "~/constants/tokens";
import { fromWei } from "~/utils/bnTools";

const initalPrice = {
	[HX.symbol] : 0,
	[USX.symbol] : 0,
	DAI: 1,
	USDC: 1
};
export const state = () => ({
	price: initalPrice,
	priceWithDecimal: {}, // backed up prices with decimal { value: xx, decimals: 4}
});

export type Web3State = ReturnType<typeof state>

export const mutations: MutationTree<Web3State> = {
	setPrice (state, payload) {
		state.price = payload;
	},
	setPriceWithDecimal(state, payload) {
		state.priceWithDecimal = {...state.priceWithDecimal, ...payload};
	}
};

export const actions: ActionTree<Web3State, Web3State> = {
	async getTokenPrices(ctx: any) {
		const stabilityFlashContract = ctx.rootGetters["contractStore/stabilityFlash"];
		const usxPrice = await stabilityFlashContract.methods.getUSXPriceInUSDC().call();
		const hxPrice = await stabilityFlashContract.methods.getHYDROPriceInUSDC().call();
		ctx.commit("setPrice", {
			USX: fromWei(usxPrice, ctx.rootState.erc20Store.decimals.USX),
			HX: fromWei(hxPrice, ctx.rootState.erc20Store.decimals.HX),
			DAI: 1,
			USDC: 1,
		});

		ctx.commit("setPriceWithDecimal", {
			USX: { value: usxPrice, decimals: ctx.rootState.erc20Store.decimals.USX},
			HX: { value: hxPrice, decimals: ctx.rootState.erc20Store.decimals.HX},
			DAI: { value: 1, decimals: 0 },
			USDC: { value: 1, decimals: 0},
		});
	}
};

export const getters: GetterTree<Web3State, Web3State> = {
	
};
