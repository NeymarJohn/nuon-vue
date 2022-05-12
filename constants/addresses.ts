export const BOARDROOM_ADDRESS  =  "0xEbA148211E4B2B4Ee530e49953D2736f2FD70B77";  // BoardroomV2.sol (Proxy)
export const STABILITYFLASH_ADDRESS = "0xdAf4C3F63CA294A626867a9098C0b9fA170DD0cA"; // TransparentUpgradeableProxy.sol
export const ROUTER_ADDRESS = "0xbCF77600Df7d733252BA4981bC61Ae3Fa664e9C2"; // UniswapV2Router02.sol
export const USX_CONTROLLER_ADDRESS = "0x948B3BDe57f47E213a95F645a6E7e00B264662bf"; // USXController.sol
export const TRUFLATION_ADDRESS = "0xb509860094fF5A4d0B86aC454426896315733019";
export const TREASURY_ADDRESS = "0x351fa6bA17E5a79eC145F0a6ae886e03E52Fc774"; // TreasuryV2 / TransparentUpgradeableProxy
export const COLLATERAL_HUB_ADDRESS = "0x94813492E5f33E447C4001447A14fC958D958A6b"; // CollateralHub.sol(TransparentUpgradeableProxy)

// Pair Addresses
export const HYDRO_USDC_PAIR_ADDRESS = "0x1FF5539018289D3Aa177809De8f285458F9fb979"; // UniswapPairOracle_HYDRO_USDC.sol
export const USX_USDC_PAIR_ADDRESS = "0x6434D8bFE30BE22F445963Ee67717C7924871483"; // UniswapPairOracle_USX_USDC.sol
export const USDC_USDT_PAIR_ADDRESS = "0xD57E6919A844c836ed5Ff5AA7D24d4A785BE301e"; // UniswapPairOracle_USDC_USDT.sol

// Token Addresses
export const WETH_ADDRESS = "0x137626b0f12dB32771C3A60Cc7FBd182d17cc1e5"; // MockETH.sol
export const HYDRO_ADDRESS = "0xa032C3E793ED4D43864015C44D586D02F48C474B"; // HydroToken.sol
export const USDC_ADDRESS = "0x0dAb9Ce023b57F31ef3c744d520C7429947425C4"; // MOCKUSDC.sol
export const USDT_ADDRESS = "0x88aaF354b2C95E63d4B01CF2a4160d2333b0D6eF"; // MockUSDT.sol
export const USX_ADDRESS = "0x50D41eDc6C8467AfF0ae2189E832Df2BD1bD76cF"; // USX.sol
export const DAI_ADDRESS = "0x55189F153641a6D47ec52B77fcc8b5eD0FB8d35a"; // MockDAI.sol

export const EPOCH_PERIOD = 6; // 6 hours from Treasury.sol

export const VALID_NETWORKS = [31010];

export const tokenPairs = [
	{
		address: HYDRO_USDC_PAIR_ADDRESS,
		pairName: "HX_USDC",
		pairs: ["HX", "USDC"]
	}, {
		address: USX_USDC_PAIR_ADDRESS,
		pairName: "USX_USDC",
		pairs: ["USX", "USDC"]
	}, {
		address: USDC_USDT_PAIR_ADDRESS,
		pairName: "USDC_USDT",
		pairs: ["USDC", "USDT"]
	}
];

export const tokenAddresses = {
	"USX": USX_ADDRESS,
	"HX": HYDRO_ADDRESS,
};

