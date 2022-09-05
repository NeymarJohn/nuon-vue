<template>
	<div class="input-manage-container">
		<div class="input-manage-reverse">
			<div class="input-manage__wrapper">
				<LayoutFlex v-if="!actionIsMintOrBurn && action !== 'Remove Liquidity'" direction="row-space-between" class="u-full-width">
					<p>Amount of {{ actionIsMintOrBurn ? 'NUON' : currentlySelectedCollateral }}</p>
					<p>Available balance: {{ availableAmount() | formatLongNumber }}</p>
				</LayoutFlex>
				<p v-if="action === 'Remove Liquidity'" class="u-text-right">LP: {{ shareAmount }}</p>
				<InputMax v-model="inputModel" :maximum="availableAmount()" @click="inputMaxBalance" />
				<p v-if="error" class="u-is-warning u-mt-12 u-text-right">{{ error }}</p>
			</div>
			<div class="input-manage__wrapper">
				<SwapAccordion
					:default-token="`WETH`"
					@selected-token="selectOutputToken">
					<LayoutFlex direction="row-justify-end">
						<h2 class="u-mb-0 u-font-size-26"> 3.47 WETH</h2>
					</LayoutFlex>
				</SwapAccordion>
			</div>
		</div>
		<div class="toggle__transaction u-mt-24">
			<TheButton
				class="u-full-width"
				title="Click to submit"
				:disabled="submitDisabled"
				@click="submit">Submit</TheButton>
		</div>
	</div>
</template>
<script>
import { fromWei, toWei } from "~/utils/bnTools";

export default {
	name: "InputManage",
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
			estimatedAmount: {0: 0, 1: 0, 2: 0, 3: 0},
			shareAmount: ""
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
			} else if (this.action === "Add Liquidity") {
				return `Add ${this.currentlySelectedCollateral} to your current liquidity position`;
			} else if (this.action === "Remove Liquidity") {
				return `Remove ${this.currentlySelectedCollateral} from your current liquidity position`;
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
				// this.estimatedAmount = user cratio after mint, amount of nuon minted, user total nuon after mint
				summary.push({title: "NUON Minted Amount", val: this.estimatedAmount[1]});
				summary.push({title: `Extra ${this.currentlySelectedCollateral} Required`, val: this.estimatedAmount[3]});
				summary.push({title: "New NUON Balance", val: this.estimatedAmount[2]});
			} else {
				// this.estimatedAmount = user cratio after redeem, amount redeemed , collaterals left after redeem
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
		async actionClicked(arg) {
			this.error = "";
			this.inputModel = "";
			this.action = arg;
			this.activeStep = 2;
			this.isSubmitDisabled();
			const postfix = this.actionIsMintOrBurn ? "NUON" : "Collateral";
			let titleStr = `${arg} ${postfix}`;
			if (this.action.includes("Liquidity")) titleStr = this.action;
			this.$emit("action-changed", {title: titleStr, subtitle: this.explaination});

			if (this.action === "Remove Liquidity") {
				const decimals = this.currentlySelectedCollateral === "WETH" ? 5 : 18;
				this.shareAmount = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/viewUserVaultSharesAmount"](this.connectedAccount))).toFixed(decimals);
			}
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
		backClicked() {
			this.activeStep = 1;
			this.action = "";
			this.estimatedAmount =  {0: 0, 1: 0, 2: 0, 3: 0};
			this.$emit("action-changed", {title: "", subtitle: ""});
		},
		async submit() {
			try {
				this.error = "";
				this.activeStep = "loading";
				let methodName = "addLiquidityForUser";
				if (this.action === "Deposit") {
					methodName = "depositWithoutMint";
				} else if (this.action === "Burn") {
					methodName = "burnNUON";
				} else if (this.action === "Mint") {
					methodName = "mintWithoutDeposit";
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
		}

	}
};
</script>
