<template>
	<LayoutFooter>
		<TheWallet />
		<ul class="social-icons">
			<li>
				<a href="https://twitter.com/ultra_stable" target="_blank" rel="noopener noreferrer" title="Click to follow us on Twitter">
					<TwitterIcon />
				</a>
			</li>
			<li>
				<a href="https://t.me/ultrastable_money" target="_blank" rel="noopener noreferrer" title="Click to chat with us on Telegram"><TelegramIcon /></a>
			</li>
		</ul>
		<div class="app-info">
			<p>Version {{ appVersion }}</p>
			<TheLoader component="p">
				<p class="block-number">Latest Block: <a :href="`https://etherscan.io/block/${blockNumber}`" title="Click to view the latest block" target="_blank" rel="noopener noreferrer">{{ blockNumber }}</a></p>
			</TheLoader>
		</div>
	</LayoutFooter>
</template>

<script>
import { version } from "../package.json";
import TwitterIcon from "@/assets/images/svg/svg-twitter.svg";
import TelegramIcon from "@/assets/images/svg/svg-telegram.svg";

export default {
	name: "TheFooter",
	components: {
		TwitterIcon,
		TelegramIcon
	},
	data () {
		return {
			currentYear: new Date().getFullYear(),
			blockNumber: 0,
			appVersion: version
		};
	},
	async mounted() {
		const web3 = this.$store.getters["web3Store/instance"]();
		this.blockNumber = await web3.eth.getBlockNumber();
		this.$store.commit("rootStore/setIsLoaded", true);
	}
};
</script>
