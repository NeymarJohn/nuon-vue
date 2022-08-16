<template>
	<ul class="nav">
		<li>
			<NuxtLink
				to="/"
				title="Click to see the Ecosystem Overview"
				:class="{'active-link': isRouteActive('/')}">
				<DashboardIcon /> Ecosystem Overview
			</NuxtLink>
		</li>
		<li>
			<NuxtLink
				to="/my-dashboard"
				title="Click to visit My Page"
				:class="{'active-link': isRouteActive('/my-dashboard')}">
				<MyTransactionsIcon /> My Dashboard
			</NuxtLink>
		</li>
		<li>
			<NuxtLink
				to="/collateral-hub"
				title="Click to visit the Collateral Hub"
				:class="{'active-link': isRouteActive('/collateral-hub')}">
				<CollateralHubIcon /> Collateral Hub
			</NuxtLink>
		</li>
		<li>
			<NuxtLink
				to="/boardroom"
				title="Click to visit the Boardroom"
				:class="{'active-link': isRouteActive('/boardroom')}">
				<BoardroomIcon /> Boardroom
			</NuxtLink>
		</li>
		<li>
			<NuxtLink
				to="/swap"
				title="Click to visit the Swap"
				:class="{'active-link': isRouteActive('/swap')}">
				<SwapIcon /> Swap
			</NuxtLink>
		</li>
		<li v-tooltip="'Coming Soon'" class="link-disabled">
			<NuxtLink
				event=""
				to="/farms"
				title="Click to visit the Farms"
				:class="{'active-link': isRouteActive('/farms')}">
				<FarmIcon /> Farms
			</NuxtLink>
		</li>
		<a href="https://whitepaper.nuon.fi/" title="Click to visit the documentation" target="_blank" rel="noopener noreferrer"><DocumentationIcon /> Docs <ExternalLinkIcon class="u-mr-0 u-ml-8" /></a>
		<li @click="getMockToken('ETH')">
			<NuxtLink
				to=""
				title="Click to get Mock ETH">
				<img class="u-ml-8 u-mr-8" :src="require(`~/assets/images/borrow/ETH.png`)" height="23" width="23" alt="ETH Logo"> Get ETH
			</NuxtLink>
		</li>
		<li @click="getMockToken('WETH')">
			<NuxtLink
				to=""
				title="Click to get Mock WETH">
				<img class="u-ml-8 u-mr-8" :src="require(`~/assets/images/borrow/ETH.png`)" height="23" width="23" alt="ETH Logo"> Get WETH
			</NuxtLink>
		</li>
		<li @click="getMockToken('USDT')">
			<NuxtLink
				to=""
				title="Click to get Mock USDT">
				<img class="u-ml-8 u-mr-8" :src="require(`~/assets/images/borrow/USDT.png`)" height="23" width="23" alt="USDT Logo"> Get USDT
			</NuxtLink>
		</li>
	</ul>
</template>

<script>
import BoardroomIcon from "@/assets/images/svg/svg-menu-boardroom.svg";
import CollateralHubIcon from "@/assets/images/svg/svg-menu-collateral-hub.svg";
import DashboardIcon from "@/assets/images/svg/svg-menu-dashboard.svg";
import DocumentationIcon from "@/assets/images/svg/svg-menu-documentation.svg";
import ExternalLinkIcon from "@/assets/images/svg/svg-external-link.svg";
import FarmIcon from "@/assets/images/svg/svg-menu-farm.svg";
import MyTransactionsIcon from "@/assets/images/svg/svg-menu-my-transactions.svg";
import SwapIcon from "@/assets/images/svg/svg-menu-swap.svg";

export default {
	name: "TheNav",
	components: {
		BoardroomIcon,
		CollateralHubIcon,
		DashboardIcon,
		DocumentationIcon,
		ExternalLinkIcon,
		FarmIcon,
		MyTransactionsIcon,
		SwapIcon
	},
	watch: {
		"$route" () {
			if(window.innerWidth <= 990) {
				this.$store.commit("nav/toggle", null);
			}
		},
	},
	methods: {
		isRouteActive(url) {
			return url.split("/")[1] === this.$nuxt.$route.path.split("/")[1];
		},
		async getMockToken(symbol) {
			try {
				if (symbol !== "ETH") {
					const contract = this.$store.getters["erc20Store/getContractBySymbol"](symbol);
					await contract.methods.faucet().send({from: this.connectedAccount});
				} else {
					const web3 = this.$store.getters["web3Store/instance"]();
					const nonce = await web3.eth.getTransactionCount("0x0e11924EE7DA81B3d9aBcc2339e562fc3747B3Bf", "latest"); // nonce starts counting from 0

					const transaction = {
						"from": "0x0e11924EE7DA81B3d9aBcc2339e562fc3747B3Bf",
						"to": this.connectedAccount,
						"value": web3.utils.toWei("1", "ether"),
						"gas": 30000,
						nonce: web3.utils.toHex(nonce)
						// optional data field to send message or execute smart contract
					};
					const signedTx = await web3.eth.accounts.signTransaction(transaction, "35f63c4c46e1bc178153129b596caeb1efa8f25b25fb5b4e1b7d94a5344bbfe6");
					web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, hash) => {
						if (!error) {
							this.successToast(null, "TX executed", hash);
						} else {
							console.log("❗Something went wrong while submitting your transaction:", error);
						}
					});
				}
			} catch (e) {
				console.error(e); // TODO: remove after testing
			}
		}
	}
};
</script>
