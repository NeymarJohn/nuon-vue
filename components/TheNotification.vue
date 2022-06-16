<template>
	<div class="notification">
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
	computed: {
		message() {
			if (this.myCollateralizationRatio && this.myCollateralizationRatio > this.minCollateralizationRatio) return "Your collateralization ratio is good and at low risk of liquidation.";
			if (this.myCollateralizationRatio && this.myCollateralizationRatio <= this.minCollateralizationRatio) return "Your collateralization ratio is low and at high risk of liquidation. Please deposit more collateral.";
			if (this.myCollateralizationRatio && this.myCollateralizationRatio === 0) return "Hi there, please deposit your collaterals to mint NUON.";
			return "Please connect your wallet to deposit collateral.";
		}
	}
};
</script>
