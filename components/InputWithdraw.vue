<template>
	<div class="input-withdraw">
		<div class="input-withdraw__wrapper">
			<div class="input-withdraw__title">
				<label>Withdraw</label>
				<label>nuMINT Available: {{ numberWithCommas(maximum.toFixed(2)) }}</label>
			</div>
			<div class="input-wrapper">
				<div class="input-token">
					<nuMintLogo />
					<h5>nuMINT</h5>
				</div>
				<div class="input">
					<div class="input__container">
						<input
							v-model="inputValue"
							placeholder="0.0"
							type="number"
							min="0"
							max="79"
							autocomplete="off"
							autocorrect="off"
							spellcheck="false"
							inputmode="decimal" />
						<TheButton
							:disabled="isMaxInputDisabled(maximum)"
							size="sm"
							title="Click to input your max balance"
							@click="inputMaxBalance">Max</TheButton>
					</div>
				</div>
			</div>
		</div>
		<div v-if="inputValue === maximum">
			<div class="modal__info--lower u-green-prompt">
				<p>Inputting maximum unstake amount will enable claim rewards at the same time when exiting staking.</p>
			</div>
			<LayoutFlex direction="column">
				<h4>Select Your Reward Token</h4>
				<div class="modal__info">
					<ClaimAccordion from="boardroom" :stepper="false" @selected-token="selectedTokenChanged" />
				</div>
			</LayoutFlex>
		</div>
		<TransactionSummary
			v-if="inputValue > 0 && inputValue === maximum"
			:values="maximumSummary" />
		<TransactionSummary
			v-if="inputValue > 0 && inputValue != maximum"
			:values="partialSummary" />
		<div v-if="inputValue > 0 && inputValue < maximum" class="modal__info--lower">
			<h4>Days before unstake: {{ epoch }} Days</h4>
			<p>Withdrawing the staked token partially will reset the unstaked window to another 14 days.</p>
		</div>
		<TheButton
			size="md"
			:disabled="isDisabled()"
			title="Click to withdraw"
			@click="submitTransaction">Withdraw</TheButton>
	</div>
</template>

<script>
import { fromWei } from "~/utils/bnTools";
import nuMintLogo from "@/assets/images/logo/logo-numint.svg";

export default {
	name: "InputWithdraw",
	components: {
		nuMintLogo,
	},
	props: {
		maximum: {
			type: Number,
			default: 0
		},
	},
	data () {
		return {
			inputValue: null,
			price: {
				nuMINT: 0
			},
			account: "",
			claimAmount: 23,
			activeStep: 1,
			selectedToken: {},
		};
	},
	computed: {
		nuMintBalance() {
			return this.$store.getters["erc20Store/nuMintBalance"] || 0;
		},
		epoch() {
			return this.$store.state.boardroomStore.epoch;
		},
		myRewards() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.earned));
		},
		claimFee() {
			return parseFloat(this.$store.state.boardroomStore.claimFee);
		},
		feePrice() {
			return this.myRewards * this.claimFee / 100;
		},
		totalReceived() {
			return (this.inputValue + this.myRewards - this.feePrice) * this.tokenPrices.nuMINT;
		},
		canWithdraw() {
			return this.$store.state.boardroomStore.canWithdraw;
		},
		maximumSummary() {
			return [
				{
					title: "Amount to Withdraw",
					val: this.numberWithCommas(parseFloat(this.inputValue).toFixed(2)),
					currency: "nuMINT",
					dollar: this.numberWithCommas(this.getDollarValue(this.inputValue, this.tokenPrices.nuMINT).toFixed(2)),
				},
				{
					title: "Amount to Claim",
					val: this.numberWithCommas(parseFloat(this.myRewards).toFixed(2)),
					currency: "nuMINT",
					dollar: this.numberWithCommas(this.getDollarValue(this.myRewards, this.tokenPrices.nuMINT).toFixed(2)),
				},
				{
					title: "Fee",
					val: `${this.claimFee}%`,
					dollar: this.numberWithCommas(this.getDollarValue(this.feePrice, this.tokenPrices.nuMINT).toFixed(2))
				},
				{
					title: "Total Exit Value",
					val: `$${this.numberWithCommas(this.totalReceived.toFixed(2))}`,
				}
			];
		},
		partialSummary() {
			return [
				{
					title: "Amount",
					val: this.numberWithCommas(parseFloat(this.inputValue).toFixed(2)),
					currency: "nuMINT",
					dollar: this.numberWithCommas(this.getDollarValue(this.inputValue, this.tokenPrices.nuMINT).toFixed(2)),
				},
				{
					title: "Fee",
					val: `${this.claimFee}%`,
					dollar: this.numberWithCommas(this.getDollarValue(this.feePrice, this.tokenPrices.nuMINT).toFixed(2))
				},
				{
					title: "Total",
					val: `$${this.numberWithCommas(this.totalReceived.toFixed(2))}`,
				}
			];
		}
	},
	mounted() {
		this.$store.watch((state) => {
			this.account = state.web3Store.account;
		});
	},
	methods: {
		isDisabled () {
			return this.inputValue <= 0 || !this.canWithdraw;
		},
		selectedTokenChanged(token) {
			this.selectedToken = token;
		},
		submitTransaction() {
			if (this.account !== "") {
				this.activeStep = "loading";
				const _this = this;
				if (this.inputValue < this.maximum) {
					this.$store.dispatch("boardroomStore/withdraw", {
						amount: this.inputValue,
						onConfirm: (txHash) => this.successToast(() => {this.activeStep = 1;}, `You have withdrawn ${this.inputValue} nuMINT`, txHash),
						onReject: (e) => this.failureToast(() => {this.activeStep = 1;}, e)
					}).then(()=>{
						_this.$store.dispatch("boardroomStore/updateStatus");
					}).catch(()=>{});
				} else {
					this.$store.dispatch("boardroomStore/claimRewardsAndWithdraw", {
						amount: this.inputValue,
						onConfirm: (txHash) => this.successToast(() => {this.activeStep = 1;}, `You have claimed ${this.inputValue} nuMINT`, txHash),
						onReject: (e) => this.failureToast(() => {this.activeStep = 1;}, e)
					}).then(()=>{
						_this.$store.dispatch("boardroomStore/updateStatus");
					}).catch(()=>{});
				}
			}
		},
		inputMaxBalance() {
			this.inputValue = this.maximum;
		},
	}
};
</script>
