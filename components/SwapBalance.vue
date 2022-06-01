<template>
	<LayoutFlex
		direction="row-center-space-between"
		class="swap__balance">
		<label>{{ label }}</label>
		<p v-if="token === 'HX'">HX Balance: <span>{{ numberWithCommas(hxBalance.toFixed(2)) }}</span></p>
		<p v-if="token === 'USX'">Nuon Balance: <span>{{ numberWithCommas(usxBalance.toFixed(2)) }}</span></p>
		<p v-if="token === 'ETH'">ETH Balance: <span>{{ numberWithCommas(ethBalance.toFixed(3)) }}</span></p>
	</LayoutFlex>
</template>

<script>
import { fromWei } from "~/utils/bnTools";

export default {
	name: "SwapBalance",
	props: {
		label: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	},
	computed: {
		hxBalance() {
			return this.$store.getters["erc20Store/hxBalance"] || 0;
		},
		usxBalance() {
			return this.$store.getters["erc20Store/usxBalance"] || 0;
		},
		ethBalance() {
			return parseFloat(fromWei(this.$store.getters["web3Store/balance"])) || 0;
		}
	}
};
</script>
