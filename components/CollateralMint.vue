<template>
	<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
		<template #step-one>
			<div class="toggle__content">
				<h5 class="u-mb-12">Select Your Collateral Token To Deposit</h5>
				<CollateralClaimAccordion
					:token="claimRewardsToken"
					@selected-token="selectClaimToken" />
			</div>
			<div class="toggle__transaction">
				<TheButton
					size="ghost"
					:disabled="isApproved"
					:class="isApproved"
					title="Click to approve"
					@click="approveTokens">
					<span v-if="isApproved">Approved</span>
					<span v-else>Approve</span>
				</TheButton>
				<TheButton
					class="u-full-width"
					size="ghost"
					title="Click to deposit"
					@click="activeStep = 2">Next</TheButton>
			</div>
		</template>
		<template #step-two>
			<TransactionSummary :values="summary" />
			<div class="toggle__transaction">
				<TheButton
					size="ghost"
					title="Click to go back"
					@click="activeStep = 1">Back</TheButton>
				<TheButton
					class="u-full-width"
					size="ghost"
					title="Click to confirm">Confirm</TheButton>
			</div>
		</template>
	</TheStepper>
</template>

<script>
import { HX } from "~/constants/tokens";

export default {
	name: "CollateralMint",
	data() {
		return {
			claimRewardsToken: {
				symbol: HX.symbol,
				price: 0,
				balance: 0
			},
			depositLockedCollateral: 20010,
			maxUsxMinted: 3401,
			fee: 5,
			activeStep: 1
		};
	},
	computed: {
		summary() {
			return [
				{
					title: "Collateral to Deposit",
					val: this.numberWithCommas(this.depositLockedCollateral.toFixed(2)),
					currency: "HX",
					dollar: this.numberWithCommas(this.getDollarValue(10, 1).toFixed(2))
				},
				{
					title: "Maximum Minted USX",
					val: this.numberWithCommas(this.maxUsxMinted),
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
					val: this.numberWithCommas(parseFloat(this.depositLockedCollateral).toFixed(2) - (this.fee / 100)) ,
					currency: "HX",
					dollar: this.numberWithCommas(this.getDollarValue(10, 1).toFixed(2))
				}
			];
		}
	},
};
</script>
