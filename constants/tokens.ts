import { ETH_ADDRESS, HYDRO_ADDRESS, NUON_ADDRESS, USDC_ADDRESS, USDT_ADDRESS, USDC_USDT_PAIR_ADDRESS } from "./addresses";

export const HX = {
	address: HYDRO_ADDRESS,
	symbol: "HX",
	name: "HYDRO TOKEN"
};

export const NUON = {
	address: NUON_ADDRESS,
	symbol: "NUON",
	name: "NUON TOKEN"
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

export const ETH = {
	address: ETH_ADDRESS,
	symbol: "ETH",
	name: "ETHER"
};

export const USDC_USDT_LP_TOKEN = {
	address: USDC_USDT_PAIR_ADDRESS,
	symbol: "USDC-USDT LP",
	name: "USDC-USDT LP TOKEN"
};

export const TOKENS_MAP:any = {
	HX,
	NUON,
	USDC,
	USDT,
	USDC_USDT_LP_TOKEN,
	ETH
};

const paths:any =  {
	NUON_USDC: {
		tokens: [NUON.symbol, USDC.symbol],
		addresses: [NUON_ADDRESS, USDC_ADDRESS],
	},
	DAI_NUON: {
		tokens: [USDC.symbol, NUON.symbol],
		addresses: [USDC_ADDRESS, NUON_ADDRESS]
	},
	HX_USDC: {
		tokens: [HX.symbol, USDC.symbol],
		addresses: [HYDRO_ADDRESS, USDC_ADDRESS]
	},
	USDC_HX: {
		tokens: [USDC.symbol, HX.symbol],
		addresses: [USDC_ADDRESS, HYDRO_ADDRESS]
	},
	HX_NUON: {
		tokens: [HX.symbol, USDC.symbol, NUON.symbol],
		addresses: [HYDRO_ADDRESS, USDC_ADDRESS, NUON_ADDRESS]
	},
	NUON_HX: {
		tokesn: [NUON.symbol, USDC.symbol, HX.symbol],
		addresses: [NUON_ADDRESS, USDC_ADDRESS, HYDRO_ADDRESS]
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
];

export const mainTokens = [
	{ "symbol": USDC.symbol, "name": USDC.name, "icon": "USDC.png"  },
	{ "symbol": HX.symbol, "name": HX.name, "icon": "Hydro.png" },
	{ "symbol": NUON.symbol, "name": NUON.name, "icon": "NUON.png"  },
];
