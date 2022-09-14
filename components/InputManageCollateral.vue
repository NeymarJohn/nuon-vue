<template>
	<div class="input-manage-container">
		<div class="swap__container u-mb-24">
			<LayoutFlex direction="row-center-space-between swap__balance">
				<label>{{ action }}</label>
				<ComponentLoader component="label" :loaded="tokenBalances[selectedCollateral] !== '0'">
					<label v-if="action === 'Deposit'">Balance:
						<span>{{ tokenBalances[selectedCollateral] | formatLongNumber }}</span>
					</label>
					<label v-else-if="action === 'Withdraw'">Balance:
						<span>{{ lockedAmount | formatLongNumber }}</span>
					</label>
					<label v-else-if="action === 'Add'">Balance:
						<span>{{ lockedAmount | formatLongNumber }}</span>
					</label>
					<label v-else-if="action === 'Remove'">Balance:
						<span>{{ lockedAmount | formatLongNumber }}</span>
					</label>
				</ComponentLoader>
			</LayoutFlex>
			<MintAccordion
				:disabled-tokens="[selectedCollateral, 'BTC', 'BUSD', 'AVAX']"
				:default-token="selectedCollateral"
				@selected-token="selectCollateral">
				<template #input>
					<InputMax v-model="inputModel" :maximum="availableAmount()" @input="inputChanged"/>
				</template>
				<template #messages>
					<LayoutFlex direction="row-center-space-between">
						<div>
							<p v-if="isMoreThanEqualMinimumAndLessThanBalance" class="u-font-size-14 u-is-success u-mb-0">Ready To {{ action }}</p>
							<p v-if="isMoreThanBalance" class="u-font-size-14 u-is-warning u-mb-0">Insufficient Balance</p>
						</div>
						<p class="u-mb-0 u-font-size-14 u-color-light-grey">~ ${{ getDollarValue(inputModel, collateralPrice) | toFixed | numberWithCommas }}</p>
					</LayoutFlex>
				</template>
			</MintAccordion>
		</div>
		<TransactionSummary v-if="inputModel > 0 && !isMoreThanBalance" class="u-mt-24" :values="summary" />
		<LayoutFlex direction="row-justify-end">
			<TheButton
				class="u-min-width-200"
				:title="`Click to ${action}`"
				:disabled="isSubmitDisabled"
				@click="submit">{{action}}</TheButton>
		</LayoutFlex>
	</div>
</template>
<script>
import { fromWei, toWei } from "~/utils/bnTools";

export default {
	name: "InputManageCollateral",
	props: {
		minimumDepositAmount: {
			type: Number,
			required: true,
			default: 0
		},
		action: {
			type: String,
			required: true
		},
	},
	data() {
		return {
			depositInput: "",
			inputModel: "",
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
			const summary = [{title: "New Collateral Ratio", val: this.estimatedAmount[0], currency: "%"}];
			if (this.action === "Deposit") {
				 // this.estimatedAmount = user cratio after deposit, collateral user will receive after deposit, user collateral amount after deposit
				summary.push({title: "New Collateral Amount", val: this.estimatedAmount[2] / this.tokenPrices[this.selectedCollateral], currency: this.selectedCollateral});
			} else {
				// this.estimatedAmount = user cratio after redeem, amount redeemed , collaterals left after redeem
				summary.push({title: "New Collateral Amount", val: this.estimatedAmount[2],currency: this.selectedCollateral});
			}
			const lastIdx = summary.length - 1;
			summary[lastIdx].val = `${parseFloat(summary[lastIdx].val).toFixed(2)} ${this.actionIsMintOrBurn ? "NUON" : this.currentlySelectedCollateral}`;
			return summary;
		},
		decimals() {
			return this.$store.state.erc20Store.decimals[this.selectedCollateral];
		},
		actionIsMintOrBurn() {
			return ["Mint", "Burn"].includes(this.action);
		},
		tokenBalance() {
			return this.tokenBalances[this.selectedCollateral];
		},
		isMoreThanBalance() {
			return parseFloat(this.inputModel) > this.tokenBalance;
		},
		isMoreThanEqualMinimumAndLessThanBalance() {
			return parseFloat(this.inputModel) > 0 && parseFloat(this.inputModel) <= this.tokenBalance;
		},
		collateralPrice() {
			return this.tokenPrices[this.selectedCollateral];
		},
		lockedAmount() {
			return this.$store.state.collateralVaultStore.lockedAmount[this.selectedCollateral];
		},
		isSubmitDisabled() {
			if (!parseFloat(this.inputModel || !this.connectedAccount)) {
				return true;
			}
			if (this.isMoreThanBalance) {
				return true;
			}
			return false;
		},
	},
	methods: {
		async getEstimatedAmounts() {
			let method;
			if (this.action === "Deposit") {
				method = "depositWithoutMintEstimation";
			} else {
				method = "redeemWithoutNuonEstimation";
			}

			const amount = toWei(this.inputModel, this.decimals);
			let resp = {0: 0, 1: 0, 2: 0};
			try {
				resp = await this.$store.getters[`collateralVaultStore/${method}`](this.selectedCollateral, amount, this.connectedAccount);
			} catch (e) {
				const mintLiquidationMsg = "This will liquidate you";
				if (e.message.includes(mintLiquidationMsg)) {
					this.submitDisabled = true;
					this.error = mintLiquidationMsg;
				}
			} finally {
				this.$set(this.estimatedAmount, 0, fromWei(resp[0]));
				this.$set(this.estimatedAmount, 1, fromWei(resp[1], this.decimals));
				this.$set(this.estimatedAmount, 2, fromWei(resp[2]));
			}
		},
		inputChanged() {
			this.error = "";
			this.submitDisabled = false;
			if (!this.action.includes("Liquidity")) this.getEstimatedAmounts();
		},
		submit() {
			try {
				this.error = "";
				let methodName = "addLiquidityForUser";
				if (this.action === "Deposit") {
					methodName = "depositWithoutMint";
				} else if (this.action === "Withdraw") {
					methodName = "redeemWithoutNuon";
				} else if (this.action === "Remove Liquidity") {
					methodName = "removeLiquidityForUser";
				}

				const amount = toWei(this.inputModel, this.actionIsMintOrBurn ? 18 : this.decimals);

				this.$store.dispatch("collateralVaultStore/callManageMethods", {
					collateral: this.selectedCollateral,
					method: methodName,
					amount,
					onConfirm: (_confNumber, receipt, _latestBlockHash) => {
						this.successToast(null, "Transaction Succeeded", receipt.transactionHash);
						this.$store.dispatch("collateralVaultStore/updateStatus");
						this.$store.dispatch("erc20Store/initializeBalance", {address: this.connectedAccount});
					},
					onReject: (err) => {
						this.failureToast(null, err, "Transaction failed");
					}
				});
			} catch (e) {
				this.failureToast(null, e, "Transaction Failed");
			}
		},
		availableAmount() {
			if (this.action === "Deposit") {
				return this.tokenBalance || 0;
			} else if (this.action === "Withdraw") {
				return this.$store.state.collateralVaultStore.lockedAmount[this.selectedCollateral];
			}
		},
		selectCollateral(token) {
			this.selectedCollateral = token.symbol;
			this.getEstimatedAmounts();
		},
	}
};
</script>
