export const nuMINT = {
	symbol: "nuMINT",
	name: "NUMINT TOKEN"
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

export const BUSD = {
	symbol: "BUSD",
	name: "Binance USD"
};


export const USDC_USDT_LP_TOKEN = {
	symbol: "USDC-USDT LP",
	name: "USDC-USDT LP TOKEN"
};

export const TOKENS_MAP:any = {
	NUON,
	USDC,
	USDT,
	USDC_USDT_LP_TOKEN,
	ETH,
	nuMINT
};

const paths:any =  {
	NUON_USDC: {
		tokens: [NUON.symbol, USDC.symbol],
	},
	USDC_NUON: {
		tokens: [USDC.symbol, NUON.symbol],
	},
	DAI_NUON: {
		tokens: [USDC.symbol, NUON.symbol],
	},
	[`${nuMINT.symbol}_${USDC.symbol}`]: {
		tokens: [nuMINT.symbol, USDC.symbol],
	},
	[`${USDC.symbol}_${nuMINT.symbol}`]: {
		tokens: [USDC.symbol, nuMINT.symbol],
	},
	[`${nuMINT.symbol}_${NUON.symbol}`]: {
		tokens: [nuMINT.symbol, NUON.symbol],
	},
	[`${NUON.symbol}_${nuMINT.symbol}`]: {
		tokens: [NUON.symbol, nuMINT.symbol],
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
	{ "symbol": nuMINT.symbol, "name": nuMINT.name, "icon": "Hydro.png" },
	{ "symbol": NUON.symbol, "name": NUON.name, "icon": "NUON.png"  },
];
