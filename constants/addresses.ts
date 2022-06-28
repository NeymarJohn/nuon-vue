export const BOARDROOM_ADDRESS  =  "0xfDb523d7929B92B1F61cD989528662f9FE076E76";  // BoardroomV2.sol (TransparentUpgradeableProxy)
export const ROUTER_ADDRESS = "0x2A05A488A69A23f1bd33295778eaA0B83c2F9bC6"; // UniswapV2Router02.sol
export const NUON_CONTROLLER_ADDRESS = "0x5AaA633FAb144291A6A8123176725E15E82F2ecE"; // NUONController.sol
export const TRUFLATION_ADDRESS = "0x4859D06EDCFaAbD12cBCEa29EB3dec11ca2c10a2";
export const TREASURY_ADDRESS = "0xA5911E5F614287a5e67Af23235975031D710ab7C"; // TreasuryV2 / TransparentUpgradeableProxy
export const COLLATERAL_HUB_ADDRESS = "0xb324f1175f51c420811667F0E13Fc139695F2630"; // CollateralHubNative.sol(TransparentUpgradeableProxy)

// Pair Addresses
export const NUON_USDC_PAIR_ADDRESS = "0xD74A0F753AEB3C641a6e63D7B11e2b8ce2c454E2"; // UniswapPairOracle_NUON_USDC.sol
export const HYDRO_USDC_PAIR_ADDRESS = "0x99F31f02EdcA9f4e3fC3bDd38941e6F12FbC4ca0"; // UniswapPairOracle_HYDRO_USDC.sol
export const USDC_USDT_PAIR_ADDRESS = "0x357e8275c90fa1a624873dE76c6a5aeB604b5Fd9"; // UniswapPairOracle_USDC_USDT.sol
export const HYDRO_USX_PAIR_ADDRESS = "0xf9D3Fe2De55a46791c770687ba6d4DAd24f18B32"; // HX_USX


// LP Pair Address
export const HYDRO_USDC_LP_PAIR_ADDRESS = "0xD4D321dae3D10778FA822fcDd7A7658e34b84D08"; // UniswapPair
export const NUON_USDC_LP_PAIR_ADDRESS = "0xD4D321dae3D10778FA822fcDd7A7658e34b84D08";

// Token Addresses
export const NUON_ADDRESS = "0xDe879Bb60D7Adf854110FA728540D8d6A3f32d90"; // NUON.sol
export const HYDRO_ADDRESS = "0x97e09B01C44d75472Fe76FD84A2bFD5e3b91600f"; // HydroToken.sol

export const USDC_ADDRESS = "0xC6951a1561A4001bC1fFA58D8f06dc0B3DbAcF36"; // MOCKUSDC.sol
export const USDT_ADDRESS = "0xf6C19093F776D60D5CF84d03A2D33916BD4e0Ee2"; // MockUSDT.sol
export const BUSD_ADDRESS = "0x021b4c24123ecA1FE5Ab6854262f3301B5Dea8d9"; // MockBUSD.sol
export const WETH_ADDRESS = "0xA70de604118b94fc84076B06541150636B8a1208"; // WETHMock.sol
export const ETH_ADDRESS = "0x49eB01E821fC978db9e1f127F6F66EFEDad4B260"; // ETHMock.sol

export const EPOCH_PERIOD = 6; // 6 hours from Treasury.sol

export const VALID_NETWORKS = [4, 31010];

export const tokenPairs = [
	{
		address: HYDRO_USDC_PAIR_ADDRESS,
		lpAddress: HYDRO_USDC_LP_PAIR_ADDRESS,
		pairName: "HX_USDC",
		pairs: ["HX", "USDC"]
	}, {
		address: NUON_USDC_PAIR_ADDRESS,
		lpAddress: NUON_USDC_LP_PAIR_ADDRESS,
		pairName: "NUON_USDC",
		pairs: ["NUON", "USDC"]
	}, {
		address: USDC_USDT_PAIR_ADDRESS,
		lpAddress: HYDRO_USDC_LP_PAIR_ADDRESS,
		pairName: "USDC_USDT",
		pairs: ["USDC", "USDT"]
	}
];

export const tokenAddresses = {
	"NUON": NUON_ADDRESS,
	"HX": HYDRO_ADDRESS,
};

