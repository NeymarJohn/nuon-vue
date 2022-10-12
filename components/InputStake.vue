<template>
	<div class="input-govern">
		<div class="input-govern__wrapper">
			<div class="input-govern__title">
				<label class="u-text-capitalize">{{action}}</label>
				<label>Balance: {{ numberWithCommas(maximum.toFixed(2)) }}</label>
			</div>
			<div class="input-wrapper u-mb-16">
				<div class="input-token">
					<BusdLogo v-if="action==='claim'" />
					<NuMintLogo v-else/>
					<h5 v-if="action==='claim'">BUSD</h5>
					<h5 v-else>nuMINT</h5>
				</div>
				<InputMax v-model="inputValue" :maximum="maximum" @input="changeInputValue"/>
			</div>
			<LayoutFlex direction="row-center-space-between">
				<div>
					<p v-if="!isMoreThanBalance && inputValue > 0 && action !== 'withdraw'" class="u-font-size-14 u-is-success u-mb-0">
						<span class="u-text-capitalize">Ready To {{action}}</span>
					</p>
					<p v-if="isMoreThanBalance && action !== 'withdraw'" class="u-font-size-14 u-is-warning u-mb-0">Insufficient Balance</p>
					<p v-if="action === 'withdraw' && !canWithdraw" class="u-font-size-14 u-is-warning u-mb-0">You are not allowed to withdraw at the moment.</p>
				</div>
				<p class="u-mb-0 u-font-size-14 u-color-light-grey">~ ${{ getDollarValue(inputValue, tokenPrices.nuMINT) | toFixed | numberWithCommas }}</p>
			</LayoutFlex>
		</div>
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
				:loading="staking"
				@click="approveAndSubmit">
				<span class="u-text-capitalize">{{action}}</span>
			</TheButton>
		</LayoutFlex>
	</div>
</template>

<script>
import { fromWei } from "~/utils/bnTools";
import BusdLogo from "@/assets/images/logo/logo-busd.svg";
import NuMintLogo from "@/assets/images/logo/logo-numint.svg";
import { nuMINT } from "~/constants/tokens";

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
			staking: false,
			price: {
				nuMINT: 0
			},
			account: "",
		};
	},
	computed: {
		isMoreThanBalance() {
			if (this.action === "withdraw") {
				return parseFloat(this.inputValue) > this.myStake; 
			}
			return parseFloat(this.inputValue) > this.nuMintBalance;
		},
		canWithdraw() {
			return this.$store.state.boardroomStore.canWithdraw;
		},
		canClaim() {
			return this.$store.state.boardroomStore.canClaimRewards;
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
		isApproved(tokenName) {
			if (!tokenName) return true;
			const allowance = this.$store.state.boardroomStore.allowance;
			return allowance[tokenName] > 0;
		},
		isDisabled () {
			if (this.action === "withdraw" && !this.canWithdraw) return true;
			if (this.action === "claim" && !this.canClaim) return true; 
			if (this.inputValue <= 0 || this.isMoreThanBalance) return true;
		},
		approveAndSubmit() {
			if (!this.isApproved(nuMINT.symbol)) {
				this.$store.dispatch("boardroomStore/approveToken",
					{
						tokenName: nuMINT.symbol,
						onConfirm: () =>{
						},
						onReject: () => {
						},
						onCallback: () => {
							this.submitTransaction();
						}
					});
			} else {
				this.submitTransaction();
			}
		},
		submitTransaction() {
			if (this.account !== "") {
				this.staking = true;
				const handlerCompletion = () => {
					this.inputValue = "";
					this.changeInputValue();
					this.staking = false;
					this.$store.dispatch("boardroomStore/updateStatus");
				};
				const handleError = (err) => {
					this.staking = false;
					this.failureToast(null, err);
				};
				if (this.action === "stake") {
					this.$store.dispatch("boardroomStore/stake", {
						amount: this.inputValue,
						onConfirm: (_confNumber, receipt, _latestBlockHash) => {
							this.successToast(null, `You have staked ${this.inputValue} nuMINT`, receipt.transactionHash);
							this.$emit("close-modal");
						},
						onError: (err) => {
							handleError(err);
						},
						onComplete: () => {
							handlerCompletion();
						}
					});
				} else if (this.action === "withdraw") {
					this.$store.dispatch("boardroomStore/withdraw", {
						amount: this.inputValue,
						onConfirm: (_confNumber, receipt, _latestBlockHash) => {
							this.successToast(null, `You have withdraw ${this.inputValue} nuMINT`, receipt.transactionHash);
							this.$emit("close-modal");
						},
						onError: (err) => {
							handleError(err);
						},
						onComplete: () => {
							handlerCompletion();
						}
					});
				} else if (this.action === "claim") {
					this.$store.dispatch("boardroomStore/claimReward", {
						onConfirm: (_confNumber, receipt, _latestBlockHash) => {
							this.successToast(null, "You have claimed your reward", receipt.transactionHash);
							this.$emit("close-modal");
						},
						onError: (err) => {
							handleError(err);
						},
						onComplete: () => {
							handlerCompletion();
						}
					});
				}
			}
		},
		changeInputValue() {
			this.$emit("change", {value:this.inputValue, action: this.action});
		}
	}
};
</script>
