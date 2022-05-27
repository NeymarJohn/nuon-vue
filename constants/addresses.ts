export const BOARDROOM_ADDRESS  =  "0x146c5d955186679b14d5aAF0358D963E3e21022c";  // BoardroomV2.sol (Proxy)
export const STABILITYFLASH_ADDRESS = "0x4f1Ba70099B1d446C25bD4D47d6c90A16e4C9245"; // TransparentUpgradeableProxy.sol
export const ROUTER_ADDRESS = "0x1EA944DB61BBfDE86962a67DaF022143587ED482"; // UniswapV2Router02.sol
export const USX_CONTROLLER_ADDRESS = "0x9060B84128781263964a2BBCD90B4901cF486806"; // USXController.sol
export const TRUFLATION_ADDRESS = "0xb509860094fF5A4d0B86aC454426896315733019";
export const TREASURY_ADDRESS = "0xdace118866ccF1021406731fF14164D5a6c46E44"; // TreasuryV2 / TransparentUpgradeableProxy
export const COLLATERAL_HUB_ADDRESS = "0x725fd783CD977C9b55a765CDA02f6b26A6990B48"; // CollateralHub.sol(TransparentUpgradeableProxy)

// Pair Addresses
export const HYDRO_USDC_PAIR_ADDRESS = "0x99F31f02EdcA9f4e3fC3bDd38941e6F12FbC4ca0"; // UniswapPairOracle_HYDRO_USDC.sol
export const USX_USDC_PAIR_ADDRESS = "0x9D6dff883B333498585bF3EA508171010EDFF68C"; // UniswapPairOracle_USX_USDC.sol
export const USDC_USDT_PAIR_ADDRESS = "0x357e8275c90fa1a624873dE76c6a5aeB604b5Fd9"; // UniswapPairOracle_USDC_USDT.sol
export const HYDRO_USX_PAIR_ADDRESS = "0xf9D3Fe2De55a46791c770687ba6d4DAd24f18B32"; // HX_USX

// Token Addresses
export const WETH_ADDRESS = "0x641b8bF92518e598562CE43e4150D50920A1f88B"; // MockETH.sol
export const HYDRO_ADDRESS = "0x424525450782B726979b7cd27BE686b05aD3341b"; // HydroToken.sol
export const USDC_ADDRESS = "0xe0e32fc49d354328f944A279D6A41A92f1157760"; // MOCKUSDC.sol
export const USDT_ADDRESS = "0x4b5A599ff48B24bD92B05Ee894813776a0D10760"; // MockUSDT.sol
export const USX_ADDRESS = "0xe5Bad809622DFEdFc2680772a56eeFd02e54C1bd"; // USX.sol
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

