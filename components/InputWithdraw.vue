<template>
	<div>
		<div class="transaction-input">
			<LayoutFlex
				direction="row-center-space-between"
				class="l-m-flex--column">
				<h4>Enter amount to withdraw</h4>
				<p class="u-mb-0">Available nuMINT tokens: {{ numberWithCommas(maximum.toFixed(2)) }}</p>
			</LayoutFlex>
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
			<div class="transaction-input__price">
				<p>You are withdrawing <span>{{ numberWithCommas(parseFloat(inputValue || 0).toFixed(2)) }} nuMINT</span> worth <span>${{ numberWithCommas(getDollarValue(inputValue, tokenPrices.nuMINT).toFixed(2)) }}</span></p>
				<p v-if="errorMessage" class="u-is-warning">{{errorMessage}}</p>
				<p v-if="!isDisabled()" class="u-is-success">Ready to withdraw</p>
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
		</div>
		<TransactionSummary
			v-if="inputValue === maximum"
			:values="maximumSummary" />
		<TransactionSummary
			v-else
			:values="partialSummary" />
		<div v-if="inputValue > 0 && inputValue < maximum" class="modal__info--lower">
			<h4>Days before unstake: {{ epoch }} Days</h4>
			<p>Withdrawing the staked token partially will reset the unstaked window to another 14 days.</p>
		</div>
		<div class="transaction-input__buttons">
			<TheButton
				size="lg"
				:disabled="isDisabled()"
				title="Click to withdraw"
				@click="submitTransaction">Confirm</TheButton>
		</div>
	</div>
</template>

<script>
import { fromWei } from "~/utils/bnTools";

export default {
	name: "InputWithdraw",
	props: {
		maximum: {
			type: Number,
			default: 0
		},
		action: {
			type: String,
			required: true
		}
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
			errorMessage: ""
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
					title: "Amount to Withdraw",
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
					title: "Total Received",
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
				if (this.action === "stake") {
					this.$store.dispatch("boardroomStore/stake", {
						amount: this.inputValue,
						onConfirm: (txHash) => this.successToast(() => {this.activeStep = 1;}, `You have staked ${this.inputValue} nuMINT`, txHash),
						onReject: (e) => this.failureToast(() => {this.activeStep = 1;}, e)
					}).then(() => {
						_this.$store.dispatch("boardroomStore/updateStatus");
					});
				} else if (this.action === "withdraw") {
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
				} else if (this.action === "claim") {
					this.$store.dispatch("boardroomStore/claimReward", {
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
