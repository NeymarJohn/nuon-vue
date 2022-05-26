export const BOARDROOM_ADDRESS  =  "0x21E2943911D252069e9452305AF98a3a75Dae85E";  // BoardroomV2.sol (Proxy)
export const STABILITYFLASH_ADDRESS = "0x4f1Ba70099B1d446C25bD4D47d6c90A16e4C9245"; // TransparentUpgradeableProxy.sol
export const ROUTER_ADDRESS = "0x415A526e8580273b0a89bCB4DEb94b378556De4A"; // UniswapV2Router02.sol
export const USX_CONTROLLER_ADDRESS = "0x47D72F6B1203556BE511Db7b73B4A4555108A023"; // USXController.sol
export const TRUFLATION_ADDRESS = "0xb509860094fF5A4d0B86aC454426896315733019";
export const TREASURY_ADDRESS = "0xf66981b214fc725E9A4Ed621D319381917A0ebF4"; // TreasuryV2 / TransparentUpgradeableProxy
export const COLLATERAL_HUB_ADDRESS = "0x6500754f6c15Bd4CDcB5403e9a32071446510168"; // CollateralHub.sol(TransparentUpgradeableProxy)

// Pair Addresses
export const HYDRO_USDC_PAIR_ADDRESS = "0x99F31f02EdcA9f4e3fC3bDd38941e6F12FbC4ca0"; // UniswapPairOracle_HYDRO_USDC.sol
export const USX_USDC_PAIR_ADDRESS = "0xEe44651201C03Cc689656078ccDf297F6292CEF1"; // UniswapPairOracle_USX_USDC.sol
export const USDC_USDT_PAIR_ADDRESS = "0x357e8275c90fa1a624873dE76c6a5aeB604b5Fd9"; // UniswapPairOracle_USDC_USDT.sol
export const HYDRO_USX_PAIR_ADDRESS = "0xf9D3Fe2De55a46791c770687ba6d4DAd24f18B32"; // HX_USX

// Token Addresses
export const WETH_ADDRESS = "0x6e57319482Fdb735E045D024ECd438fb243FBde0"; // MockETH.sol
export const HYDRO_ADDRESS = "0xD2a5292F2e824457945aC0C127f1d101c71a4B9e"; // HydroToken.sol
export const USDC_ADDRESS = "0x781784768181e20FD68d143E8Aadf6Bde3edD056"; // MOCKUSDC.sol
export const USDT_ADDRESS = "0x82cCE9322f39F9d6C033f670eb2AB966DF9AC855"; // MockUSDT.sol
export const USX_ADDRESS = "0xab00eeE560b9369F65f17f7BE7c639a1Ea4c413c"; // USX.sol
export const DAI_ADDRESS = "0x5EF1Fa09c4ed7e28B383099f591FDdC6C798ab46"; // MockDAI.sol

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
	}, {
		address: HYDRO_USX_PAIR_ADDRESS,
		pairName: "HX_USX",
		pairs: ["HX", "USX"]
	}
];

export const tokenAddresses = {
	"USX": USX_ADDRESS,
	"HX": HYDRO_ADDRESS,
};

