import { GetterTree, ActionTree, MutationTree } from "vuex";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { chainData, wallets } from "~/constants/web3";

declare let window: any;
declare let ethereum: any;

const [Metamask, Walletconnect] = wallets;
const WALLET_CONNECTED = "wallet_connected";
const DEFAULT_CHAIN_ID = 31010;

type Web3StoreType = {
	instance: any,
	balance: number,
	account: string,
	error: any,
	chainId: number | null,
	chains: any,
	connectedWallet: any,
}
export const state = ():Web3StoreType => ({
	instance: null,
	balance: 0,
	account: "",
	error: null,
	chainId: null,
	chains: chainData,
	connectedWallet: null,
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
	}
};

export const actions: ActionTree<Web3State, Web3State> = {
	/**
   * @dev initialize with default web3 values
   */
	init ({ state, commit, dispatch }) {
		// Set default chain
		const rpcUrl = state.chains[DEFAULT_CHAIN_ID].provider;
		const defaultWeb3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
		commit("setWeb3", () => defaultWeb3);
		commit("setChainId", DEFAULT_CHAIN_ID);

		if (localStorage.getItem(WALLET_CONNECTED)) {
			const wallet = localStorage.getItem("nuon-wallet");
			dispatch("connect", {wallet});
		}
		dispatch("tokenStore/getTokenPrices",{}, {root:true});
	},

	async connect (ctx: any, {wallet, onError}) {
		const {commit, dispatch, state} = ctx;
		commit("setConnectedWallet", wallet);

		if (wallet === Metamask) {
			if (window.ethereum) {
				try {
					dispatch("setChain");
					localStorage.setItem(WALLET_CONNECTED, "connected");
					localStorage.setItem("nuon-wallet", wallet);
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
					qrcode: true
				});

				await provider.enable();
				const web3 = new Web3(provider as unknown as string);
				const [account] = await web3.eth.getAccounts();
				commit("setAccount", account);

				const chainId = await web3.eth.net.getId();
				commit("setWeb3", () => web3);
				dispatch("updateChain", chainId);
				localStorage.setItem(WALLET_CONNECTED, "connected");
				localStorage.setItem("nuon-wallet", wallet);
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
		}
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
			const balance = await web3.eth.getBalance(account);
			commit("setChainId", chainId);
			commit("setWeb3", () => web3);
			commit("setAccount", account);
			commit("setBalance", balance);

			dispatch("initializeAllStore", {address: state.account, chainId: state.chainId, web3});
			
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
			});
		}
	},

	async wrongNetwork(){
		const web3 = new Web3(Web3.givenProvider);
		if(await web3.eth.net.getId() != 31010){
			return true
		}
		else {
			return false 
		}
	}
};

export const getters: GetterTree<Web3State, Web3State> = {
	instance: state => state.instance,
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
	chainId: state => state.chainId,
	explorerLink: state => {
		const chainId: any = state.chainId;
		const chainInfo: any = state.chains[chainId];
		return chainInfo.explorerLink;
	}
};
