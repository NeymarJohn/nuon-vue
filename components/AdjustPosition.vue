<template>
	<TheStepper :active-step="activeStep" :steps="['Select', action || 'Confirm']" stepper>
		<template #step-one>
			<div>
				<p>Increase Collateral Ratio</p>
				<LayoutFlex direction="row-space-around">
					<TheButton
						size="sm"
						title="Click to desposit collateral"
						@click="actionClicked('Deposit')">Deposit Collateral</TheButton>
					<TheButton
						size="sm"
						title="Click to burn NUON"
						@click="actionClicked('Burn')">Burn Nuon</TheButton>
				</LayoutFlex>
			</div>
			<div class="u-mt-32">
				<p>Decrease Collateral Ratio</p>
				<LayoutFlex direction="row-space-around">
					<TheButton
						size="sm"
						title="Click to withdraw collaterals"
						@click="actionClicked('Withdraw')">Withdraw Collateral</TheButton>
					<TheButton
						size="sm"
						title="Click to mint NUON"
						@click="actionClicked('Mint')">Mint Nuon</TheButton>
				</LayoutFlex>
			</div>
		</template>
		<template #step-two>
			<p>{{ explaination }}</p>
			<input v-model="inputModel" class="adjust-position-input" type="number">
			<div class="toggle__transaction u-mt-24">
				<TheButton
					title="Click to go back"
					class="btn--back"
					@click="activeStep = 1; action = ''">Back</TheButton>
				<TheButton
					v-if="action === 'Burn' && !nuonAllowance"
					:disabled="isApproving"
					title="Click to approve"
					size="approved"
					class="u-min-width-185"
					@click="approveNUON">
					<span v-if="isApproving">Approving...</span>
					<span v-else>Approve</span>
				</TheButton>
				<TheButton
					v-else
					class="u-full-width"
					title="Click to submit"
					:disabled="!inputModel"
					@click="submit">Submit</TheButton>
			</div>
		</template>
	</TheStepper>
</template>

<script>
import { toWei } from "~/utils/bnTools";

export default {
	props: {
		currentlySelectedCollateral: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			activeStep: 1,
			action: "",
			depositInput: "",
			inputModel: "",
			isApproving: false
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
		}
	},
	methods: {
		actionClicked(arg) {
			this.action = arg;
			this.activeStep = 2;
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

				const amount = toWei(this.inputModel, this.action === "Burn" ? 18 : this.$store.state.erc20Store.decimals[this.currentlySelectedCollateral]);

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
