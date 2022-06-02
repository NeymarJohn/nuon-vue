import { GetterTree, ActionTree, MutationTree} from "vuex";
import Web3 from "web3";
import { Web3State } from "./web3Store";
import router from "./abi/router.json";
import { fromWei, toWei } from "~/utils/bnTools";
import { getPath } from "~/constants/tokens";
import { ROUTER_ADDRESS , tokenPairs } from "~/constants/addresses";

type SwapStateType = {
	allowance: {HX: number, NUON: number},
	swapFee: number
}
export const state = (): SwapStateType => ({
	allowance: {HX:0, NUON: 0},
	swapFee: 0.25
});

export type SwapState = ReturnType<typeof state>

const convertPathIntoMap = (values: Array<any>, tokens: Array<any>) => {
	const m: any = {};
	values.forEach((value, index) => {
		m[tokens[index]] = value;
	});
	return m;
};
export const mutations: MutationTree<SwapState> = {
	setAllowance(state, payload: {HX:number, NUON: number}) {
		state.allowance = payload;
	}
};
export const getters: GetterTree<SwapState, Web3State> = {
	contract: (_state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		const routerAddress = ROUTER_ADDRESS;
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
		const getNuonAllowance = fromWei(await ctx.rootGetters["erc20Store/nuon"].methods.allowance(address, ROUTER_ADDRESS).call());
		const getHydroAllowance = fromWei(await ctx.rootGetters["erc20Store/hydro"].methods.allowance(address, ROUTER_ADDRESS).call());
		ctx.commit("setAllowance", {HX: getHydroAllowance, NUON: getNuonAllowance});
	},
	approveToken(ctx: any, {tokenName, onConfirm, onReject, onCallback}): void {
		ctx.dispatch("erc20Store/approveToken", {tokenSymbol: tokenName, contractAddress: ROUTER_ADDRESS, onConfirm, onReject, onCallback}, {root:true} )
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
		const res =  await ctx.getters.contract.methods.getAmountsOut(Web3.utils.toWei(amount), path.addresses).call();
		return convertPathIntoMap(res, path.tokens);
	},
	async getAmountsIn(ctx: any, { inputToken, outputToken, amount }) {
		const path = getPath(inputToken, outputToken);
		const res = await ctx.getters.contract.methods.getAmountsIn(Web3.utils.toWei(amount),path.addresses).call();
		return convertPathIntoMap(res, path.tokens);
	},
	swapExactTokensForTokens(ctx: any, { inputToken, inputAmount, outputToken, outputAmount:_outputAmount, callback, slippage:_slippiage }) {
		const accountAddress = ctx.rootState.web3Store.account;
		const path = getPath(inputToken, outputToken);
		return ctx.getters.contract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
			Web3.utils.toWei(inputAmount),
			0,
			path.addresses,
			accountAddress,
			new Date().getTime()
		).send({from: accountAddress}).on("transactionHash", function(){
			callback();
		});
	},
	swapTokensForExactTokens(ctx: any, { inputToken, inputAmount, outputToken, outputAmount, callback, slippage }) {
		const accountAddress = ctx.rootState.web3Store.account;
		const amountInMax = ctx.getters.getMaxInputWithSlippage({value: inputAmount, slippage});
		const path = getPath(inputToken, outputToken);

		return ctx.getters.contract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
			amountInMax,
			Web3.utils.toWei(outputAmount),
			path.addresses,
			accountAddress,
			new Date().getTime()
		).send({from: accountAddress}).on("transactionHash", function(){
			callback();
		});
	},
	async getReserves(ctx: any, pair: Array<string>) {
		const tokenPair = tokenPairs.find(token => token.pairName.includes(pair[0]) && token.pairName.includes(pair[1]));
		const result = await ctx.rootGetters["contractStore/uniswapV2Pair"](pair).methods.getReserves().call();
		return {
			[tokenPair?.pairs[0] as string]: fromWei(result[0]),
			[tokenPair?.pairs[1] as string]: fromWei(result[1])
		};
	}
};
