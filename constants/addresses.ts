import { nuMINT } from "./tokens";

const BOARDROOM_ADDRESS  =  "0xA899dA3F4Db6DB07Fff674A70F90bE3FAb711980";  // BoardroomV2.sol (TransparentUpgradeableProxy)
const ROUTER_ADDRESS = "0xF53f22E12064b664Bc2B1757f5E8067d0600d540"; // UniswapV2Router02.sol
const NUON_CONTROLLER_ADDRESS = "0x350eA5382D2960fB7788ce87301b45c73478C9B1"; // NUONController.sol
const TRUFLATION_ADDRESS = "0xFD30116F51895b665BF1D2CF5d27752C53366D49";
const TREASURY_ADDRESS = "0xEc5378Dcd9E8A3B0077981B637E297F36D1b3DB6"; // TreasuryV2 / TransparentUpgradeableProxy
const COLLATERAL_HUB_ADDRESS = "0x2B4785C7Fa4529Aac61016686BB3068250cc740A"; // CollateralHubNative.sol(TransparentUpgradeableProxy)
const COLLATERAL_HUB_USDT_ADDRESS = "0x565201581FB2D45aa10bB13dE72a219f4040C11D"; // CollateralHubUSDT.sol(TransparentUpgradeableProxy)
const ETH_FAUCET = "0x5b512d4BACaD217F8F71dCd78f68feC854DE24Eb"; // ETHFaucet
const UNISWAP_V2_FACTORY_ADDRESS = "0x58Af97B65864FEd6aD4A4578Cdd460F55525fc85";
const WETH_VAULT_RELAYER = "0x1442b140f5fF9Fae1EcE1DEf61CF95D629cc793F"; // VaultRelayerNative
const USDT_VAULT_RELAYER = "0x274DaeEaFa2E506E62cbeBCF80CE4f8CaB1Db4C4"; // VaultRelayerUSDT

// Token Addresses
const NUON_ADDRESS = "0x33b05E71E4bC696843fCcCB4d6D936d64721363e"; // NUON.sol
const NUMINT_ADDRESS = "0xDa2867914310bd0d725f093e1f34b49781259be0"; // nuMINT.sol
const WETH_ADDRESS = "0x4D981cCb0f9f76621073e8e64d27100eF90e7A2c"; // WETHMock.sol
const USDT_ADDRESS = "0xF05c834B85ed3800880CEaa4F43B48b030364650"; // MOCKUSDT.sol
// const BUSD_ADDRESS = "0xA8c218d4324dc5842076ad858787C0714b3e0483"; // MockBUSD.sol

export const EPOCH_PERIOD = 6; // 6 hours from Treasury.sol

export const VALID_NETWORKS = [4, 5, 31010];

export const tokenAddresses = {
	"NUON": NUON_ADDRESS,
	[nuMINT.symbol]: NUMINT_ADDRESS
};

export const ADDRESS_CHAIN_DATA = {
	31010: {
		boardroom: BOARDROOM_ADDRESS,
		router: ROUTER_ADDRESS,
		nuonController: NUON_CONTROLLER_ADDRESS,
		treasury: TREASURY_ADDRESS,
		truflation: TRUFLATION_ADDRESS,
		uniswapV2Factory: UNISWAP_V2_FACTORY_ADDRESS,
		collateralHub: COLLATERAL_HUB_ADDRESS,
		tokens: {
			ETH: WETH_ADDRESS,
			USDT: USDT_ADDRESS,
			NUON: NUON_ADDRESS,
			WETH: WETH_ADDRESS,
			[nuMINT.symbol]: NUMINT_ADDRESS
		},
		collatralHubs: {
			WETH: COLLATERAL_HUB_ADDRESS,
			USDT: COLLATERAL_HUB_USDT_ADDRESS
		},
		ethFaucet: ETH_FAUCET,
		vaultRelayers: {
			WETH: WETH_VAULT_RELAYER,
			USDT: USDT_VAULT_RELAYER
		}
	},
	4: {
		boardroom: "0x0a5e2EeA70B9Db9f801750feEcA9b245aBC7a388",
		router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
		nuonController: "0x0AF39204257a41c7B09d8AF8993dc5D03141a1CA",
		oracle: "0x9649329FbaBF1b49b3c1d8E04ea1A1978d691521",
		weth: "0x1AB158d908aCFD0D4FdD0082675c411a203ECAB6",
		nuMint: "0xB02322B6Cf0c8C25Ebd0Cad4aDC8ab935413a177",
		nuon: "0xE66Edfc2F5B2E98A35074eeAd30f5B6Ed2cccE4E",
		treasury: "0xD3902ce5C4b4c4bdC7Fb5E7481b2B70fA1e4aB75",
		truflation: "0xb651Ea53DeA9B26DCD98581703eA38e044bCA12A",
		collateralHub: "0xe28f09211CF4565386FDC2a384997667e367D077",
		tokens: {
			ETH: "0x1AB158d908aCFD0D4FdD0082675c411a203ECAB6",
			NUON: "0xE66Edfc2F5B2E98A35074eeAd30f5B6Ed2cccE4E",
			[nuMINT.symbol]: "0xB02322B6Cf0c8C25Ebd0Cad4aDC8ab935413a177",
			USDT: USDT_ADDRESS,
			WETH: WETH_ADDRESS,
			[nuMINT.symbol]: NUMINT_ADDRESS
		},
		collatralHubs: {
			WETH: COLLATERAL_HUB_ADDRESS,
			USDT: COLLATERAL_HUB_USDT_ADDRESS
		},
		ethFaucet: ETH_FAUCET,
		vaultRelayers: {
			WETH: WETH_VAULT_RELAYER,
			USDT: USDT_VAULT_RELAYER
		}
	},
	5: {
		boardroom: "0x78109E1961156636Dd9C64ADc593Dbfe504fC498",
		router: "0xb651Ea53DeA9B26DCD98581703eA38e044bCA12A",
		uniswapV2Factory: "0x1AB158d908aCFD0D4FdD0082675c411a203ECAB6",
		nuonController: "0xBD9c0bc5AeB998A9d6C4e8293d2A49111EdE5509",
		oracle: "0xD14A89b21E154Ce5Ae4D703Be6A260Ee161b8CfA",
		treasury: "0x013a8E95E3720A2321cd259c90c5c4590e5800bD",
		truflation: "0x065F0256851DEa2f3d77c90D294a45170Eaa6f4e",
		tokens: {
			WETH: "0xE66Edfc2F5B2E98A35074eeAd30f5B6Ed2cccE4E",
			NUON: "0x027521a466AF8DDdE06D7f154856B578Ca6C2fA7",
			[nuMINT.symbol]: "0x200348471330518eE4122cBcF649d41EdC245df2",
			USDT: "0x370982F394f7D16FC9147D682F05FB66850768CC",
		},
		collatralHubs: {
			WETH: "0xDd49311d7e76e5C2001Cd97A4e0b213E7d6E6c5B",
			USDT: "0x4Ac89f204D60f03aCEd226199cA5c0656fBF4aA1"
		},
		ethFaucet: ETH_FAUCET,
		vaultRelayers: {
			WETH: "0xA90325F1D7c03F581b5EC9A5b409289D10c28aec",
			USDT: "0x2bc6b0c69cD0e3Ae361aD9ba9df9E71e9857279a"
		}
	}
};
