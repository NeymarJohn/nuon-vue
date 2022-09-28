import Vue from "vue";
import { GetterTree, ActionTree, MutationTree } from "vuex";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { CHAIN_DATA, NETWORKS, WALLETS } from "~/constants/web3";

declare let window: any;
declare let ethereum: any;

const [Metamask, Walletconnect] = WALLETS;
const WALLET_CONNECTED = "nuon_wallet_connected";
export const LAST_CHAIN_ID = "nuon_last_connected_chain";
const WALLET_TYPE = "nuon_wallet_type";
export const DEFAULT_CHAIN_ID = parseInt(process.env.default_chain_id || "31010");

type Web3StoreType = {
	instance: any,
	balance: number,
	account: string,
	error: any,
	chainId: number | null,
	chains: any,
	connectedWallet: any,
	blockNumber: string | null
}

export const state = ():Web3StoreType => ({
	instance: null,
	balance: 0,
	account: "",
	error: null,
	chainId: null,
	chains: CHAIN_DATA,
	connectedWallet: null,
	blockNumber: null
});

export type Web3State = ReturnType<typeof state>

export const mutations: MutationTree<Web3State> = {
	setWeb3 (state, payload) {
		state.instance = payload;
	},
	setBalance (state, payload) {
		state.balance = payload;
	},
	setAccount (state, payload) {
		state.account = payload;
	},
	setChainId (state, payload) {
		state.chainId = payload;
	},
	setConnectedWallet (state, payload) {
		state.connectedWallet = payload;
	},
	setBlockNumber(state, payload) {
		state.blockNumber = payload;
	}
};

export const actions: ActionTree<Web3State, Web3State> = {
	/**
   * @dev initialize with default web3 values
   */
	init ({ state, commit, dispatch }) {
		if (localStorage.getItem(WALLET_CONNECTED) && localStorage.getItem(LAST_CHAIN_ID)) {
			const wallet = localStorage.getItem(WALLET_TYPE);
			const chainId = localStorage.getItem(LAST_CHAIN_ID) as string;
			const rpcUrl = state.chains[chainId].provider;
			const defaultWeb3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
			commit("setWeb3", () => defaultWeb3);
			commit("setChainId", DEFAULT_CHAIN_ID);
			dispatch("connect", {wallet});
		}
	},

	async connect (ctx: any, {wallet, onError}) {
		const {commit, dispatch, state} = ctx;
		commit("setConnectedWallet", wallet);

		if (wallet === Metamask) {
			if (window.ethereum) {
				try {
					dispatch("setChain");
					localStorage.setItem(WALLET_TYPE, wallet);
				} catch (e) {
					if (onError) onError(e);
				} finally {
					commit("modalStore/setModalVisibility", {name: "connectWalletModal", visibility: false}, {root:true});
				}
			} else {
				commit("modalStore/setModalVisibility", {name: "connectWalletModal", visibility: false}, {root:true});
				commit("modalStore/setModalInfo",{name: "alertModal", info: {title:"Connect Wallet", htmlContent: "Please install <a href='https://metamask.io/' target='_blank'><strong>MetaMask</strong></a>"}}, {root: true});
				commit("modalStore/setModalVisibility", {name: "alertModal", visibility: true}, {root:true});
			}
		} else if (wallet === Walletconnect) {
			try {
				const provider = new WalletConnectProvider({
					rpc: {
						[DEFAULT_CHAIN_ID]: "https://eth-private-testnet-poa.hydrogenx.tk/"
					},
					chainId: DEFAULT_CHAIN_ID,
					qrcode: true,
				});

				await provider.enable();
				const web3 = new Web3(provider as unknown as string);
				const [account] = await web3.eth.getAccounts();
				commit("setAccount", account);
				const chainId = await web3.eth.net.getId();
				commit("setWeb3", () => web3);
				dispatch("updateChain", chainId);
				localStorage.setItem(WALLET_TYPE, wallet);
				dispatch("initializeAllStore", {address: state.account, chainId: state.chainId, web3});

				provider.on("accountsChanged", async (accounts: string[]) => {
					if (accounts.length > 0) {
						const balance = await web3.eth.getBalance(accounts[0]);
						commit("setAccount", accounts[0]);
						commit("setBalance", balance);
						dispatch("initializeAllStore", {address: state.account, chainId: state.chainId, web3});
					} else {
						dispatch("disconnect");
					}
				});

				// Subscribe to chainId change
				provider.on("chainChanged", (chainId: number) => {
					dispatch("updateChain", chainId);
				});

				// Subscribe to session disconnection
				provider.on("disconnect", () => { // code: number, reason: string
					dispatch("disconnect");
				});

				commit("modalStore/setModalVisibility", {name: "connectWalletModal", visibility: false}, {root:true});
			} catch (e) {
				if (onError) onError(e);
			}
		};
	},

	initializeAllStore({dispatch}, {address, chainId, web3}) {
		dispatch("erc20Store/initializeBalance", {address , chainId, web3}, {root: true});
		dispatch("swapStore/initialize", {}, {root: true});
		dispatch("boardroomStore/initialize", {}, {root: true});
		dispatch("collateralVaultStore/initialize", {}, {root: true});
		dispatch("pancakeswapStore/initialize", {}, {root: true});
	},
	disconnect ({ commit }) {
		commit("setAccount", "");
		localStorage.removeItem(WALLET_CONNECTED);
	},

	async updateChain({commit, state}, chainId) {
		const web3 = new Web3(Web3.givenProvider);
		const balance = await web3.eth.getBalance(state.account);
		commit("setChainId", chainId);
		commit("setBalance", balance);
		return true;
	},

	async setChain({commit, dispatch, state}) {
		if (state.connectedWallet === Metamask) {
			const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
			const chainId = Web3.utils.hexToNumber(await window.ethereum.request({ method: "eth_chainId" }));
			const web3 = new Web3(Web3.givenProvider);
			// check if network is valid
			if(!NETWORKS.includes(chainId)){
				commit("modalStore/setModalInfo",{name: "alertModal", info: {title:"Wrong Network", message: "You are using a wrong network, please change to Goerli.", cta: "switch-network"}}, {root: true});
				commit("modalStore/setModalVisibility", {name: "alertModal", visibility: true}, {root:true});
				return;
			}
			const balance = await web3.eth.getBalance(account);
			commit("setChainId", chainId);
			commit("setWeb3", () => web3);
			commit("setAccount", account);
			commit("setBalance", balance);

			dispatch("initializeAllStore", {address: state.account, chainId: state.chainId, web3});

			const blockNumber = await web3.eth.getBlockNumber();
			commit("setBlockNumber", blockNumber);
			commit("rootStore/setIsLoaded", true, {root:true});
			// Fetch Token Prices
			dispatch("tokenStore/getTokenOraclePrices",{}, {root:true});
			dispatch("tokenStore/getTokenSwapPrices",{}, {root:true});
			//  Set Events
			ethereum.on("accountsChanged", async (accounts: string[]) => {
				if (accounts.length > 0) {
					const balance = await web3.eth.getBalance(accounts[0]);
					commit("setAccount", accounts[0]);
					commit("setBalance", balance);
					dispatch("initializeAllStore", {address: state.account, chainId: state.chainId, web3});
				} else {
					dispatch("disconnect");
				}
			});
			ethereum.on("disconnect", () => {
				dispatch("disconnect");
			});
			ethereum.on("chainChanged", () => {
				dispatch("setChain");
				window.location.reload();
			});

			// Put Storage Value
			localStorage.setItem(WALLET_CONNECTED, "connected");
			localStorage.setItem(LAST_CHAIN_ID, `${chainId}`);
			Vue.$cookies.set(LAST_CHAIN_ID, chainId);
		};
	},
};

export const getters: GetterTree<Web3State, Web3State> = {
	instance: state => state.instance,
	chainId: state => state.chainId,
	balance: state => state.balance,
	account: (state) => {
		if (state.account === "") {
			return "";
		}
		return state.account;
	},
	isConnectedWallet: (state) => {
		return !!state.account;
	},
	explorerLink: state => {
		const chainId: any = state.chainId;
		const chainInfo: any = state.chains[chainId];
		return chainInfo.explorerLink;
	}
};
