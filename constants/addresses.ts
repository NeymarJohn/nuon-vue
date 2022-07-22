import { nuMINT, NUON, USDC } from "./tokens";

const env = process.env.NODE_ENV || "development";

const addresses: {[key: string]: any} = {
	development: {
		BOARDROOM_ADDRESS: "0x84D14bC6bf15BaCF8B68F2A2690A0D239099842B",  // BoardroomV2.sol (TransparentUpgradeableProxy)
		ROUTER_ADDRESS: "0x576d4beE3c06d0D718c4f6B910A3CeE406667AD6", // UniswapV2Router02.sol
		NUON_CONTROLLER_ADDRESS: "0xD4a8128245E038f414a4E80175bF2907FE60A318", // NUONController.sol
		TRUFLATION_ADDRESS: "0xDA0399bd114368Dab8c7de508AB706F3110544a9",
		TREASURY_ADDRESS: "0xa0c69B49Be1213b6DF9aAc09C79e70A5F0fcCD94", // TreasuryV2 / TransparentUpgradeableProxy
		COLLATERAL_HUB_ADDRESS: "0x1a5A439222D86ad5f165e063604e1b462a9FC83E", // CollateralHubNative.sol(TransparentUpgradeableProxy)
		COLLATERAL_HUB_USDC_ADDRESS: "0x473f4d4eCdD8DDB25981301D5FBfaa38B4D32ff0", // CollateralHubUSDC.sol
		ETH_FAUCET: "0xD2024a0F6C3b1947119b12BDccf01690581BD850",

		// UNI-V2 Pair Addresses
		NUON_USDC_PAIR_ADDRESS: "0x56D178B1B27268C5cd9B2Fcb440544BCb47e8353", // UniswapPair_NUON_USDC.sol
		HYDRO_USDC_PAIR_ADDRESS: "0xD4D321dae3D10778FA822fcDd7A7658e34b84D08", // UniswapPair_HYDRO_USDC.sol
		NUON_NUMINT_PAIR_ADDRESS: "0x722D30eD5F14C75e05B845766AB2Aae0F7F70E0B", // UniswapPair_NUON_nuMINT.sol

		// LP Pair Address
		HYDRO_USDC_LP_PAIR_ADDRESS: "0xD4D321dae3D10778FA822fcDd7A7658e34b84D08", // UniswapPair confirm
		NUON_USDC_LP_PAIR_ADDRESS: "0xD4D321dae3D10778FA822fcDd7A7658e34b84D08",

		// Token Addresses
		NUON_ADDRESS: "0x4C3a8AEEBfd651704f120F607699323bb2CB2340", // NUON.sol
		HYDRO_ADDRESS: "0xa19b742F23e19Ce6Bbeb44f5134010A43837c2fd", // HydroToken.sol
		USDC_ADDRESS: "0x3594c48882e31932235639A842311b540BC3C75c", // MOCKUSDC.sol
		WETH_ADDRESS: "0x57ff39D9711d482B830C1B4730576a25C6a6e2B4", // WETHMock.sol
		USDT_ADDRESS: "0x1357617B3033FC21264B35d3c00CD69EbD28F7e4",
		BUSD_ADDRESS: "0xC670cA43F6a043D1CeCC519Dff8028707528f77a",
	},
	production: {
		BOARDROOM_ADDRESS:  "0xfDb523d7929B92B1F61cD989528662f9FE076E76",  // BoardroomV2.sol (TransparentUpgradeableProxy)
		ROUTER_ADDRESS: "0x2A05A488A69A23f1bd33295778eaA0B83c2F9bC6", // UniswapV2Router02.sol
		NUON_CONTROLLER_ADDRESS: "0x5AaA633FAb144291A6A8123176725E15E82F2ecE", // NUONController.sol
		TRUFLATION_ADDRESS: "0x4859D06EDCFaAbD12cBCEa29EB3dec11ca2c10a2",
		TREASURY_ADDRESS: "0xA5911E5F614287a5e67Af23235975031D710ab7C", // TreasuryV2 / TransparentUpgradeableProxy
		COLLATERAL_HUB_ADDRESS: "0xb324f1175f51c420811667F0E13Fc139695F2630", // CollateralHubNative.sol(TransparentUpgradeableProxy)

		// UNI-V2 Pair Addresses
		NUON_USDC_PAIR_ADDRESS: "0x624e94f217a540A3D54d93CE667C55CE5F126D6E", // UniswapPair_NUON_USDC.sol
		HYDRO_USDC_PAIR_ADDRESS: "0xD4D321dae3D10778FA822fcDd7A7658e34b84D08", // UniswapPair_HYDRO_USDC.sol
		NUON_NUMINT_PAIR_ADDRESS: "0x722D30eD5F14C75e05B845766AB2Aae0F7F70E0B", // UniswapPair_NUON_nuMINT.sol

		// LP Pair Address
		HYDRO_USDC_LP_PAIR_ADDRESS: "0xD4D321dae3D10778FA822fcDd7A7658e34b84D08", // UniswapPair confirm
		NUON_USDC_LP_PAIR_ADDRESS: "0xD4D321dae3D10778FA822fcDd7A7658e34b84D08",

		// Token Addresses
		NUON_ADDRESS: "0xDe879Bb60D7Adf854110FA728540D8d6A3f32d90", // NUON.sol
		HYDRO_ADDRESS: "0x97e09B01C44d75472Fe76FD84A2bFD5e3b91600f", // HydroToken.sol
		USDC_ADDRESS: "0xC6951a1561A4001bC1fFA58D8f06dc0B3DbAcF36", // MOCKUSDC.sol
		WETH_ADDRESS: "0xA70de604118b94fc84076B06541150636B8a1208", // WETHMock.sol
	}
};

const addressToUse = addresses[env];

const BOARDROOM_ADDRESS  =  addressToUse.BOARDROOM_ADDRESS;  // BoardroomV2.sol (TransparentUpgradeableProxy)
const ROUTER_ADDRESS = addressToUse.ROUTER_ADDRESS; // UniswapV2Router02.sol
const NUON_CONTROLLER_ADDRESS = addressToUse.NUON_CONTROLLER_ADDRESS; // NUONController.sol
const TRUFLATION_ADDRESS = addressToUse.TRUFLATION_ADDRESS;
const TREASURY_ADDRESS = addressToUse.TREASURY_ADDRESS; // TreasuryV2 / TransparentUpgradeableProxy
const COLLATERAL_HUB_ADDRESS = addressToUse.COLLATERAL_HUB_ADDRESS; // CollateralHubNative.sol(TransparentUpgradeableProxy)
const COLLATERAL_HUB_USDC_ADDRESS = addressToUse.COLLATERAL_HUB_USDC_ADDRESS; // CollateralHubUSDC.sol
const ETH_FAUCET = addressToUse.ETH_FAUCET;

// UNI-V2 Pair Addresses
const NUON_USDC_PAIR_ADDRESS = addressToUse.NUON_USDC_PAIR_ADDRESS; // UniswapPair_NUON_USDC.sol
const HYDRO_USDC_PAIR_ADDRESS = addressToUse.HYDRO_USDC_PAIR_ADDRESS; // UniswapPair_HYDRO_USDC.sol
const NUON_NUMINT_PAIR_ADDRESS = addressToUse.NUON_NUMINT_PAIR_ADDRESS; // UniswapPair_NUON_nuMINT.sol

// LP Pair Address
const HYDRO_USDC_LP_PAIR_ADDRESS = addressToUse.HYDRO_USDC_LP_PAIR_ADDRESS; // UniswapPair confirm
const NUON_USDC_LP_PAIR_ADDRESS = addressToUse.NUON_USDC_LP_PAIR_ADDRESS;

// Token Addresses
const NUON_ADDRESS = addressToUse.NUON_ADDRESS; // NUON.sol
const HYDRO_ADDRESS = addressToUse.HYDRO_ADDRESS; // HydroToken.sol
const USDC_ADDRESS = addressToUse.USDC_ADDRESS; // MOCKUSDC.sol
const WETH_ADDRESS = addressToUse.WETH_ADDRESS; // WETHMock.sol
// const USDT_ADDRESS = "0x1357617B3033FC21264B35d3c00CD69EbD28F7e4";
// const BUSD_ADDRESS = "0xC670cA43F6a043D1CeCC519Dff8028707528f77a";

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
		address:  NUON_NUMINT_PAIR_ADDRESS,
		lpAddress: HYDRO_USDC_LP_PAIR_ADDRESS,
		pairName: `${nuMINT.symbol}_${NUON.symbol}`,
		pairs: [nuMINT.symbol, NUON.symbol]
	}, {
		address: NUON_USDC_PAIR_ADDRESS,
		lpAddress: NUON_USDC_LP_PAIR_ADDRESS,
		pairName: "NUON_USDC",
		pairs: ["NUON", "USDC"]
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
		collatralHubs: {
			ETH: COLLATERAL_HUB_ADDRESS,
			USDC: COLLATERAL_HUB_USDC_ADDRESS
		},
		ethFaucet: ETH_FAUCET
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
		collatralHubs: {
			ETH: COLLATERAL_HUB_ADDRESS,
			USDC: COLLATERAL_HUB_USDC_ADDRESS
		},
		ethFaucet: ETH_FAUCET
	}
};
