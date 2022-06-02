import { DAI_ADDRESS, HYDRO_ADDRESS, USX_ADDRESS, USDC_ADDRESS, USDT_ADDRESS, USDC_USDT_PAIR_ADDRESS } from "./addresses";

export const HX = {
	address: HYDRO_ADDRESS,
	symbol: "HX",
	name: "HYDRO TOKEN"
};

export const USX = {
	address: USX_ADDRESS,
	symbol: "NUON",
	name: "NUON TOKEN"
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

const paths:any =  {
	USX_USDC: {
		tokens: [USX.symbol, USDC.symbol],
		addresses: [USX_ADDRESS, DAI_ADDRESS],
	},
	DAI_USX: {
		tokens: [USDC.symbol, USX.symbol],
		addresses: [DAI_ADDRESS, USX_ADDRESS]
	},
	HX_USDC: {
		tokens: [HX.symbol, USDC.symbol],
		addresses: [HYDRO_ADDRESS, DAI_ADDRESS]
	},
	USDC_HX: {
		tokens: [USDC.symbol, HX.symbol],
		addresses: [DAI_ADDRESS, HYDRO_ADDRESS]
	},
	HX_USX: {
		tokens: [HX.symbol, USDC.symbol, USX.symbol],
		addresses: [HYDRO_ADDRESS, USDC_ADDRESS, USX_ADDRESS]
	},
	USX_HX: {
		tokesn: [USX.symbol, USDC.symbol, HX.symbol],
		addresses: [USX_ADDRESS, USDC_ADDRESS, HYDRO_ADDRESS]
	}
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

export const mainTokens = [
	{ "symbol": USDC.symbol, "name": USDC.name, "icon": "USDC.png"  },
	{ "symbol": HX.symbol, "name": HX.name, "icon": "Hydro.png" },
	{ "symbol": USX.symbol, "name": USX.name, "icon": "USX.png"  },
];
