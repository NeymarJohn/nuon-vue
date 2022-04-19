<template>
	<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
		<template #step-one>
			<div class="toggle__content">
				<h5>Select Your Collateral Token To Withdraw</h5>
				<CollateralClaimAccordion
					:token="claimRewardsToken"
					@selected-token="selectClaimToken" />
				<TheButton
					class="u-full-width"
					size="lg"
					title="Click to deposit"
					@click="activeStep = 2">Next</TheButton>
			</div>
		</template>
		<template #step-two>
			<TransactionSummary :values="summary" />
			<div class="toggle__transaction">
				<TheButton
					size="lg"
					title="Click to go back"
					@click="activeStep = 1">Back</TheButton>
				<TheButton
					class="u-full-width"
					size="lg"
					title="Click to confirm">Confirm</TheButton>
			</div>
		</template>
	</TheStepper>
</template>

<script>
export default {
	name: "CollateralWithdraw",
	data() {
		return {
			fee: 5,
			withdrawCollateral: 3223,
			maxUsxRedeemed: 3401,
			activeStep: 1
		};
	},
	computed: {
		summary() {
			return [
				{
					title: "Collateral to Withdraw",
					val: this.numberWithCommas(this.withdrawCollateral.toFixed(2)),
					currency: "HX",
					dollar: this.numberWithCommas(this.getDollarValue(10, 1).toFixed(2))
				},
				{
					title: "Maximum Withdrawn USX",
					val: this.numberWithCommas(this.maxUsxRedeemed),
					currency: "USX",
					dollar: this.numberWithCommas(this.getDollarValue(10, 1).toFixed(2))
				},
				{
					title: "Fee",
					val: `${this.fee}%`,
					dollar: this.numberWithCommas(this.getDollarValue(10, 1).toFixed(2))
				},
				{
					title: "Total Received",
					val: this.numberWithCommas(parseFloat(this.withdrawCollateral).toFixed(2) - (this.fee / 100)) ,
					currency: "HX",
					dollar: this.numberWithCommas(this.getDollarValue(10, 1).toFixed(2))
				}
			];
		}
	},
};
</script>
