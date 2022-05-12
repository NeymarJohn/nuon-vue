export const BOARDROOM_ADDRESS  =  "0xB8EfBD063573B3E7d5979C2b59B538720550b99d";  // BoardroomV2.sol (Proxy)
export const STABILITYFLASH_ADDRESS = "0x73dC3C2047D1B879a8d1Ad7D71bF8B830E2C024f"; // TransparentUpgradeableProxy.sol
export const ROUTER_ADDRESS = "0x8C3CdBFF0e3D83b6b02a8cF4D3017167d02138c2"; // UniswapV2Router02.sol
export const USX_CONTROLLER_ADDRESS = "0x79D221f65550F08311C7Bdd0C2431E457325f56a"; // USXController.sol
export const TRUFLATION_ADDRESS = "0xb509860094fF5A4d0B86aC454426896315733019";
export const TREASURY_ADDRESS = "0x9b59cB0180cC137c3a9398B8a6907aDF618D56f1"; // TreasuryV2 / TransparentUpgradeableProxy
export const COLLATERAL_HUB_ADDRESS = "0xF6Bd2E7bb35231b0686C7d206Dd894299619325E"; // CollateralHub.sol(TransparentUpgradeableProxy)

// Pair Addresses
export const HYDRO_USDC_PAIR_ADDRESS = "0x1748ca200a7708b95bEBd3A7CdE10BE96B0B0a20"; // UniswapPairOracle_HYDRO_USDC.sol
export const USX_USDC_PAIR_ADDRESS = "0x71E2Bf64B36B1fB2408427CC744333Bbf8555BCA"; // UniswapPairOracle_USX_USDC.sol
export const USDC_USDT_PAIR_ADDRESS = "0x3789AEeFc5DD1E52e300211287062E29f9FfEc8f"; // UniswapPairOracle_USDC_USDT.sol

// Token Addresses
export const WETH_ADDRESS = "0xCD2DDc16aFa85418771159Cb491d2D9eF598343f"; // MockETH.sol
export const HYDRO_ADDRESS = "0xB98aF066F765ADD5cDEBa5156d903187B2c88AF5"; // HydroToken.sol
export const USDC_ADDRESS = "0xAaFa74b088dD60A20a387a5Dcdef091bC7dc3866"; // MOCKUSDC.sol
export const USDT_ADDRESS = "0xCB1269238310Ef0ccDc126e8E36358cE73CaB733"; // MockUSDT.sol
export const USX_ADDRESS = "0x63f81A56864185486F20A4e7f398D77F85f18ce6"; // USX.sol
export const DAI_ADDRESS = "0x3F0C25795AceCae13dC003C9eE4F985dC1D85061"; // MockDAI.sol

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

