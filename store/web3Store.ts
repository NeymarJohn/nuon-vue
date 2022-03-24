import { GetterTree, ActionTree, MutationTree } from "vuex";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { VALID_NETWORKS } from "~/constants/addresses";
import { failureToast } from "~/plugins/helpers.js";

declare let window: any;
declare let ethereum: any;

const WALLET_CONNECTED = "wallet_connected";
const DEFAULT_CHAIN_ID = 31010;

export const state = () => ({
	instance: () => (
		new Web3(new Web3.providers.HttpProvider("https://eth-private-testnet-poa.hydrogenx.tk/"))
	),
	balance: 0,
	account: "",
	error: null,
	chainId: null,
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
};

export const actions: ActionTree<Web3State, Web3State> = {
	/**
   * @dev initialize with default web3 values
   */
	init ({ commit, dispatch }) {
		const chainId = DEFAULT_CHAIN_ID;
		const web3 = new Web3(new Web3.providers.HttpProvider("https://eth-private-testnet-poa.hydrogenx.tk/"));

		commit("setWeb3", () => web3);
		commit("setChainId", chainId);
		if (localStorage.getItem(WALLET_CONNECTED)) {
			const wallet = localStorage.getItem("nuon-wallet");
			if (wallet === "metamask") {
				dispatch("connect", "metamask");
			} else {
				dispatch("connect", "walletconnect");
			}
		}
	},

	async connect (ctx: any, wallet) {
		const {commit, dispatch, state} = ctx;
		localStorage.setItem("nuon-wallet", wallet);
		if (wallet === "metamask") {
			if (window.ethereum) {
				try {
					const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
					const chainId = Web3.utils.hexToNumber(await window.ethereum.request({ method: "eth_chainId" }));
					const web3 = new Web3(Web3.givenProvider);
					commit("setAccount", account);
					commit("setWeb3", () => web3);
					dispatch("updateChain", chainId);
					localStorage.setItem(WALLET_CONNECTED, "connected");
					// Dispatch other modules actions
					dispatch("initializeAllStore", {address: state.account, chainId: state.chainId, web3});

					// Handling events on ethereum provider
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

					ethereum.on("chainChanged", (chainIdHex: string) => {
						dispatch("updateChain", chainIdHex);
					});
				} catch (e) {
					failureToast(null, e, "Wallet connection failed");
				} finally {
					commit("modalStore/setModalVisibility", {name: "connectWalletModal", visibility: false}, {root:true});
				}
			} else {
				commit("modalStore/setModalInfo",{name: "alertModal", info: {title:"Connect Wallet", htmlContent: "Please install <a href='https://metamask.io/' target='_blank'><strong>MetaMask</strong></a>"}}, {root: true});
				commit("modalStore/setModalVisibility", {name: "alertModal", visibility: true}, {root:true});
			}
		} else {
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
				const chainId = await web3.eth.net.getId();

				commit("setAccount", account);
				commit("setWeb3", () => web3);
				dispatch("updateChain", chainId);
				localStorage.setItem(WALLET_CONNECTED, "connected");
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
			} catch (e) {
				failureToast(null, e, "Wallet connection failed");
			} finally {
				commit("modalStore/setModalVisibility", {name: "connectWalletModal", visibility: false}, {root:true});
			}
		}
	},

	initializeAllStore({dispatch}, {address, chainId, web3}) {
		dispatch("erc20Store/initializeBalance", {address , chainId, web3}, {root: true});
		dispatch("swapStore/initialize", {}, {root: true});
		dispatch("boardroomStore/initialize", {}, {root: true});
		dispatch("stabilityFlashStore/initialize", {}, {root: true});
	},
	disconnect ({ commit }) {
		commit("setAccount", "");
		localStorage.removeItem(WALLET_CONNECTED);
	},

	async updateChain({commit, state}, chainIdHex:string) {
		let chainId = Web3.utils.hexToNumber(chainIdHex);
		if (!VALID_NETWORKS.includes(chainId)) {
			commit("modalStore/setModalInfo",{name: "alertModal", info: {title:"Wrong Network", message: "Please connect to a supported network in your wallet"}}, {root: true});
			commit("modalStore/setModalVisibility", {name: "alertModal", visibility: true}, {root:true});
			chainId = DEFAULT_CHAIN_ID;
		}
		const web3 = new Web3(Web3.givenProvider);
		const balance = await web3.eth.getBalance(state.account);
		commit("setChainId", chainId);
		commit("setBalance", balance);
		return true;
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
};
