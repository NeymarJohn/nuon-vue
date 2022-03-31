import { GetterTree, ActionTree, MutationTree} from "vuex";
import Web3 from "web3";
import { Web3State } from "./web3Store";
import router from "./abi/router.json";
import { fromWei, toWei } from "~/utils/bnTools";
import { getPath } from "~/constants/tokens";
import { ROUTER_ADDRESS } from "~/constants/addresses";

type SwapStateType = {
	allowance: {HX: number, USX: number}
}
export const state = (): SwapStateType => ({
	allowance: {HX:0, USX: 0}
});

export type SwapState = ReturnType<typeof state>

export const mutations: MutationTree<SwapState> = {
	setAllowance(state, payload: {HX:number, USX: number}) {
		state.allowance = payload;
	}
};
export const getters: GetterTree<SwapState, Web3State> = {
	contract: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const routerAddress = store.addressStore.addr[store.web3Store.chainId as number].router;
		return new web3.eth.Contract(router, routerAddress);
	},
	getMinOutputWithSlippage: (_state: any) => ({value, slippage, formatted}: any) => {
		let minOutput = Web3.utils.toBN(toWei(value));
		minOutput = minOutput.sub(minOutput.muln(slippage / 100));
		if (formatted) return Web3.utils.fromWei(minOutput);
		return minOutput;
	},
	getMaxInputWithSlippage: (_state: any) => ({value, slippage, formatted}: any) => {
		let maxInput = Web3.utils.toBN(toWei(value));
		maxInput = maxInput.add(maxInput.muln(slippage / 100));
		if (formatted) return Web3.utils.fromWei(maxInput);
		return maxInput;
	}
};

export const actions: ActionTree<SwapState, SwapState> = {
	initialize(ctx: any) {
		ctx.dispatch("getAllowance");
	},
	async getAllowance (ctx: any) {
		const address = ctx.rootGetters["web3Store/account"];
		const getUsxAllowance = parseFloat(fromWei(await ctx.rootGetters["erc20Store/usx"].methods.allowance(address, ROUTER_ADDRESS).call()));
		const getHydroAllowance = parseFloat(fromWei(await ctx.rootGetters["erc20Store/hydro"].methods.allowance(address, ROUTER_ADDRESS).call()));
		ctx.commit("setAllowance", {HX: getHydroAllowance, USX: getUsxAllowance});
	},
	approveToken(ctx: any, {tokenName, onConfirm, onReject, onCallback}): void {
		ctx.dispatch("erc20Store/approveToken", {tokenName, contractAddress: ROUTER_ADDRESS, onConfirm, onReject, onCallback}, {root:true} )
			.then(() =>{
				ctx.dispatch("getAllowance").then(() => {
					if (onCallback) onCallback(null);
				});
			}).catch((err: Error) => {
				if (onCallback) onCallback(err);
			});
	},
	async getAmountsOut(ctx: any, { inputToken, outputToken, amount }) {
		const path = getPath(inputToken, outputToken);
		return await ctx.getters.contract.methods.getAmountsOut(Web3.utils.toWei(amount), path).call();
	},
	async getAmountsIn(ctx: any, { inputToken, outputToken, amount }) {
		const path = getPath(inputToken, outputToken);
		return await ctx.getters.contract.methods.getAmountsIn(Web3.utils.toWei(amount),path).call();
	},
	swapExactTokensForTokens(ctx: any, { inputToken, inputAmount, outputToken, outputAmount:_outputAmount, callback, slippage:_slippiage }) {
		const accountAddress = ctx.rootState.web3Store.account;
		// const amoutOutMin = ctx.getters.getMinOutputWithSlippage({value: outputAmount, slippage});
		return ctx.getters.contract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
			Web3.utils.toWei(inputAmount),
			0,
			getPath(inputToken, outputToken),
			accountAddress,
			new Date().getTime()
		).send({from: accountAddress}).on("transactionHash", function(){
			callback();
		});
	},
	swapTokensForExactTokens(ctx: any, { inputToken, inputAmount, outputToken, outputAmount, callback, slippage }) {
		const accountAddress = ctx.rootState.web3Store.account;
		const amountInMax = ctx.getters.getMaxInputWithSlippage({value: inputAmount, slippage});
		return ctx.getters.contract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
			amountInMax,
			Web3.utils.toWei(outputAmount),
			getPath(inputToken, outputToken),
			accountAddress,
			new Date().getTime()
		).send({from: accountAddress}).on("transactionHash", function(){
			callback();
		});;
	},
	calculatePriceImpact(ctx: any) {
		console.log("root store", ctx.rootGetters);
		return ctx.rootGetters["contractStore/uniswapV2Pair"].methods.getReserves().call();
	}
};
