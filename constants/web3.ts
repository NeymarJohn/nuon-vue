export const CHAIN_DATA = {
	1: {
		name: "Ethereum Mainnet",
		provider: "https://mainnet.infura.io/v3/1ab1aff8d8fc45e09d68150fcf0e63bb",
		chainId: 1,
		explorerLink: "https://etherscan.io",
	},
	5: {
		name: "Goerli",
		provider: "https://goerli.infura.io/v3/1ab1aff8d8fc45e09d68150fcf0e63bb",
		chainId: 5,
		explorerLink: "https://goerli.etherscan.io",
	},
	31010: {
		name: "TK",
		provider: "https://eth-private-testnet-poa.hydrogenx.tk/",
		chainId: 31010,
		explorerLink: "http://13.251.9.172:4000",
	}
};
export const WALLETS = ["metamask", "walletconnect"];
export const NETWORKS = [5, 31010];
export const DEFAULT_BASIC_RATIO = 300;
