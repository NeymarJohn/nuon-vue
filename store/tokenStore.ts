import { GetterTree, ActionTree, MutationTree } from "vuex";
import { HX, NUON } from "~/constants/tokens";
import { fromWei } from "~/utils/bnTools";

const initalPrice = {
	[HX.symbol] : 0,
	[NUON.symbol] : 0,
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
		const nuonController = ctx.rootGetters["contractStore/nuonController"];
		const hxUsdcPair = ctx.rootGetters["contractStore/uniswapV2Pair"](["HX", "USDC"]);
		const nuonPrice = await nuonController.methods.getNUONPrice().call();
		const reserves = await hxUsdcPair.methods.getReserves().call();
		const hxPrice = Number(fromWei(reserves[1], ctx.rootState.erc20Store.decimals.USDC)) / Number(fromWei(reserves[0], ctx.rootState.erc20Store.decimals.HX));
		ctx.commit("setPrice", {
			NUON: Number(fromWei(nuonPrice, ctx.rootState.erc20Store.decimals.NUON)),
			HX: hxPrice,
			DAI: 1,
			USDC: 1,
		});

		ctx.commit("setPriceWithDecimal", {
			NUON: { value: nuonPrice, decimals: ctx.rootState.erc20Store.decimals.NUON},
			HX: { value: hxPrice, decimals: ctx.rootState.erc20Store.decimals.HX},
			DAI: { value: 1, decimals: 0 },
			USDC: { value: 1, decimals: 0},
		});
	},
};

export const getters: GetterTree<Web3State, Web3State> = {
	
};
