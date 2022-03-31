import { DAI, HX, USX } from "./tokens";

export const BOARDROOM_ADDRESS  =  "0xB2dc4BC72deF42A2c256560e2A51C6Efe1b258cf";  // BoardroomV2.sol (Proxy)
export const STABILITYFLASH_ADDRESS = "0x62e53eD7c403245a7F5E44C5F2cCb3b2bF61F562"; // TransparentUpgradeableProxy.sol
export const ROUTER_ADDRESS = "0x758B96462006cAa45A0cf2F68C9408E5077Ae459"; // UniswapV2Router02.sol
export const USX_CONTROLLER_ADDRESS = "0x315B30b5C0932875A44581465271503d7d4a7b15"; // USXController.sol
export const ORACLE_USX_DAI_ADDRESS = "0xba4580Ad9a243d162b57982A1acaf10F73230c01"; // UniswapPairOracle_USX_DAI.sol
export const WETH_ADDRESS = "0x1B2ccE405Cb1bA2930aF7eD36AC34874a3A2C36C"; // MockETH.sol
export const HYDRO_ADDRESS = "0xd0e1e561aAc2A1348264c3227094568D38fd1637"; // HydroToken.sol
export const USX_ADDRESS = "0x11c10F04b915925DE0d6E773F3da5E96DaDB079f"; // USX.sol
export const DAI_ADDRESS = "0x1D81cea6F1485a490aD19d58bA07a87611E4eC69"; // MockDAI.sol
export const TREASURY_ADDRESS = "0x2E4e450d2305EE9B69f6575BB9138F848e3079a1"; // TreasuryV2 / TransparentUpgradeableProxy
export const HX_USX_PAIR_ADDRESS = "0x6FD805518e7a9cC7660bd723eec425060fE9193d"; // UniswapV2Pair_HX_USX
export const USX_DAI_PAIR_ADDRESS = "0x558BEa220FEE4Dc2B2adD92AE79600032EB2372E"; // UniswapV2Pair_USX_DAI
export const HX_DAI_PAIR_ADDRESS = "0x33937796BdE80b6D8DE91590AC606Ba13E3A6DDA"; // UniswapV2Pair_HX_DAI

export const EPOCH_PERIOD = 6; // 6 hours from Treasury.sol

export const VALID_NETWORKS = [31010];

export const tokenPairs = [
	{
		address: "0x6FD805518e7a9cC7660bd723eec425060fE9193d",
		pairName: "USX_HX",
		pairs: ["USX", "HX"]
	}, {
		address: "0x558BEa220FEE4Dc2B2adD92AE79600032EB2372E",
		pairName: "DAI_USX",
		pairs: ["USX", "DAI"]
	}, {
		address: "0x33937796BdE80b6D8DE91590AC606Ba13E3A6DDA",
		pairName: "DAI_HX",
		pairs: ["DAI", "HX"]
	}
];
