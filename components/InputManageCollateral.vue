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
				<InputMax v-model="inputModel" :maximum="availableAmount()"/>
				<LayoutFlex direction="row-justify-end">
					<p class="u-mb-0 u-font-size-14">~ ${{ getDollarValue(inputModel, collateralPrice) | toFixed | numberWithCommas }}</p>
				</LayoutFlex>
			</MintAccordion>
		</div>
		<LayoutFlex direction="row-justify-end">
			<TheButton
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
			const summary = [{title: "New Collateral Ratio", val: `${parseFloat(this.estimatedAmount[0]).toFixed(0)}%`}];
			if (this.action === "Deposit") {
				summary.push({title: "New Collateral Amount", val: this.estimatedAmount[2]});
			} else if (this.action === "Burn") {
				summary.push({title: "New NUON Amount", val: this.estimatedAmount[2]});
			} else if (this.action === "Mint") {
				summary.push({title: "NUON Minted Amount", val: this.estimatedAmount[1]});
				summary.push({title: `Extra ${this.selectedCollateral} Required`, val: this.estimatedAmount[3]});
				summary.push({title: "New NUON Balance", val: this.estimatedAmount[2]});
			} else {
				summary.push({title: "New Collateral Amount", val: this.estimatedAmount[2]});
			}
			const lastIdx = summary.length - 1;
			summary[lastIdx].val = `${parseFloat(summary[lastIdx].val).toFixed(2)} ${this.actionIsMintOrBurn ? "NUON" : this.selectedCollateral}`;
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
		collateralPrice() {
			return this.tokenPrices[this.selectedCollateral];
		},
		lockedAmount() {
			return this.$store.state.collateralVaultStore.lockedAmount[this.selectedCollateral];
		},
		isSubmitDisabled() {
			if (!parseFloat(this.inputModel)) {
				return true;
			}
			if (!this.connectedAccount) {
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
			if (!this.action.includes("Liquidity")) this.getEstimatedAmounts();
		},
		async submit() {
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

				const resp = await this.$store.getters[`collateralVaultStore/${methodName}`](amount, this.connectedAccount);
				this.$store.dispatch("collateralVaultStore/updateStatus");
				this.successToast(null, "Transaction Succeeded", resp.transactionHash);
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
		},
	}
};
</script>
