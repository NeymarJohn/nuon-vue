<template>
	<div>
		<ul class="nav">
			<li>
				<NuxtLink
					to="/"
					title="Click to visit dashboard"
					:class="{'active-link': isRouteActive('/')}">
					<DashboardIcon /> Dashboard
				</NuxtLink>
			</li>
			<li>
				<NuxtLink
					to="/mint"
					title="Click to visit mint"
					:class="{'active-link': isRouteActive('/mint')}">
					<MintIcon /> Mint
				</NuxtLink>
			</li>
			<li>
				<NuxtLink
					to="/manage"
					title="Click to visit manage"
					:class="{'active-link': isRouteActive('/manage')}">
					<ManageIcon /> Manage
				</NuxtLink>
			</li>
			<li>
				<NuxtLink
					to="/govern"
					title="Click to visit govern"
					:class="{'active-link': isRouteActive('/govern')}">
					<GovernIcon /> Govern
				</NuxtLink>
			</li>
			<li>
				<NuxtLink
					to="/swap"
					title="Click to visit the swap"
					:class="{'active-link': isRouteActive('/swap')}">
					<SwapIcon /> Swap
				</NuxtLink>
			</li>
			<li v-tooltip="'Coming Soon'" class="link-disabled">
				<NuxtLink
					event=""
					to="/farms"
					title="Click to visit the Farms"
					class="u-is-disabled"
					:class="{'active-link': isRouteActive('/farms')}">
					<FarmIcon /> Farms
				</NuxtLink>
			</li>
			<li v-tooltip="'Coming Soon'" class="link-disabled">
				<NuxtLink
					event=""
					to="/analytics"
					title="Click to visit Analytics"
					class="u-is-disabled"
					:class="{'active-link': isRouteActive('/analytics')}">
					<AnalyticsIcon /> Analytics
				</NuxtLink>
			</li>
			<a href="https://whitepaper.nuon.fi/" title="Click to visit the documentation" target="_blank" rel="noopener noreferrer"><DocumentationIcon /> Docs <ExternalLinkIcon class="u-mr-0 u-ml-8" /></a>
		</ul>
		<ul class="faucet">
			<li @click="getMockToken('ETH')">
				<NuxtLink to="" title="Click to get ETH">ETH</NuxtLink>
			</li>
			<li @click="getMockToken('WETH')">
				<NuxtLink to="" title="Click to get WETH">WETH</NuxtLink>
			</li>
			<li @click="getMockToken('USDT')">
				<NuxtLink to="" title="Click to get USDT">USDT</NuxtLink>
			</li>
		</ul>
	</div>
</template>

<script>
import DashboardIcon from "@/assets/images/svg/svg-menu-dashboard.svg";
import MintIcon from "@/assets/images/svg/svg-menu-mint.svg";
import ManageIcon from "@/assets/images/svg/svg-menu-manage.svg";
import GovernIcon from "@/assets/images/svg/svg-menu-govern.svg";
import SwapIcon from "@/assets/images/svg/svg-menu-swap.svg";
import FarmIcon from "@/assets/images/svg/svg-menu-farm.svg";
import AnalyticsIcon from "@/assets/images/svg/svg-menu-analytics.svg";
import DocumentationIcon from "@/assets/images/svg/svg-menu-documentation.svg";
import ExternalLinkIcon from "@/assets/images/svg/svg-external-link.svg";

export default {
	name: "TheNav",
	components: {
		DashboardIcon,
		MintIcon,
		ManageIcon,
		GovernIcon,
		SwapIcon,
		FarmIcon,
		AnalyticsIcon,
		DocumentationIcon,
		ExternalLinkIcon,
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
					window.open("https://faucets.chain.link/", "_blank");
					// const web3 = this.$store.getters["web3Store/instance"]();
					// const nonce = await web3.eth.getTransactionCount("0x0e11924EE7DA81B3d9aBcc2339e562fc3747B3Bf", "latest");
					// const transaction = {
					// 	"from": "0x0e11924EE7DA81B3d9aBcc2339e562fc3747B3Bf",
					// 	"to": this.connectedAccount,
					// 	"value": web3.utils.toWei("1", "ether"),
					// 	"gas": 30000,
					// 	nonce: web3.utils.toHex(nonce)
					// };
					// const signedTx = await web3.eth.accounts.signTransaction(transaction, "35f63c4c46e1bc178153129b596caeb1efa8f25b25fb5b4e1b7d94a5344bbfe6");
					// web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, hash) => {
					// 	if (!err) {
					// 		this.successToast(null, "TX executed", hash);
					// 	} else {
					// 		this.failureToast(null, err, "❗Something went wrong while submitting your transaction:");
					// 	}
					// });
				}
			} catch (err) {
				this.failureToast(null, err);
			}
		}
	}
};
</script>
