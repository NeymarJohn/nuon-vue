<template>
	<div :class="['notification', 'normal', ['low', 'medium', 'high'].find(l => message === $data[l])]">
		<p>{{ message }}</p>
	</div>
</template>

<script>
export default {
	name: "TheNotification",
	props: {
		myCollateralizationRatio: {
			type: Number,
			default: null
		},
		minCollateralizationRatio: {
			type: [Number, String],
			default: null
		},
	},
	data() {
		return {
			low: "Your collateralization ratio is good and at low risk of liquidation.",
			medium: "Your collateralization ratio is at medium risk of liquidation.",
			high: "Your collateralization ratio is low and at high risk of liquidation. Please deposit more collateral.",
			normal: "Hi there, please deposit your collaterals to mint NUON."
		};
	},
	computed: {
		message() {
			if (this.myCollateralizationRatio === 0 && this.connectedAccount) return this.normal;
			if (this.connectedAccount) {
				return this.myCollateralizationRatio < 300 ? this.myCollateralizationRatio < 200 ? this.high : this.medium : this.low;
			}
			return "Please connect your wallet to deposit collateral.";
		}
	}
};
</script>
