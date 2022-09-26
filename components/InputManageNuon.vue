<template>
	<div class="input-manage-container">
		<div class="swap__container u-mb-24">
			<div class="swap__balance">
				<label>Select Contract</label>
			</div>
			<MintAccordion
				:disabled-tokens="[selectedCollateral, 'BTC', 'BUSD', 'AVAX']"
				:default-token="defaultCollateral"
				@selected-token="selectCollateral" />
		</div>
		<div class="swap__container u-mb-24">
			<LayoutFlex direction="row-center-space-between swap__balance">
				<label>{{ action }}</label>
			</LayoutFlex>
			<div class="accordion">
				<LayoutFlex direction="row-start-space-between">
					<LayoutFlex direction="row-center accordion__header accordion__header--unclickable">
						<NuonLogo />
						<div class="accordion__token">
							<h5>NUON</h5>
						</div>
					</LayoutFlex>
					<DataCard align="end">
						<InputMax v-model="inputModel" :maximum="availableAmount" hidden-max-button @input="debouncedInputChange" />
					</DataCard>
				</LayoutFlex>
				<LayoutFlex direction="row-center-space-between">
					<div>
						<p v-if="!isMoreThanBalance && isMoreThanZeroLessThanBalance" class="u-font-size-14 u-is-success u-mb-0">Ready To {{action}}</p>
						<p v-if="isMoreThanBalance" class="u-font-size-14 u-is-warning u-mb-0">Insufficient Balance</p>
					</div>
					<p class="u-mb-0 u-font-size-14 u-color-light-grey">~ ${{ getDollarValue(inputModel, collateralPrice) | toFixed | numberWithCommas }}</p>
				</LayoutFlex>
			</div>
		</div>
		<TransactionSummary v-if="inputModel > 0 && !isMoreThanBalance" class="u-mt-24" :values="summary" />
		<LayoutFlex direction="row-justify-end">
			<TheButton
				class="u-min-width-200"
				:title="`Click to ${action}`"
				:disabled="isSubmitDisabled"
				:loading="isLoading"
				@click="approveAndSubmit">{{action}}</TheButton>
		</LayoutFlex>
	</div>
</template>
<script>
import debounce from "lodash.debounce";
import { toWei } from "~/utils/bnTools";
import NuonLogo from "@/assets/images/logo/logo-numint.svg";

export default {
	name: "InputManageNuon",
	components: {
		NuonLogo
	},
	props: {
		action: {
			type: String,
			required: true
		},
		defaultCollateral: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			depositInput: "",
			inputModel: "",
			error: "",
			submitDisabled: true,
			estimatedAmount: {0: 0, 1: 0, 2: 0, 3: 0},
			selectedCollateral: "WETH",
			isLoading: false
		};
	},
	computed: {
		estimation() {
			return this.$store.state.collateralVaultStore.estimation;
		},
		summary() {
			const summary = [
				{
					title: "New Collateral Ratio",
					val: this.estimation.collateralRatio,
					currency: "%"
				},
				{
					title: "New Liquidation Price",
					val: this.estimation.liquidationPrice
				},
				{
					title: "New Liquidity Position",
					val: "-"
				}
			];
			if (this.action === "Deposit") {
				summary.push({
					title: "New Collateral Amount",
					val: this.estimation.lockedCollateral,
					currency: this.selectedCollateral
				});
			} else if (this.action === "Withdraw") {
				summary.push({
					title: "New Collateral Amount",
					val: this.estimation.lockedCollateral,
					currency: this.selectedCollateral
				});
			} else if (this.action === "Mint") {
				summary.push({
					title: "NUON Minted Amount",
					val: this.inputModel
				});
				summary.push({
					title: `Extra ${this.selectedCollateral} required`,
					val: this.estimation.extraRequiredCollateral
				});
				summary.push({
					title: "New NUON Balance",
					val: this.estimation.mintedNuon
				});
			} else if (this.action === "Burn") {
				summary.push({
					title: "NUON Minted Amount",
					val: this.inputModel
				});
				summary.push({
					title: "New NUON Balance",
					val: this.estimation.mintedNuon
				});
			}
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
			return parseFloat(this.inputModel) > this.availableAmount;
		},
		isMoreThanZeroLessThanBalance() {
			return parseFloat(this.inputModel) <= this.availableAmount && parseFloat(this.inputModel) > 0;
		},
		collateralPrice() {
			return this.tokenPrices[this.selectedCollateral];
		},
		lockedAmount() {
			return this.$store.state.collateralVaultStore.lockedAmount[this.selectedCollateral];
		},
		isSubmitDisabled() {
			if (!parseFloat(this.inputModel || !this.connectedAccount)) return true;
			if (this.isMoreThanBalance) return true;
			return false;
		},
		nuonAmount() {
			return this.$store.state.collateralVaultStore.mintedAmount[this.selectedCollateral];
		},
		sharesAmount() {
			return this.$store.state.collateralVaultStore.userVaultShares[this.selectedCollateral];
		},
		availableAmount() {
			if (this.actionIsMintOrBurn) return this.nuonAmount;
			if (this.action === "Deposit") return this.tokenBalance || 0;
			if (this.action === "Withdraw") return this.lockedAmount || 0;
			if (this.action === "Add") return this.tokenBalance;
			if (this.action === "Remove") return this.sharesAmount;
			return (this.inputModel * this.tokenPrices.NUON / this.tokenPrices[this.selectedCollateral]).toFixed(2);
		},
	},
	beforeMount () {
		this.selectedCollateral = this.defaultCollateral;
		this.$store.commit("collateralVaultStore/setEstimation", {});
	},
	methods: {
		getEstimatedAmounts() {
			// let method;
			// if (this.action === "Burn") method = "burnNUONEstimation";
			// if (this.action === "Mint") method = "mintWithoutDepositEstimation";
			// if (this.action === "Deposit") method = "depositWithoutMintEstimation";
			// if (this.action === "Withdraw") method = "redeemWithoutNuonEstimation";

			// const amount = toWei(this.inputModel);

			// let response = { 0: 0, 1: 0, 2: 0 };
			// let responseMint = {1: 0};

			// try {
			// 	response = await this.$store.getters[`collateralVaultStore/${method}`](this.selectedCollateral, amount, this.connectedAccount);
			// 	if (this.action === "Mint") responseMint = await this.$store.getters["collateralVaultStore/mintLiquidityHelper"](this.selectedCollateral, response[1]);
			// } catch (err) {
			// 	const mintLiquidationMsg = "This will liquidate you";
			// 	if (err.message.includes(mintLiquidationMsg)) {
			// 		this.submitDisabled = true;
			// 		this.error = mintLiquidationMsg;
			// 	}
			// } finally {
			// 	this.$set(this.estimatedAmount, 0, fromWei(response[0]));
			// 	this.$set(this.estimatedAmount, 1, fromWei(response[1], this.decimals));
			// 	this.$set(this.estimatedAmount, 2, fromWei(response[2], this.decimals));
			// 	if (this.action === "Mint") this.$set(this.estimatedAmount, 3, parseFloat(fromWei(responseMint[0], this.decimals)).toFixed(2));
			// }
			this.$store.dispatch("collateralVaultStore/calcEstimation", {
				action: this.action,
				selectedCollateral: this.selectedCollateral,
				value: this.inputModel
			});
		},
		debouncedInputChange: debounce(function() {
			this.inputChanged();
		}, 500),
		inputChanged() {
			if (!["Add", "Remove"].includes(this.action)) this.getEstimatedAmounts();
		},
		approveAndSubmit() {
			this.submit();
		},
		submit() {
			try {
				let methodName = "addLiquidityForUser";
				if (this.action === "Burn") methodName = "burnNUON";
				if (this.action === "Mint") methodName = "mintWithoutDeposit";
				if (this.action === "Deposit") methodName = "depositWithoutMint";
				if (this.action === "Withdraw") methodName = "redeemWithoutNuon";
				if (this.action === "Remove") methodName = "removeLiquidityForUser";

				const amount = toWei(this.inputModel, this.actionIsMintOrBurn ? 18 : this.decimals);
				this.isLoading = true;
				this.$store.dispatch("collateralVaultStore/callManageMethods", {
					collateral: this.selectedCollateral,
					method: methodName,
					amount,
					onConfirm: (_confNumber, receipt, _latestBlockHash) => {
						this.successToast(null, "Transaction Successful", receipt.transactionHash);
						this.$store.dispatch("collateralVaultStore/updateStatus");
						this.$store.dispatch("erc20Store/initializeBalance", {address: this.connectedAccount});
					},
					onReject: (err) => {
						this.failureToast(null, err, "Transaction Failed");
						this.isLoading = false;
					},
					onTxHash: () => {
						this.isLoading = false;
					}
				});
			} catch (err) {
				this.failureToast(null, err, "Transaction Failed");
			}
		},

		selectCollateral(token) {
			this.selectedCollateral = token.symbol;
			this.getEstimatedAmounts();
			this.$emit("changeCollateral", token);
		},
	},
};
</script>
