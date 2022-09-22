<template>
	<div class="input-govern">
		<div class="input-govern__wrapper">
			<div class="input-govern__title">
				<label class="u-text-capitalize">{{action}}</label>
				<label>Balance: {{ numberWithCommas(maximum.toFixed(2)) }}</label>
			</div>
			<div class="input-wrapper">
				<div class="input-token">
					<BusdLogo v-if="action==='claim'" />
					<NuMintLogo v-else/>
					<h5 v-if="action==='claim'">BUSD</h5>
					<h5 v-else>nuMINT</h5>
				</div>
				<InputMax v-model="inputValue" :maximum="maximum" @click="inputMaxBalance" />
			</div>
		</div>
		<p v-if="isMoreThanBalance" class="u-is-warning">Insufficient balance.</p>
		<div v-if="action === 'withdraw' && inputValue === maximum" class="input-govern__message">
			<p>Inputting maximum unstake amount will enable claim rewards at the same time when exiting staking.</p>
		</div>
		<ClaimWithdraw v-if="action==='withdraw'"/>
		<TransactionSummary v-if="inputValue > 0" :values="summary" />
		<LayoutFlex direction="row-justify-end">
			<TheButton
				class="u-min-width-200"
				size="md"
				title="Click to stake"
				:disabled="isDisabled()"
				@click="submitTransaction"><span class="u-text-capitalize"> {{action}}</span></TheButton>
		</LayoutFlex>
	</div>
</template>

<script>
import { fromWei } from "~/utils/bnTools";
import BusdLogo from "@/assets/images/logo/logo-busd.svg";
import NuMintLogo from "@/assets/images/logo/logo-numint.svg";

export default {
	name: "InputStake",
	components: {
		NuMintLogo,
		BusdLogo
	},
	props: {
		maximum: {
			type: Number,
			default: 0
		},
		action: {
			type: String,
			default: "stake"
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
		claimFee() {
			return parseFloat(this.$store.state.boardroomStore.claimFee);
		},
		feePrice() {
			return this.myRewards * this.claimFee / 100;
		},
		totalReceived() {
			return (this.inputValue + this.myRewards - this.feePrice) * this.tokenPrices.nuMINT;
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
		},
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
				const handlerCompletion = () => {
					this.inputValue = "";
					this.$store.dispatch("boardroomStore/updateStatus");
				};
				if (this.action === "stake") {
					this.$store.dispatch("boardroomStore/stake", {
						amount: this.inputValue,
						onConfirm: (_confNumber, receipt, _latestBlockHash) => {
							this.successToast(() => `You have staked ${this.inputValue} nuMINT`, receipt.transactionHash);
							this.$emit("close-modal");
						},
						onError: (err) => this.failureToast(() => err),
						onComplete: () => {
							handlerCompletion();
						}
					});
				} else if (this.action === "withdraw") {
					this.$store.dispatch("boardroomStore/withdraw", {
						amount: this.inputValue,
						onConfirm: (_confNumber, receipt, _latestBlockHash) => {
							this.successToast(() => `You have withdraw ${this.inputValue} nuMINT`, receipt.transactionHash);
							this.$emit("close-modal");
						},
						onError: (err) => this.failureToast(() => err),
						onComplete: () => {
							handlerCompletion();
						}
					});
				} else if (this.action === "claim") {
					this.$store.dispatch("boardroomStore/claimReward", {
						onConfirm: (_confNumber, receipt, _latestBlockHash) => {
							this.successToast(() => "You have claimed your reward", receipt.transactionHash);
							this.$emit("close-modal");
						},
						onError: (err) => this.failureToast(() => err),
						onComplete: () => {
							handlerCompletion();
						}
					});
				}
			}
		},
		inputMaxBalance() {
			this.inputValue = this.maximum;
		},
	}
};
</script>
