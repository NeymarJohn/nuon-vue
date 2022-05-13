import { DAI_ADDRESS, HYDRO_ADDRESS, USX_ADDRESS, USDC_ADDRESS, USDT_ADDRESS, USDC_USDT_PAIR_ADDRESS } from "./addresses";
import paths from "./paths";

export const HX = {
	address: HYDRO_ADDRESS,
	symbol: "HX",
	name: "HYDRO TOKEN"
};

export const USX = {
	address: USX_ADDRESS,
	symbol: "USX",
	name: "USX TOKEN"
};

export const DAI = {
	address: DAI_ADDRESS,
	symbol: "DAI",
	name: "DAI STABLE COIN"
};

export const USDC = {
	address: USDC_ADDRESS,
	symbol: "USDC",
	name: "USDC TOKEN"
};

export const USDT = {
	address: USDT_ADDRESS,
	symbol: "USDT",
	name: "USDT TOKEN"
};

export const USDC_USDT_LP_TOKEN = {
	address: USDC_USDT_PAIR_ADDRESS,
	symbol: "USDC-USDT LP",
	name: "USDC-USDT LP TOKEN"
};

export const TOKENS_MAP:any = {
	HX,
	USX,
	DAI,
	USDC,
	USDT,
	USDC_USDT_LP_TOKEN
};

export const getPath = (inputToken:string, outputToken:string) => {
	let path = paths[`${inputToken}_${outputToken}`];
	if (!path) path = [TOKENS_MAP[inputToken].address, TOKENS_MAP[outputToken].address];
	return path;
};

export const collateralTokens = [
	{ "symbol": USDC_USDT_LP_TOKEN.symbol, "name": USDC_USDT_LP_TOKEN.name, "icon": "USDC.png" },
	{ "symbol": USDC.symbol, "name": USDC.name, "icon": "USDC.png"  },
	{ "symbol": DAI.symbol, "name": DAI.name, "icon": "Dai.png"  },
];

export const swapTokens = [
	// { "symbol": USDT.symbol, "name": USDT.name, "icon": "USDT.png" },
	{ "symbol": USDC.symbol, "name": USDC.name, "icon": "USDC.png"  },
	// { "symbol": DAI.symbol, "name": DAI.name, "icon": "Dai.png"  },
	{ "symbol": HX.symbol, "name": HX.name, "icon": "Hydro.png" },
	{ "symbol": USX.symbol, "name": USX.name, "icon": "USX.png"  },
];
