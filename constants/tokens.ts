export const nuMINT = {
	symbol: "nuMINT",
	name: "NuMint Token"
};

export const NUON = {
	symbol: "NUON",
	name: "Nuon Token"
};
export const USDT = {
	symbol: "USDT",
	name: "USDT Token"
};

export const ETH = {
	symbol: "ETH",
	name: "Ethereum"
};

export const BUSD = {
	symbol: "BUSD",
	name: "Binance USD"
};

export const BTC = {
	symbol: "BTC",
	name: "Bitcoin"
};

export const AVAX = {
	symbol: "AVAX",
	name: "Avalanche"
};

export const WETH = {
	symbol: "WETH",
	name: "Wrapped Ether"
};

export const USDC_USDT_LP_TOKEN = {
	symbol: "USDC-USDT LP",
	name: "USDC-USDT LP TOKEN"
};

export const TOKENS_MAP:any = {
	NUON,
	USDT,
	USDC_USDT_LP_TOKEN,
	ETH,
	WETH,
	nuMINT
};

const paths:any =  {
	[`${nuMINT.symbol}_${WETH.symbol}`]: {
		tokens: [nuMINT.symbol, USDT.symbol, WETH.symbol],
	},
	[`${WETH.symbol}_${nuMINT.symbol}`]: {
		tokens: [WETH.symbol, USDT.symbol, nuMINT.symbol],
	},
};

export const getPath = (inputToken:string, outputToken:string) => {
	let path = paths[`${inputToken}_${outputToken}`];
	if (!path) path = {
		tokens: [TOKENS_MAP[inputToken].symbol, TOKENS_MAP[outputToken].symbol]
	};
	return path;
};

export const collateralTokens = [
	{ "symbol": WETH.symbol, "name": WETH.name, "icon": "WETH.png" },
	{ "symbol": USDT.symbol, "name": USDT.name, "icon": "USDT.png"  },
];

export const mainTokens = [
	{ "symbol": WETH.symbol, "name": WETH.name, "icon": "WETH.png"  },
	{ "symbol": USDT.symbol, "name": USDT.name, "icon": "USDT.png"  },
	{ "symbol": nuMINT.symbol, "name": nuMINT.name, "icon": "nuMINT.png" },
	{ "symbol": NUON.symbol, "name": NUON.name, "icon": "NUON.png"  },
];

export const mintTokens = [
	{ "symbol": WETH.symbol, "name": WETH.name, "icon": "WETH.png"  },
	{ "symbol": USDT.symbol, "name": USDT.name, "icon": "USDT.png"  },
	{ "symbol": BTC.symbol, "name": BTC.name, "icon": "BTC.png" },
	{ "symbol": BUSD.symbol, "name": BUSD.name, "icon": "BUSD.png"  },
	{ "symbol": AVAX.symbol, "name": AVAX.name, "icon": "AVAX.png"  },
];
