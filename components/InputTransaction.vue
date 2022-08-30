<template>
	<div class="transaction-input">
		<div class="transaction-input__title">
			<label>{{ title }}</label>
			<label>{{ subtitle }}: {{ numberWithCommas(maximum.toFixed(2)) }}</label>
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
		<p v-if="isMoreThanBalance" class="u-is-warning">Insufficient balance.</p>
		<p v-if="errorMessage" class="u-is-warning">{{errorMessage}}</p>
		<p v-if="!isDisabled()" class="u-is-success u-mb-0">Ready to {{ action }}</p>
		<TransactionSummary :values="summary" />
		<div class="transaction-input__buttons">
			<TheButton
				size="md"
				:disabled="isDisabled()"
				title="Click to confirm"
				@click="submitTransaction">Confirm</TheButton>
		</div>
	</div>
</template>

<script>
import { nuMINT } from "~/constants/tokens";
import { fromWei } from "~/utils/bnTools";

export default {
	name: "InputTransaction",
	props: {
		title: {
			type: String,
			required: true
		},
		subtitle: {
			type: String,
			required: true
		},
		action: {
			type: String,
			required: true
		},
		maximum: {
			type: Number,
			default: 0
		}
	},
	data () {
		return {
			inputValue: null,
			price: {
				nuMINT: 0
			},
			account: "",
			estimatedOut: 0,
			activeStep: 1,
			errorMessage: ""
		};
	},
	computed: {
		claimFee() {
			return this.$store.state.boardroomStore.claimFee;
		},
		isMoreThanBalance() {
			return parseFloat(this.inputValue) > this.nuMintBalance;
		},
		nuMintBalance() {
			return this.$store.getters["erc20Store/nuMintBalance"] || 0;
		},
		myStake() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.stakedBalance));
		},
		feeToken() {
			return this.inputValue * this.claimFee / 100;
		},
		summary() {
			return [
				{
					title: "Amount to Stake",
					val: this.numberWithCommas(this.inputValue),
					currency: "nuMINT",
					dollar: this.getDollarValue(this.inputValue, this.tokenPrices.nuMINT),
				},
				{
					title: "Stake Fee",
					val: `-${this.numberWithCommas(this.feeToken.toFixed(2))}nuMINT (${this.claimFee} %)`,
					dollar: this.getDollarValue(this.feeToken, this.tokenPrices.nuMINT)
				},
				{
					title: "Total",
					val: this.numberWithCommas((parseFloat(this.inputValue) - this.feeToken).toFixed(2)) ,
					currency: "nuMINT",
					dollar: this.getDollarValue(parseFloat(this.inputValue) - this.feeToken, this.tokenPrices.nuMINT),
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
			if (this.inputValue <= 0 || this.isMoreThanBalance || !this.isApproved) return true;
		},
		submitTransaction() {
			if (this.account !== "") {
				this.activeStep = "loading";
				if (this.action === "stake") {
					this.$store.dispatch("boardroomStore/stake", {
						amount: this.inputValue,
						onConfirm: (_confNumber, receipt, _latestBlockHash) => {
							this.successToast(() => {this.activeStep = 1;}, `You have staked ${this.inputValue} nuMINT`, receipt.transactionHash);
							this.$emit("close-modal");
						},
						onError: (e) => this.failureToast(() => {this.activeStep = 1;}, e),
						onComplete: () => {
							this.inputValue = "";
							this.$store.dispatch("boardroomStore/updateStatus");
						}
					});
				} else if (this.action === "withdraw") {
					this.$store.dispatch("boardroomStore/withdraw", {
						amount: this.inputValue,
						onConfirm: (txHash) => this.successToast(() => {this.activeStep = 1;}, `You have withdrawn ${this.inputValue} nuMINT`, txHash),
						onError: (e) => this.failureToast(() => {this.activeStep = 1;}, e),
						onComplete: () => {
							this.inputValue = "";
							this.$store.dispatch("boardroomStore/updateStatus");
						}
					});
				} else if (this.action === "claim") {
					this.$store.dispatch("boardroomStore/claimReward", {
						onConfirm: (txHash) => this.successToast(() => {this.activeStep = 1;}, "You have claimed nuMINT", txHash),
						onError: (e) => this.failureToast(() => {this.activeStep = 1;}, e),
						onComplete: () => {
							this.$store.dispatch("boardroomStore/updateStatus");
						}
					});
				}
			}
		},
		inputMaxBalance() {
			this.inputValue = this.nuMintBalance;
		},
		approveToken() {
			this.activeStep = "approving";
			this.$store.dispatch("boardroomStore/approveToken",
				{
					tokenSymbol: nuMINT.symbol,
					onConfirm:  () => {
						this.activeStep = 1;
					},
					onReject: () => {
						this.activeStep = 1;
					},
					onCallback: () => {
					}
				});
		},

	}
};
</script>
