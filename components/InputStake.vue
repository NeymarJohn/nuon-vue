<template>
	<div class="input-govern">
		<div class="input-govern__wrapper">
			<div class="input-govern__title">
				<label>Stake</label>
				<label>nuMINT Balance: {{ numberWithCommas(maximum.toFixed(2)) }}</label>
			</div>
			<div class="input-wrapper">
				<div class="input-token">
					<NuMintLogo />
					<h5>nuMINT</h5>
				</div>
				<InputMax v-model="inputValue" :click="inputMaxBalance" :maximum="maximum" />
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
import NuMintLogo from "@/assets/images/logo/logo-numint.svg";

export default {
	name: "InputStake",
	components: {
		NuMintLogo,
	},
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
						this.successToast(() => `You have staked ${this.inputValue} nuMINT`, receipt.transactionHash);
						this.$emit("close-modal");
					},
					onError: (err) => this.failureToast(() => err),
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
