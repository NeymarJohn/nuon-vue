<template>
	<LayoutFooter>
		<TheWallet />
		<ul class="social-icons">
			<li>
				<a href="https://t.me/NuonFinance" target="_blank" rel="noopener noreferrer" title="Click to chat with us on Telegram"><TelegramIcon /></a>
			</li>
			<li>
				<a href="https://twitter.com/NuonFinance" target="_blank" rel="noopener noreferrer" title="Click to follow us on Twitter">
					<TwitterIcon />
				</a>
			</li>
			<li>
				<a href="https://nuonfinance.medium.com/" target="_blank" rel="noopener noreferrer" title="Click to follow us on Medium">
					<MediumIcon />
				</a>
			</li>
			<li>
				<a href="https://discord.com/invite/pWT49HTJJu" target="_blank" rel="noopener noreferrer" title="Click to follow us on Discord">
					<DiscordIcon />
				</a>
			</li>
		</ul>
		<div class="app-info">
			<p>Version {{ appVersion }}</p>
			<TheLoader component="p">
				<p class="block-number">Latest Block: <a :href="`${explorerLink}/block/${blockNumber}`" title="Click to view the latest block" target="_blank" rel="noopener noreferrer">{{ blockNumber }}</a></p>
			</TheLoader>
		</div>
	</LayoutFooter>
</template>

<script>
import { version } from "../package.json";
import DiscordIcon from "@/assets/images/svg/svg-discord.svg";
import MediumIcon from "@/assets/images/svg/svg-medium.svg";
import TelegramIcon from "@/assets/images/svg/svg-telegram.svg";
import TwitterIcon from "@/assets/images/svg/svg-twitter.svg";
import { CHAIN_DATA } from "~/constants/web3";

export default {
	name: "TheFooter",
	components: {
		DiscordIcon,
		MediumIcon,
		TelegramIcon,
		TwitterIcon
	},
	data () {
		return {
			currentYear: new Date().getFullYear(),
			appVersion: version
		};
	},
	computed: {
		blockNumber() {
			return this.$store.state.web3Store.blockNumber;
		},
		explorerLink() {
			if (!CHAIN_DATA[this.$store.state.web3Store.chainId]) return "";
			return CHAIN_DATA[this.$store.state.web3Store.chainId].explorerLink;
		}
	},
};
</script>
