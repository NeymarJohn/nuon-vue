import { GetterTree, ActionTree, MutationTree} from "vuex";
import Web3 from "web3";
import { Web3State } from "./web3Store";
import router from "./abi/router.json";
import { fromWei, toWei } from "~/utils/bnTools";
import { getPath, nuMINT, NUON, USDT, WETH } from "~/constants/tokens";

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
		const nuMintAllowance = fromWei(await ctx.rootGetters["erc20Store/nuMint"].methods.allowance(address, routerAddress).call());
		const usdtAllowance = fromWei(await ctx.rootGetters["erc20Store/usdt"].methods.allowance(address, routerAddress).call());
		const wethAllowance = fromWei(await ctx.rootGetters["erc20Store/weth"].methods.allowance(address, routerAddress).call());
		ctx.commit("setAllowance", {
			[nuMINT.symbol]: nuMintAllowance, 
			[NUON.symbol]: nuonAllowance, 
			[USDT.symbol]: usdtAllowance,
			[WETH.symbol] :wethAllowance
		});
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
		const res =  await ctx.getters.contract.methods.getAmountsOut(toWei(amount, ctx.rootState.erc20Store.decimals[inputToken as string]), pathAddresses).call();
		return convertPathIntoMap(res, path.tokens);
	},
	async getAmountsIn(ctx: any, { inputToken, outputToken, amount }) {
		const path = getPath(inputToken, outputToken);
		const pathAddresses = path.tokens.map((token: string) => ctx.rootGetters["addressStore/tokens"][token]);
		const res = await ctx.getters.contract.methods.getAmountsIn(toWei(amount, ctx.rootState.erc20Store.decimals[inputToken as string]), pathAddresses).call();
		return convertPathIntoMap(res, path.tokens);
	},
	swapExactTokensForTokens(ctx: any, { inputToken, inputAmount, outputToken, outputAmount:_outputAmount, callback, slippage:_slippiage }) {
		const accountAddress = ctx.rootState.web3Store.account;
		const path = getPath(inputToken, outputToken);
		const pathAddresses = path.tokens.map((token: string) => ctx.rootGetters["addressStore/tokens"][token]);
		return ctx.getters.contract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
			toWei(inputAmount, ctx.rootState.erc20Store.decimals[inputToken as string]),
			0,
			pathAddresses,
			accountAddress,
			Math.floor(new Date().getTime() / 1000) + 86400
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
			toWei(outputAmount, ctx.rootState.erc20Store.decimals[outputToken as string]),
			pathAddresses,
			accountAddress,
			Math.floor(new Date().getTime() / 1000) + 86400
		).send({from: accountAddress}).on("transactionHash", function(){
			callback();
		});
	},
	async getReserves(ctx: any, pair: Array<string>) {
		const path = getPath(pair[0], pair[1]).tokens;
		if (path.length === 2) {
			const uniswapV2PairContract = await ctx.rootGetters["contractStore/uniswapV2Pair"](pair);
			const result = await uniswapV2PairContract.methods.getReserves().call();
			const token0 = await uniswapV2PairContract.methods.token0().call();
			const token1 = await uniswapV2PairContract.methods.token1().call();
			const token0Symbol = ctx.rootGetters["addressStore/tokenByAddress"](token0);
			const token1Symbol = ctx.rootGetters["addressStore/tokenByAddress"](token1);
			return {
				[token0Symbol as string]: fromWei(result[0], ctx.rootState.erc20Store.decimals[token0Symbol as string]),
				[token1Symbol as string]: fromWei(result[1], ctx.rootState.erc20Store.decimals[token1Symbol as string])
			};
		} else if (path.length === 3) { // for the path with 3 tokens
			const firstPair:any = {};
			const secondPair:any = {};
			{
				const uniswapV2PairContract = await ctx.rootGetters["contractStore/uniswapV2Pair"]([path[0], path[1]]);
				const result = await uniswapV2PairContract.methods.getReserves().call();
				const token0 = await uniswapV2PairContract.methods.token0().call();
				const token1 = await uniswapV2PairContract.methods.token1().call();
				const token0Symbol = ctx.rootGetters["addressStore/tokenByAddress"](token0);
				const token1Symbol = ctx.rootGetters["addressStore/tokenByAddress"](token1);
				firstPair[token0Symbol as string] = fromWei(result[0], ctx.rootState.erc20Store.decimals[token0Symbol as string]);
				firstPair[token1Symbol as string] = fromWei(result[1], ctx.rootState.erc20Store.decimals[token1Symbol as string]);
			}
			{
				const uniswapV2PairContract = await ctx.rootGetters["contractStore/uniswapV2Pair"]([path[1], path[2]]);
				const result = await uniswapV2PairContract.methods.getReserves().call();
				const token0 = await uniswapV2PairContract.methods.token0().call();
				const token1 = await uniswapV2PairContract.methods.token1().call();
				const token0Symbol = ctx.rootGetters["addressStore/tokenByAddress"](token0);
				const token1Symbol = ctx.rootGetters["addressStore/tokenByAddress"](token1);
				secondPair[token0Symbol as string] = fromWei(result[0], ctx.rootState.erc20Store.decimals[token0Symbol as string]);
				secondPair[token1Symbol as string] = fromWei(result[1], ctx.rootState.erc20Store.decimals[token1Symbol as string]);
			}
			return {
				[path[0]]: firstPair[path[0]],
				[path[2]]: secondPair[path[2]],
			};
		}
		
	}
};
