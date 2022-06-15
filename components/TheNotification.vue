<template>
	<div class="notification">
		<p v-if="myCollateralizationRatio > minCollateralizationRatio">Your collateralization ratio is good and at low risk of liquidation.</p>
		<p v-if="myCollateralizationRatio <= minCollateralizationRatio && myCollateralizationRatio != 0">Your collateralization ratio is low and at high risk of liquidation. Please deposit more collateral.</p>
		<p v-if="myCollateralizationRatio === 0">Hi there, please deposit your collaterals to mint NUON.</p>
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
			type: Number,
			required: true
		},
	}
};
</script>
