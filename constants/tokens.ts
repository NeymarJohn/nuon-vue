export const HX = {
	symbol: "HX",
	name: "HYDRO TOKEN"
};

export const NUON = {
	symbol: "NUON",
	name: "NUON TOKEN"
};

export const USDC = {
	symbol: "USDC",
	name: "USDC TOKEN"
};

export const USDT = {
	symbol: "USDT",
	name: "USDT TOKEN"
};

export const ETH = {
	symbol: "ETH",
	name: "ETHER"
};

export const USDC_USDT_LP_TOKEN = {
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
	},
	DAI_NUON: {
		tokens: [USDC.symbol, NUON.symbol],
	},
	HX_USDC: {
		tokens: [HX.symbol, USDC.symbol],
	},
	USDC_HX: {
		tokens: [USDC.symbol, HX.symbol],
	},
	HX_NUON: {
		tokens: [HX.symbol, USDC.symbol, NUON.symbol],
	},
	NUON_HX: {
		tokesn: [NUON.symbol, USDC.symbol, HX.symbol],
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
