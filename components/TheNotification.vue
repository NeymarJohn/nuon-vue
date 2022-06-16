<template>
	<div :class="['notification', 'normal', ['low', 'high'].find(l => message === $data[l])]">
		<p>{{ message }}</p>
	</div>
</template>

<script>
export default {
	name: "TheNotification",
	props: {
		myCollateralizationRatio: {
			type: Number,
			required: true
		},
		minCollateralizationRatio: {
			type: [Number, String],
			required: true
		},
	},
	data() {
		return {
			low: "Your collateralization ratio is good and at low risk of liquidation.",
			high: "Your collateralization ratio is low and at high risk of liquidation. Please deposit more collateral.",
			normal: "Hi there, please deposit your collaterals to mint NUON."
		};
	},
	computed: {
		message() {
			if (this.myCollateralizationRatio && this.myCollateralizationRatio > this.minCollateralizationRatio) return this.low;
			if (this.myCollateralizationRatio && this.myCollateralizationRatio <= this.minCollateralizationRatio) return this.high;
			if (this.myCollateralizationRatio && this.myCollateralizationRatio === 0) return this.normal;
			return "Please connect your wallet to deposit collateral.";
		}
	}
};
</script>
