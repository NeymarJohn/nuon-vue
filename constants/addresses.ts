import { nuMINT, NUON, USDC } from "./tokens";

const BOARDROOM_ADDRESS  =  "0xfDb523d7929B92B1F61cD989528662f9FE076E76";  // BoardroomV2.sol (TransparentUpgradeableProxy)
const ROUTER_ADDRESS = "0x2A05A488A69A23f1bd33295778eaA0B83c2F9bC6"; // UniswapV2Router02.sol
const NUON_CONTROLLER_ADDRESS = "0x5AaA633FAb144291A6A8123176725E15E82F2ecE"; // NUONController.sol
const TRUFLATION_ADDRESS = "0x4859D06EDCFaAbD12cBCEa29EB3dec11ca2c10a2";
const TREASURY_ADDRESS = "0xA5911E5F614287a5e67Af23235975031D710ab7C"; // TreasuryV2 / TransparentUpgradeableProxy
const COLLATERAL_HUB_ADDRESS = "0xb324f1175f51c420811667F0E13Fc139695F2630"; // CollateralHubNative.sol(TransparentUpgradeableProxy)

// Pair Addresses
const NUON_USDC_PAIR_ADDRESS = "0xD74A0F753AEB3C641a6e63D7B11e2b8ce2c454E2"; // UniswapPairOracle_NUON_USDC.sol
const HYDRO_USDC_PAIR_ADDRESS = "0x99F31f02EdcA9f4e3fC3bDd38941e6F12FbC4ca0"; // UniswapPairOracle_HYDRO_USDC.sol
const USDC_USDT_PAIR_ADDRESS = "0x357e8275c90fa1a624873dE76c6a5aeB604b5Fd9"; // UniswapPairOracle_USDC_USDT.sol
const NUON_nuMINT_PAIR_ADDRESS = "0x722D30eD5F14C75e05B845766AB2Aae0F7F70E0B"; // UniswapPairOracle_nuMINT_USDC.sol

// LP Pair Address
const HYDRO_USDC_LP_PAIR_ADDRESS = "0xD4D321dae3D10778FA822fcDd7A7658e34b84D08"; // UniswapPair
const NUON_USDC_LP_PAIR_ADDRESS = "0xD4D321dae3D10778FA822fcDd7A7658e34b84D08";

// Token Addresses
const NUON_ADDRESS = "0xDe879Bb60D7Adf854110FA728540D8d6A3f32d90"; // NUON.sol
const HYDRO_ADDRESS = "0x97e09B01C44d75472Fe76FD84A2bFD5e3b91600f"; // HydroToken.sol

const USDC_ADDRESS = "0xC6951a1561A4001bC1fFA58D8f06dc0B3DbAcF36"; // MOCKUSDC.sol
const WETH_ADDRESS = "0xA70de604118b94fc84076B06541150636B8a1208"; // WETHMock.sol

export const EPOCH_PERIOD = 6; // 6 hours from Treasury.sol

export const VALID_NETWORKS = [4, 31010];

export const tokenPairs = [
	{
		address: HYDRO_USDC_PAIR_ADDRESS,
		lpAddress: HYDRO_USDC_LP_PAIR_ADDRESS,
		pairName: "HX_USDC",
		pairs: ["HX", "USDC"]
	}, {
		address: HYDRO_USDC_PAIR_ADDRESS,
		lpAddress: HYDRO_USDC_LP_PAIR_ADDRESS,
		pairName: `${nuMINT.symbol}_${USDC.symbol}`,
		pairs: [nuMINT.symbol, USDC.symbol]
	}, {
		address:  NUON_nuMINT_PAIR_ADDRESS, 
		lpAddress: HYDRO_USDC_LP_PAIR_ADDRESS,
		pairName: `${nuMINT.symbol}_${NUON.symbol}`,
		pairs: [nuMINT.symbol, NUON.symbol]
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
	[nuMINT.symbol]: HYDRO_ADDRESS
};

export const chainData = {
	31010: {
		boardroom: BOARDROOM_ADDRESS,
		router: ROUTER_ADDRESS,
		nuonController: NUON_CONTROLLER_ADDRESS,
		oracle: NUON_USDC_PAIR_ADDRESS,
		weth: WETH_ADDRESS,
		hydro: HYDRO_ADDRESS,
		nuon: NUON_ADDRESS,
		usdc: USDC_ADDRESS,
		treasury: TREASURY_ADDRESS,
		truflation: TRUFLATION_ADDRESS,
		uniswapV2Pair: tokenPairs,
		collateralHub: COLLATERAL_HUB_ADDRESS,
		tokens: {
			ETH: WETH_ADDRESS,
			HX: HYDRO_ADDRESS,
			USDC: USDC_ADDRESS,
			NUON: NUON_ADDRESS,
			[nuMINT.symbol]: HYDRO_ADDRESS
		},
	},
	4: {
		boardroom: "0x0a5e2EeA70B9Db9f801750feEcA9b245aBC7a388",
		router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
		nuonController: "0x0AF39204257a41c7B09d8AF8993dc5D03141a1CA",
		oracle: "0x9649329FbaBF1b49b3c1d8E04ea1A1978d691521",
		weth: "0x1AB158d908aCFD0D4FdD0082675c411a203ECAB6",
		hydro: "0xB02322B6Cf0c8C25Ebd0Cad4aDC8ab935413a177",
		nuon: "0xE66Edfc2F5B2E98A35074eeAd30f5B6Ed2cccE4E",
		usdc: "0xBD9c0bc5AeB998A9d6C4e8293d2A49111EdE5509",
		treasury: "0xD3902ce5C4b4c4bdC7Fb5E7481b2B70fA1e4aB75",
		truflation: "0xb651Ea53DeA9B26DCD98581703eA38e044bCA12A",
		uniswapV2Pair: [
			{
				address: HYDRO_USDC_PAIR_ADDRESS,
				lpAddress: HYDRO_USDC_LP_PAIR_ADDRESS,
				pairName: "HX_USDC",
				pairs: ["HX", "USDC"]
			}, {
				address: "0x9649329FbaBF1b49b3c1d8E04ea1A1978d691521",
				lpAddress: NUON_USDC_LP_PAIR_ADDRESS,
				pairName: "NUON_USDC",
				pairs: ["NUON", "USDC"]
			}, {
				address: USDC_USDT_PAIR_ADDRESS,
				lpAddress: HYDRO_USDC_LP_PAIR_ADDRESS,
				pairName: "USDC_USDT",
				pairs: ["USDC", "USDT"]
			}
		],
		collateralHub: "0xe28f09211CF4565386FDC2a384997667e367D077",
		tokens: {
			ETH: "0x1AB158d908aCFD0D4FdD0082675c411a203ECAB6",
			HX: "0xB02322B6Cf0c8C25Ebd0Cad4aDC8ab935413a177",
			USDC: "0xBD9c0bc5AeB998A9d6C4e8293d2A49111EdE5509",
			NUON: "0xE66Edfc2F5B2E98A35074eeAd30f5B6Ed2cccE4E",
			[nuMINT.symbol]: "0xB02322B6Cf0c8C25Ebd0Cad4aDC8ab935413a177"
		},
	}
};
