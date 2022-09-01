import { GetterTree, ActionTree, MutationTree } from "vuex";
import { NUON, nuMINT, USDT, WETH } from "~/constants/tokens";
import { fromWei } from "~/utils/bnTools";

const initalPrice = {
	[NUON.symbol] : 0,
	[nuMINT.symbol]: 0,
	USDT: 1,
	DAI: 1,
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
		const chubNativeContract = ctx.rootGetters["contractStore/collateralNative"];
		const nuMintUsdtPair = await ctx.rootGetters["contractStore/uniswapV2Pair"]([nuMINT.symbol, USDT.symbol]);

		const wethPrice = Number(fromWei(await chubNativeContract.methods.getCollateralPrice().call()));
		const nuonPrice = await nuonController.methods.getNUONPrice().call();
		const reserves = await nuMintUsdtPair.methods.getReserves().call();
		const nuMintPrice = Number(fromWei(reserves[1], ctx.rootState.erc20Store.decimals.USDT)) / Number(fromWei(reserves[0], ctx.rootState.erc20Store.decimals.nuMINT));
		ctx.commit("setPrice", {
			NUON: Number(fromWei(nuonPrice, ctx.rootState.erc20Store.decimals.NUON)),
			DAI: 1,
			USDT: 1,
			[WETH.symbol]: wethPrice,
			[nuMINT.symbol]: nuMintPrice
		});

		ctx.commit("setPriceWithDecimal", {
			NUON: { value: nuonPrice, decimals: ctx.rootState.erc20Store.decimals.NUON},
			DAI: { value: 1, decimals: 0 },
			USDT: { value: 1, decimals: 0},
			[nuMINT.symbol]: { value: nuMintPrice, decimals: ctx.rootState.erc20Store.decimals.nuMINT }
		});
	},
};

export const getters: GetterTree<Web3State, Web3State> = {

};
