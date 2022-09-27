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
	oraclePrice: initalPrice,
	priceWithDecimal: {},
});

export type Web3State = ReturnType<typeof state>

export const mutations: MutationTree<Web3State> = {
	setPrice (state, payload) {
		state.price = payload;
	},
	setOraclePrice (state, payload) {
		state.oraclePrice = payload;
	},
	setPriceWithDecimal(state, payload) {
		state.priceWithDecimal = {...state.priceWithDecimal, ...payload};
	}
};

export const actions: ActionTree<Web3State, Web3State> = {
	async getTokenOraclePrices(ctx: any) {
		const nuonController = ctx.rootGetters["contractStore/nuonController"];
		const chubNativeContract = ctx.rootGetters["contractStore/collateralNative"];
		const wethPrice = Number(fromWei(await chubNativeContract.methods.getCollateralPrice().call()));
		const nuonPrice = await nuonController.methods.getNUONPrice().call();
		ctx.commit("setOraclePrice", {
			NUON: Number(fromWei(nuonPrice, ctx.rootState.erc20Store.decimals.NUON)),
			DAI: 1,
			USDT: 1,
			[WETH.symbol]: wethPrice,
		});
	},
	async getTokenSwapPrices(ctx: any) {
		const reservesUsdtNumint = await ctx.dispatch("swapStore/getReserves", [USDT.symbol, nuMINT.symbol], {root: true});
		const nuMintPrice = reservesUsdtNumint[USDT.symbol] / reservesUsdtNumint[nuMINT.symbol];
		const reservesUsdtNuon = await ctx.dispatch("swapStore/getReserves", [USDT.symbol, NUON.symbol], {root: true});
		const nuonPoolPrice = reservesUsdtNuon[USDT.symbol] / reservesUsdtNuon[NUON.symbol];
		const reservesUsdtWeth = await ctx.dispatch("swapStore/getReserves", [USDT.symbol, WETH.symbol], {root: true});
		const wethPoolPrice = reservesUsdtWeth[USDT.symbol] / reservesUsdtWeth[WETH.symbol];

		ctx.commit("setPriceWithDecimal", {
			[WETH.symbol]: { value: wethPoolPrice, decimals: ctx.rootState.erc20Store.decimals.WETH},
			NUON: { value: nuonPoolPrice, decimals: ctx.rootState.erc20Store.decimals.NUON},
			DAI: { value: 1, decimals: 0 },
			USDT: { value: 1, decimals: 0},
			[nuMINT.symbol]: { value: nuMintPrice, decimals: ctx.rootState.erc20Store.decimals.nuMINT }
		});
		ctx.commit("setPrice", {
			NUON: nuonPoolPrice,
			DAI: 1,
			USDT: 1,
			[WETH.symbol]: wethPoolPrice,
			[nuMINT.symbol]: nuMintPrice
		});
	},
};

export const getters: GetterTree<Web3State, Web3State> = {

};
