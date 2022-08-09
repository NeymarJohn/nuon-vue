<template>
	<TheStepper :active-step="activeStep" :steps="['Select', action || 'Confirm']" stepper>
		<template #step-one>
			<div>
				<p class="u-colour-light-grey">Increase Collateral Ratio</p>
				<LayoutFlex direction="row-space-between">
					<TheButton
						size="md u-min-width-230"
						title="Click to desposit collateral"
						@click="actionClicked('Deposit')">Deposit Collateral</TheButton>
					<TheButton
						size="md u-min-width-230"
						title="Click to burn NUON"
						@click="actionClicked('Burn')">Burn NUON</TheButton>
				</LayoutFlex>
			</div>
			<div class="u-mt-32">
				<p class="u-colour-light-grey">Decrease Collateral Ratio</p>
				<LayoutFlex direction="row-space-between">
					<TheButton
						size="md u-min-width-230"
						title="Click to withdraw collaterals"
						@click="actionClicked('Withdraw')">Withdraw Collateral</TheButton>
					<TheButton
						size="md u-min-width-230"
						title="Click to mint NUON"
						@click="actionClicked('Mint')">Mint NUON</TheButton>
				</LayoutFlex>
			</div>
		</template>
		<template #step-two>
			<p class="u-colour-light-grey">{{ explaination }}</p>
			<div class="input">
				<div class="input__container">
					<input
						v-model="inputModel"
						placeholder="0.0"
						type="number"
						min="0"
						max="79"
						autocomplete="off"
						autocorrect="off"
						spellcheck="false"
						inputmode="decimal"
						@input="inputChanged" />
				</div>
			</div>
			<p v-if="error" class="u-is-warning u-mt-12 u-text-right">{{ error }}</p>
			<TransactionSummary class="u-mt-16" :values="summary" />
			<div class="toggle__transaction u-mt-24">
				<TheButton
					title="Click to go back"
					class="btn--back"
					@click="activeStep = 1; action = ''">Back</TheButton>
				<TheButton
					v-if="action === 'Burn' && !nuonAllowance"
					:disabled="isApproving"
					title="Click to approve"
					class="u-full-width"
					size="approved"
					@click="approveNUON">
					<span v-if="isApproving">Approving...</span>
					<span v-else>Approve</span>
				</TheButton>
				<TheButton
					v-else
					class="u-full-width"
					title="Click to submit"
					:disabled="submitDisabled"
					@click="submit">Submit</TheButton>
			</div>
		</template>
	</TheStepper>
</template>

<script>
import { fromWei, toWei } from "~/utils/bnTools";

export default {
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
		}
	},
	data() {
		return {
			activeStep: 1,
			action: "",
			depositInput: "",
			inputModel: "",
			isApproving: false,
			error: "",
			submitDisabled: true,
			estimatedAmount: {0: 0, 1: 0, 2: 0}
		};
	},
	computed: {
		explaination() {
			if (this.action === "Deposit") {
				return `Deposit ${this.currentlySelectedCollateral} without minting NUON`;
			} else if (this.action === "Burn") {
				return `Redeem NUON without getting back ${this.currentlySelectedCollateral}`;
			} else if (this.action === "Mint") {
				return `Mint NUON without depositing more ${this.currentlySelectedCollateral}`;
			} else {
				return `Withdraw ${this.currentlySelectedCollateral} without redeeming NUON`;
			}
		},
		nuonAllowance() {
			return !!parseFloat(this.$store.state.collateralVaultStore.allowance.NUON);
		},
		summary() {
			const summary = [{title: "New Collateral Ratio", val: `${parseFloat(this.estimatedAmount[0]).toFixed(0)}%`}];
			if (this.action === "Deposit") {
				 // this.estimatedAmount = user cratio after deposit, collateral user will receive after deposit, user collateral amount after deposit
				summary.push({title: "New Collateral Amount", val: this.estimatedAmount[2]});
			} else if (this.action === "Burn") {
				// this.estimatedAmount = user cratio after burn, burned nuons, total amount of nuon left after burn
				summary.push({title: "New NUON Amount", val: this.estimatedAmount[2]});
			} else if (this.action === "Mint") {
				// this.estimatedAmount = user cratio after mint, amount of nuon minted , user total nuon after mint
				summary.push({title: "New NUON Amount", val: this.estimatedAmount[2]});
			} else {
				// this.estimatedAmount = user cratio after redeem, amount redeemed , collaterals left after redeem
				summary.push({title: "New Collateral Amount", val: this.estimatedAmount[2]});
			}
			summary[1].val = `${parseFloat(summary[1].val).toFixed(2)} ${this.currentlySelectedCollateral}`;
			return summary;
		}
	},
	methods: {
		isSubmitDisabled() {
			this.error = "";
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

			const amount = toWei(this.inputModel, this.action === "Burn" ? 18 : this.$store.state.erc20Store.decimals[this.currentlySelectedCollateral]);

			let resp = {0: 0, 1: 0, 2: 0};
			try {
				resp = await this.$store.getters[`collateralVaultStore/${method}`](amount, this.connectedAccount);
			} catch (e) {
			} finally {
				this.$set(this.estimatedAmount, 0, fromWei(resp[0]));
				this.$set(this.estimatedAmount, 1, fromWei(resp[1], this.$store.state.erc20Store.decimals[this.currentlySelectedCollateral]));
				this.$set(this.estimatedAmount, 2, fromWei(resp[2]));
			}
		},
		inputChanged() {
			this.isSubmitDisabled();
			this.getEstimatedAmounts();
		},
		actionClicked(arg) {
			this.error = "";
			this.inputModel = "";
			this.action = arg;
			this.activeStep = 2;
			this.isSubmitDisabled();
		},
		approveNUON() {
			this.isApproving = true;
			this.$store.dispatch("collateralVaultStore/approveToken",
				{
					tokenSymbol: "NUON",
					onConfirm: () => { },
					onReject: () => { },
					onCallback: () => {
						this.isApproving = false;
					}
				}
			);
		},
		async submit() {
			try {
				this.error = "";
				this.activeStep = "loading";
				let method;
				if (this.action === "Deposit") {
					method = "depositWithoutMint";
				} else if (this.action === "Burn") {
					method = "burnNUON";
				} else if (this.action === "Mint") {
					method = "mintWithoutDeposit";
				} else {
					method = "redeemWithoutNuon";
				}

				const amount = toWei(this.inputModel, ["Burn", "Mint"].includes(this.action) ? 18 : this.$store.state.erc20Store.decimals[this.currentlySelectedCollateral]);

				const resp = await this.$store.getters[`collateralVaultStore/${method}`](amount, this.connectedAccount);

				this.successToast(null, "Transaction Succeeded", resp.transactionHash);
			} catch (e) {
				this.failureToast(null, e, "Transaction Failed");
			} finally {
				this.activeStep = 2;
			}
		}
	}
};
</script>
