<template>
	<div class="input-govern">
		<div class="input-govern__wrapper">
			<div class="input-govern__title">
				<label>Claim</label>
				<label>Available Balance: {{ numberWithCommas(token.toFixed(2)) }}</label>
			</div>
			<div class="input-wrapper">
				<div class="input-token">
					<BusdLogo />
					<h5>BUSD</h5>
				</div>
				<InputMax v-model="inputValue" :click="inputMaxBalance" :maximum="token" />
			</div>
		</div>
		<p v-if="isMoreThanBalance" class="u-is-warning">Insufficient balance.</p>
		<TransactionSummary v-if="inputValue > 0" :values="summary" />
		<TheButton
			size="md"
			:disabled="isDisabled()"
			title="Click to claim"
			@click="submitTransaction">Claim</TheButton>
	</div>
</template>

<script>
import BusdLogo from "@/assets/images/logo/logo-busd.svg";
import { fromWei } from "~/utils/bnTools";

export default {
	name: "InputClaim",
	components: {
		BusdLogo,
	},
	props: {
		token: {
			type: Number,
			required: true
		},
	},
	data () {
		return {
			inputValue: 0,
		};
	},
	computed: {
		canClaimRewards() {
			return this.$store.state.boardroomStore.canClaimRewards;
		},
		claimFee() {
			return this.$store.state.boardroomStore.claimFee;
		},
		claimFeeToken() {
			return this.claimFee * this.claimBalance / 100 || 0;
		},
		claimBalance() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.earned));
		},
		isMoreThanBalance() {
			return parseFloat(this.inputValue) > this.token;
		},
		summary() {
			return [
				{
					title: "Amount to Claim",
					val: this.numberWithCommas(this.claimBalance.toFixed(2)),
					currency: "BUSD",
					dollar: this.claimBalance * this.tokenPrices.BUSD
				},
				{
					title: "Fee",
					val: `${this.claimFeeToken}`,
					currency: "BUSD",
					dollar: this.numberWithCommas(this.getDollarValue(this.claimFeeToken, this.tokenPrices.BUSD).toFixed(2))
				},
				{
					title: "Total Received",
					val: this.claimBalance - this.claimFeeToken,
					currency: "BUSD",
					dollar: this.numberWithCommas(this.getDollarValue(this.claimBalance - this.claimFeeToken, this.tokenPrices.BUSD).toFixed(2))
				},
			];
		},
	},
	mounted() {
		this.$store.commit("rootStore/setIsLoaded", true);
	},
	methods: {
		isDisabled () {
			if (this.inputValue <= 0 || this.isMoreThanBalance || !this.isApproved) return true;
		},
		inputMaxBalance() {
			this.inputValue = parseFloat(this.token);
		},
		submitTransaction() {
			this.$store.dispatch("boardroomStore/claimReward", {
				onReject: (err) =>{
					this.failureToast(() => err);
				}
			}).then((txHash) => {
				this.successToast(() => "Your transaction succeeded", txHash);
			});
		}
	}
};
</script>
