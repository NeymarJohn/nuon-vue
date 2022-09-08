<template>
	<div class="input-manage-container">
		<div class="swap__container u-mb-24">
			<div class="swap__balance">
				<label>{{action}}</label>
			</div>
			<MintAccordion
				:disabled-tokens="[selectedCollateral, 'BTC', 'BUSD', 'AVAX']"
				:default-token="selectedCollateral"
				@selected-token="selectCollateral">
				<InputMax v-model="inputModel" :maximum="availableAmount()" @click="inputMaxBalance" />
				<LayoutFlex direction="row-justify-end">
					<p class="u-mb-0 u-font-size-14">~ $0.00</p>
				</LayoutFlex>
			</MintAccordion>
		</div>
		<LayoutFlex direction="row-justify-end">
			<TheButton
				:title="`Click to ${action}`"
				:disabled="submitDisabled"
				@click="submit">{{action}}</TheButton>
		</LayoutFlex>
	</div>
</template>
<script>
import { fromWei, toWei } from "~/utils/bnTools";

export default {
	name: "InputManageCollateral",
	props: {
		currentlySelectedCollateral: {
			type: String,
			required: true
		},
		userMintedAmount: {
			type: Number,
			required: false,
			default: 0
		},
		minimumDepositAmount: {
			type: Number,
			required: true,
			default: 0
		},
		action: {
			type: String,
			required: true
		},
		currrentTab: {
			type: String,
			required: true
		},
	},
	data() {
		return {
			activeStep: 1,
			depositInput: "",
			inputModel: "",
			isApproving: false,
			error: "",
			submitDisabled: true,
			estimatedAmount: {0: 0, 1: 0, 2: 0, 3: 0},
			shareAmount: "",
			selectedCollateral: "WETH"
		};
	},
	computed: {
		nuonAllowance() {
			return !!parseFloat(this.$store.state.collateralVaultStore.allowance.NUON);
		},
		summary() {
			const summary = [{title: "New Collateral Ratio", val: `${parseFloat(this.estimatedAmount[0]).toFixed(0)}%`}];
			if (this.action === "Deposit") {
				summary.push({title: "New Collateral Amount", val: this.estimatedAmount[2]});
			} else if (this.action === "Burn") {
				summary.push({title: "New NUON Amount", val: this.estimatedAmount[2]});
			} else if (this.action === "Mint") {
				summary.push({title: "NUON Minted Amount", val: this.estimatedAmount[1]});
				summary.push({title: `Extra ${this.currentlySelectedCollateral} Required`, val: this.estimatedAmount[3]});
				summary.push({title: "New NUON Balance", val: this.estimatedAmount[2]});
			} else {
				summary.push({title: "New Collateral Amount", val: this.estimatedAmount[2]});
			}
			const lastIdx = summary.length - 1;
			summary[lastIdx].val = `${parseFloat(summary[lastIdx].val).toFixed(2)} ${this.actionIsMintOrBurn ? "NUON" : this.currentlySelectedCollateral}`;
			return summary;
		},
		decimals() {
			return this.$store.state.erc20Store.decimals[this.currentlySelectedCollateral];
		},
		actionIsMintOrBurn() {
			return ["Mint", "Burn"].includes(this.action);
		},
		tokenBalance() {
			return this.$store.state.erc20Store.balance[this.currentlySelectedCollateral];
		},
		isMoreThanBalance() {
			return parseFloat(this.inputModel) > this.tokenBalance;
		},
		nuonBalance() {
			return this.$store.state.erc20Store.balance.NUON;
		}
	},
	methods: {
		isSubmitDisabled() {
			if (!parseFloat(this.inputModel)) {
				this.submitDisabled = true;
				return;
			}

			if (!this.connectedAccount) {
				this.submitDisabled = true;
				return;
			}

			if (this.action === "Burn") {
				if (parseFloat(this.inputModel) > this.userMintedAmount) {
					this.submitDisabled = true;
					this.error = "You cannot burn more NUON than you have.";
					return;
				}
			} else if (this.action === "Deposit") {
				if (parseFloat(this.inputModel) <= this.minimumDepositAmount) {
					this.submitDisabled = true;
					this.error = `Please deposit more than ${this.minimumDepositAmount}`;
					return;
				}
			} else if (this.action === "Add Liquidity") {
				if (this.isMoreThanBalance) {
					this.submitDisabled = true;
					this.error = `You don't have enough ${this.currentlySelectedCollateral}`;
					return;
				}
			}

			this.submitDisabled = false;
		},
		async getEstimatedAmounts() {
			let method;
			if (this.action === "Deposit") {
				method = "depositWithoutMintEstimation";
			} else if (this.action === "Burn") {
				method = "burnNUONEstimation";
			} else if (this.action === "Mint") {
				method = "mintWithoutDepositEstimation";
			} else {
				method = "redeemWithoutNuonEstimation";
			}

			const amount = toWei(this.inputModel, this.actionIsMintOrBurn ? 18 : this.decimals);

			let resp = {0: 0, 1: 0, 2: 0};
			let resp2 = {1: 0};
			try {
				resp = await this.$store.getters[`collateralVaultStore/${method}`](amount, this.connectedAccount);
				if (this.action === "Mint") {
					resp2 = await this.$store.getters["collateralVaultStore/mintLiquidityHelper"](resp[1]);
				}
			} catch (e) {
				const mintLiquidationMsg = "This will liquidate you";
				if (e.message.includes(mintLiquidationMsg)) {
					this.submitDisabled = true;
					this.error = mintLiquidationMsg;
				}
			} finally {
				this.$set(this.estimatedAmount, 0, fromWei(resp[0]));
				this.$set(this.estimatedAmount, 1, fromWei(resp[1], this.actionIsMintOrBurn ? 18 : this.decimals));
				this.$set(this.estimatedAmount, 2, fromWei(resp[2]));
				if (this.action === "Mint") {
					this.$set(this.estimatedAmount, 3, parseFloat(fromWei(resp2[0], this.decimals)).toFixed(2));
				}
			}
		},
		inputChanged() {
			this.error = "";
			this.submitDisabled = false;
			this.isSubmitDisabled();
			if (!this.action.includes("Liquidity")) this.getEstimatedAmounts();
		},
		inputMaxBalance() {
			
		},
		async submit() {
			try {
				this.error = "";
				this.activeStep = "loading";
				let methodName = "addLiquidityForUser";
				if (this.action === "Deposit") {
					methodName = "depositWithoutMint";
				} else if (this.action === "Withdraw") {
					methodName = "redeemWithoutNuon";
				} else if (this.action === "Remove Liquidity") {
					methodName = "removeLiquidityForUser";
				} 

				const amount = toWei(this.inputModel, this.actionIsMintOrBurn ? 18 : this.decimals);

				const resp = await this.$store.getters[`collateralVaultStore/${methodName}`](amount, this.connectedAccount);
				this.$store.dispatch("collateralVaultStore/updateStatus");
				this.successToast(null, "Transaction Succeeded", resp.transactionHash);
			} catch (e) {
				this.failureToast(null, e, "Transaction Failed");
			} finally {
				this.activeStep = 2;
			}
		},
		availableAmount() {
			if (this.actionIsMintOrBurn) {
				return this.nuonBalance;
			}
			if (this.action === "Deposit") {
				return this.tokenBalance || 0;
			} else if (this.action === "Withdraw") {
				return this.$store.state.collateralVaultStore.lockedAmount[this.currentlySelectedCollateral];
			}
		},
		selectCollateral(token) {
			this.selectedCollateral = token.symbol;
		},
	}
};
</script>
