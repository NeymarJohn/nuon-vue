export const BOARDROOM_ADDRESS  =  "0x1611734982e7147D5F66CD83caF3A9D23fdD867D";  // BoardroomV2.sol (TransparentUpgradeableProxy)
export const USX_CONTROLLER_ADDRESS = "0x9060B84128781263964a2BBCD90B4901cF486806"; // USXController.sol
export const STABILITYFLASH_ADDRESS = "0x4f1Ba70099B1d446C25bD4D47d6c90A16e4C9245"; // TransparentUpgradeableProxy.sol
export const ROUTER_ADDRESS = "0xb2DbC5B4675b21803F7c7E7d66c04B4bba97Fd0a"; // UniswapV2Router02.sol
export const NUON_CONTROLLER_ADDRESS = "0x6B8292638D695BC675d93CBB5aFE495e2a6cc6ed"; // NUONController.sol
export const TRUFLATION_ADDRESS = "0xb509860094fF5A4d0B86aC454426896315733019";
export const TREASURY_ADDRESS = "0xdace118866ccF1021406731fF14164D5a6c46E44"; // TreasuryV2 / TransparentUpgradeableProxy
export const COLLATERAL_HUB_NATIVE_ADDRESS = "0xB21c0b985AF8B4532B90C95551811475A70ecfDE"; // CollateralHubNative.sol(TransparentUpgradeableProxy)
export const COLLATERAL_HUB_ADDRESS = "0x725fd783CD977C9b55a765CDA02f6b26A6990B48"; // CollateralHubNative.sol(TransparentUpgradeableProxy)

// Pair Addresses
export const HYDRO_USDC_PAIR_ADDRESS = "0x99F31f02EdcA9f4e3fC3bDd38941e6F12FbC4ca0"; // UniswapPairOracle_HYDRO_USDC.sol
export const USX_USDC_PAIR_ADDRESS = "0x9D6dff883B333498585bF3EA508171010EDFF68C"; // UniswapPairOracle_USX_USDC.sol
export const USDC_USDT_PAIR_ADDRESS = "0x357e8275c90fa1a624873dE76c6a5aeB604b5Fd9"; // UniswapPairOracle_USDC_USDT.sol
export const HYDRO_USX_PAIR_ADDRESS = "0xf9D3Fe2De55a46791c770687ba6d4DAd24f18B32"; // HX_USX

// Token Addresses
export const NUON_ADDRESS = "0x7562837fE2dC26dc44fDCA91E55410e2D2717F20"; // NUON.sol
export const HYDRO_ADDRESS = "0xccF63f2A5C27E044068fCe171E93ED0F0B0A7286"; // HydroToken.sol

export const USDC_ADDRESS = "0x81Ece6fb6AA47933f49FE0011dF738373A3cA50e"; // MOCKUSDC.sol
export const USDT_ADDRESS = "0x24e687F6E2a3ae5E0Ac7ddc2b618a05959e038E5"; // MockUSDT.sol
export const BUSD_ADDRESS = "0xF0f2303d1F0F456E52e91636aFc3E21F26c43e76"; // MockBUSD.sol
export const WETH_ADDRESS = "0x94326e766fc5fD9817086E93199eb768b6503cAD"; // WETHMock.sol

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

