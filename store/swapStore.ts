import { GetterTree, ActionTree, MutationTree} from "vuex";
import Web3 from "web3";
import { Web3State } from "./web3Store";
import router from "./abi/router.json";
import { fromWei, toWei } from "~/utils/bnTools";
import { getPath, nuMINT, NUON, USDC } from "~/constants/tokens";
import { tokenPairs } from "~/constants/addresses";

type SwapStateType = {
	allowance: any,
	swapFee: number,
	uniswapRouterAddress: string
}
export const state = (): SwapStateType => ({
	allowance: {},
	swapFee: 0.25,
	uniswapRouterAddress: ""
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
	setAllowance(state, payload: any) {
		state.allowance = { ... state.allowance, ... payload};
	},
	setRouterAddress(state, payload: string) {
		state.uniswapRouterAddress = payload;
	}
};
export const getters: GetterTree<SwapState, Web3State> = {
	contract: (state: any, _getters: any, store: any) => {
		const web3 = store.web3Store.instance();
		return new web3.eth.Contract(router, state.uniswapRouterAddress);
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
		const routerAddress = ctx.rootGetters["addressStore/router"];
		ctx.commit("setRouterAddress", routerAddress);

		ctx.dispatch("getAllowance");
	},
	async getAllowance (ctx: any) {
		const address = ctx.rootGetters["web3Store/account"];
		const routerAddress = ctx.state.uniswapRouterAddress;
		const nuonAllowance = fromWei(await ctx.rootGetters["erc20Store/nuon"].methods.allowance(address, routerAddress).call());
		const hydroAllowance = fromWei(await ctx.rootGetters["erc20Store/hydro"].methods.allowance(address, routerAddress).call());
		const usdcAllowance = fromWei(await ctx.rootGetters["erc20Store/usdc"].methods.allowance(address, routerAddress).call());
		ctx.commit("setAllowance", {[nuMINT.symbol]: hydroAllowance, [NUON.symbol]: nuonAllowance, [USDC.symbol]: usdcAllowance});
	},
	approveToken(ctx: any, {tokenName, onConfirm, onReject, onCallback}): void {
		const routerAddress = ctx.state.uniswapRouterAddress;
		ctx.dispatch("erc20Store/approveToken", {tokenSymbol: tokenName, contractAddress: routerAddress, onConfirm, onReject, onCallback}, {root:true} )
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
		const pathAddresses = path.tokens.map((token: string) => ctx.rootGetters["addressStore/tokens"][token]);
		const res =  await ctx.getters.contract.methods.getAmountsOut(Web3.utils.toWei(amount), pathAddresses).call();
		return convertPathIntoMap(res, path.tokens);
	},
	async getAmountsIn(ctx: any, { inputToken, outputToken, amount }) {
		const path = getPath(inputToken, outputToken);
		const pathAddresses = path.tokens.map((token: string) => ctx.rootGetters["addressStore/tokens"][token]);
		const res = await ctx.getters.contract.methods.getAmountsIn(Web3.utils.toWei(amount),pathAddresses).call();
		return convertPathIntoMap(res, path.tokens);
	},
	swapExactTokensForTokens(ctx: any, { inputToken, inputAmount, outputToken, outputAmount:_outputAmount, callback, slippage:_slippiage }) {
		const accountAddress = ctx.rootState.web3Store.account;
		const path = getPath(inputToken, outputToken);
		const pathAddresses = path.tokens.map((token: string) => ctx.rootGetters["addressStore/tokens"][token]);
		return ctx.getters.contract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
			Web3.utils.toWei(inputAmount),
			0,
			pathAddresses,
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
		const pathAddresses = path.tokens.map((token: string) => ctx.rootGetters["addressStore/tokens"][token]);

		return ctx.getters.contract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
			amountInMax,
			Web3.utils.toWei(outputAmount),
			pathAddresses,
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
			[tokenPair?.pairs[0] as string]: fromWei(result[0], ctx.rootState.erc20Store.decimals[tokenPair?.pairs[0] as string]),
			[tokenPair?.pairs[1] as string]: fromWei(result[1], ctx.rootState.erc20Store.decimals[tokenPair?.pairs[1] as string])
		};
	}
};
