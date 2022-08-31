<template>
	<div class="input-stake">
		<div class="input-stake__title">
			<label>Stake</label>
			<label>Balance: {{ numberWithCommas(maximum.toFixed(2)) }}</label>
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
		<TransactionSummary v-if="inputValue > 0" :values="summary" />
		<TheButton
			size="md"
			:disabled="isDisabled()"
			title="Click to stake"
			@click="submitTransaction">Stake</TheButton>
	</div>
</template>

<script>
import { fromWei } from "~/utils/bnTools";

export default {
	name: "InputStake",
	props: {
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
					title: "Amount",
					val: this.numberWithCommas(this.inputValue),
					currency: "nuMINT",
				},
				{
					title: "Fee",
					val: `-${this.numberWithCommas(this.feeToken.toFixed(2))}nuMINT (${this.claimFee} %)`,
				},
				{
					title: "Total",
					val: this.numberWithCommas((parseFloat(this.inputValue) - this.feeToken).toFixed(2)) ,
					currency: "nuMINT",
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
			}
		},
		inputMaxBalance() {
			this.inputValue = this.nuMintBalance;
		},
	}
};
</script>
