export const BOARDROOM_ADDRESS  =  "0x11CC5Cb5A200131ce96c6247164Ce9926f3f9742";  // BoardroomV2.sol (TransparentUpgradeableProxy)
export const USX_CONTROLLER_ADDRESS = "0x9060B84128781263964a2BBCD90B4901cF486806"; // USXController.sol
export const ROUTER_ADDRESS = "0xd33d1578e5Ee35F542F110690594f1344Ea5797e"; // UniswapV2Router02.sol
export const NUON_CONTROLLER_ADDRESS = "0xa91cA402Cf7C3B153b0D207d5BdE468838c18cB7"; // NUONController.sol
export const TRUFLATION_ADDRESS = "0x4859D06EDCFaAbD12cBCEa29EB3dec11ca2c10a2";
export const TREASURY_ADDRESS = "0x1fbb8b1f4E0197673b5d1d6aFb2a2A13aC01aBf2"; // TreasuryV2 / TransparentUpgradeableProxy
export const COLLATERAL_HUB_ADDRESS = "0x84583f17B1c1b322873106c57b4665c72cd1447A"; // CollateralHubNative.sol(TransparentUpgradeableProxy)

// Pair Addresses
export const HYDRO_USDC_PAIR_ADDRESS = "0x99F31f02EdcA9f4e3fC3bDd38941e6F12FbC4ca0"; // UniswapPairOracle_HYDRO_USDC.sol
export const NUON_USDC_PAIR_ADDRESS = "0x219b61B9781c9f522d1A8C7DC8190a1482Ea99EC"; // UniswapPairOracle_NUON_USDC.sol
export const USDC_USDT_PAIR_ADDRESS = "0x357e8275c90fa1a624873dE76c6a5aeB604b5Fd9"; // UniswapPairOracle_USDC_USDT.sol
export const HYDRO_USX_PAIR_ADDRESS = "0xf9D3Fe2De55a46791c770687ba6d4DAd24f18B32"; // HX_USX

// Token Addresses
export const NUON_ADDRESS = "0x5933a5aeeb4Db0CD32b4694165B36AD4A6A48442"; // NUON.sol
export const HYDRO_ADDRESS = "0x7D0b5244dAfB1dBC343d6CB3e4797243132bb49f"; // HydroToken.sol

export const USDC_ADDRESS = "0x8ebD1d80A3ed88af26A4bB2d7B648c546450Fe9a"; // MOCKUSDC.sol
export const USDT_ADDRESS = "0xB98A6B66183ED481F18398810337bc718A24C98a"; // MockUSDT.sol
export const BUSD_ADDRESS = "0x5f853dF42DE3692280416d1DC842246B00b1Dac9"; // MockBUSD.sol
export const WETH_ADDRESS = "0x97f5e68A1147f415F6aD0d25A6C5227B4ed5d8a0"; // WETHMock.sol
export const ETH_ADDRESS = "0x49eB01E821fC978db9e1f127F6F66EFEDad4B260"; // ETHMock.sol

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

