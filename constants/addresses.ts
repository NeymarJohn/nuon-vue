export const BOARDROOM_ADDRESS  =  "0x9c94acA7B451c4B6BEE094A191a4eBEa72E8c263";  // BoardroomV2.sol (TransparentUpgradeableProxy)
export const USX_CONTROLLER_ADDRESS = "0x9060B84128781263964a2BBCD90B4901cF486806"; // USXController.sol
export const ROUTER_ADDRESS = "0x28c280462C97e3e04eE772f6AdDa400B8275dDB0"; // UniswapV2Router02.sol
export const NUON_CONTROLLER_ADDRESS = "0x04294c86357678c683F87bc87aC0Cd5E13180c5d"; // NUONController.sol
export const TRUFLATION_ADDRESS = "0x89bebB87b728029890A30032C46f32c1D07e4298";
export const TREASURY_ADDRESS = "0x464f03645C698D44f82aF4a4b930F8c4b35f1739"; // TreasuryV2 / TransparentUpgradeableProxy
export const COLLATERAL_HUB_ADDRESS = "0xf1bb20F80905FB4f63E7499fe0E15620458C9827"; // CollateralHubNative.sol(TransparentUpgradeableProxy)

// Pair Addresses
export const HYDRO_USDC_PAIR_ADDRESS = "0x99F31f02EdcA9f4e3fC3bDd38941e6F12FbC4ca0"; // UniswapPairOracle_HYDRO_USDC.sol
export const NUON_USDC_PAIR_ADDRESS = "0x5C86F75155fA533C5Df72C53D3834e511b1113E7"; // UniswapPairOracle_NUON_USDC.sol
export const USDC_USDT_PAIR_ADDRESS = "0x357e8275c90fa1a624873dE76c6a5aeB604b5Fd9"; // UniswapPairOracle_USDC_USDT.sol
export const HYDRO_USX_PAIR_ADDRESS = "0xf9D3Fe2De55a46791c770687ba6d4DAd24f18B32"; // HX_USX

// Token Addresses
export const NUON_ADDRESS = "0xa15868Ed72d8f87aB795d8E72727e3d270fE7050"; // NUON.sol
export const HYDRO_ADDRESS = "0xdA4263441026996354A47734862764A783639770"; // HydroToken.sol

export const USDC_ADDRESS = "0x095f3b716309312465A2DEDC6912A8C83D7f3F76"; // MOCKUSDC.sol
export const USDT_ADDRESS = "0x7074C04fc7D694673114F2c0186cD66D02436526"; // MockUSDT.sol
export const BUSD_ADDRESS = "0xFE793Cb77A3d7e588274B8f2F33d9Cfc71228af9"; // MockBUSD.sol
export const WETH_ADDRESS = "0x260f6b0DCD883A0d06b77206A65f8F91A236ac12"; // WETHMock.sol

export const DAI_ADDRESS = "0x5EF1Fa09c4ed7e28B383099f591FDdC6C798ab46"; // MockDAI.sol

export const EPOCH_PERIOD = 6; // 6 hours from Treasury.sol

export const VALID_NETWORKS = [31010];

export const tokenPairs = [
	{
		address: HYDRO_USDC_PAIR_ADDRESS,
		pairName: "HX_USDC",
		pairs: ["HX", "USDC"]
	}, {
		address: NUON_USDC_PAIR_ADDRESS,
		pairName: "NUON_USDC",
		pairs: ["NUON", "USDC"]
	}, {
		address: USDC_USDT_PAIR_ADDRESS,
		pairName: "USDC_USDT",
		pairs: ["USDC", "USDT"]
	}
];

export const tokenAddresses = {
	"NUON": NUON_ADDRESS,
	"HX": HYDRO_ADDRESS,
};

