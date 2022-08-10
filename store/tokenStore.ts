import { GetterTree, ActionTree, MutationTree } from "vuex";
import { NUON, nuMINT, USDC } from "~/constants/tokens";
import { fromWei } from "~/utils/bnTools";

const initalPrice = {
	[NUON.symbol] : 0,
	[nuMINT.symbol]: 0,
	DAI: 1,
	USDC: 1
};
export const state = () => ({
	price: initalPrice,
	priceWithDecimal: {},
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
		const hxUsdcPair = await ctx.rootGetters["contractStore/uniswapV2Pair"]([nuMINT.symbol, USDC.symbol]);
		const nuonPrice = await nuonController.methods.getNUONPrice().call();
		const reserves = await hxUsdcPair.methods.getReserves().call();
		const nuMintPrice = Number(fromWei(reserves[1], ctx.rootState.erc20Store.decimals.USDC)) / Number(fromWei(reserves[0], ctx.rootState.erc20Store.decimals.nuMINT));
		ctx.commit("setPrice", {
			NUON: Number(fromWei(nuonPrice, ctx.rootState.erc20Store.decimals.NUON)),
			DAI: 1,
			USDC: 1,
			[nuMINT.symbol]: nuMintPrice
		});

		ctx.commit("setPriceWithDecimal", {
			NUON: { value: nuonPrice, decimals: ctx.rootState.erc20Store.decimals.NUON},
			DAI: { value: 1, decimals: 0 },
			USDC: { value: 1, decimals: 0},
			[nuMINT.symbol]: { value: nuMintPrice, decimals: ctx.rootState.erc20Store.decimals.nuMINT }
		});
	},
};

export const getters: GetterTree<Web3State, Web3State> = {

};
