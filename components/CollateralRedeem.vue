<template>
	<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
		<template #step-one>
			<div class="toggle__content">
				<h5 class="u-mb-12">Select Your Collateral Token To Redeem</h5>
				<CollateralClaimAccordion
					:token="withdrawToken"
					:default-value="withdrawAmount"
					@selected-token="selectClaimToken"
					@change-input="changeWithdrawValue" />
				<TheButton
					class="u-full-width"
					title="Click to deposit"
					:disabled="isNextDisabled"
					@click="activeStep = 2">Next</TheButton>
			</div>
		</template>
		<template #step-two>
			<TransactionSummary :values="summary" />
			<div class="toggle__transaction">
				<TheButton
					title="Click to go back"
					@click="activeStep = 1">Back</TheButton>
				<TheButton
					class="u-full-width"
					title="Click to confirm"
					:disabled="withdrawing"
					@click="withdraw">
					<span v-if="withdrawing">Withdrawing...</span>
					<span v-else>Withdraw</span>
				</TheButton>
			</div>
		</template>
	</TheStepper>
</template>

<script>
import { HX, USX, TOKENS_MAP } from "~/constants/tokens";
import { fromWei, toWei } from "~/utils/bnTools";

export default {
	name: "CollateralRedeem",
	data() {
		return {
			withdrawCollateral: 3223,
			maxUsxRedeemed: 3401,
			activeStep: 1,
			withdrawToken: {
				symbol: HX.symbol,
				price: 0,
				balance: 0
			},
			withdrawAmount: 0,
			estimatedWithdrawnUsxValue: 0,
			allCollaterals: [],
			feeAmount: 0,
			withdrawing: false
		};
	},
	computed: {
		isApproved() {
			return !!this.$store.state.collateralVaultStore.allowance[this.withdrawToken.symbol];
		},
		tokenBalance() {
			return parseFloat(this.withdrawToken.balance);
		},
		isNextDisabled() {
			return !this.isApproved || !this.withdrawAmount || this.withdrawAmount > this.tokenBalance;
		},
		feeDollarValue() {
			return (this.withdrawAmount * this.withdrawToken.price * this.feeAmount).toFixed(2);
		},
		summary() {
			return [
				{
					title: "Collateral to Withdraw",
					val: this.numberWithCommas(parseFloat(this.withdrawAmount).toFixed(2)),
					currency: this.withdrawToken.symbol,
					dollar: this.numberWithCommas((this.withdrawAmount * this.withdrawToken.price).toFixed(2))
				},
				{
					title: "Maximum Withdrawn USX",
					val: this.numberWithCommas(this.estimatedWithdrawnUsxValue),
					currency: "USX",
					dollar: this.numberWithCommas((this.estimatedWithdrawnUsxValue * this.tokenPrices.USX).toFixed(2))
				},
				{
					title: "Fee",
					val: `${this.redeemFee * 100}%`,
					dollar: this.numberWithCommas(this.feeDollarValue)
				},
				{
					title: "Total Received",
					val: this.numberWithCommas((this.estimatedWithdrawnUsxValue * (1 - this.feeAmount)).toFixed(2)),
					currency: "HX",
					dollar: this.numberWithCommas((this.estimatedWithdrawnUsxValue * this.tokenPrices.USX).toFixed(2) - this.feeDollarValue)
				}
			];
		},
		redeemFee() {
			return this.$store.state.collateralVaultStore.redeemFee;
		}
	},
	async mounted () {
		const hxPrice = parseFloat(await this.$store.getters["stabilityFlashStore/getHYDROPriceInUSDC"]);
		this.withdrawToken.price = hxPrice;
		this.allCollaterals = await this.$store.getters["collateralVaultStore/getCollaterals"]();
		const cid = this.allCollaterals.findIndex(c => c === TOKENS_MAP.HX.address);
		if (cid !== -1) {
			const userAmounts = await this.$store.getters["collateralVaultStore/getUserAmounts"](this.connectedAccount, cid);
			const balance = parseFloat(userAmounts[1]) / (10 ** this.$store.state.erc20Store.decimals[token.symbol]);
			this.withdrawToken = {...this.withdrawToken, balance};
		}
	},
	methods: {
		async selectClaimToken(token) {
			let price = 0;
			let balance = 0;
			const selectedTokenAddress = TOKENS_MAP[token.symbol].address;
			const decimals = (10 ** this.$store.state.erc20Store.decimals[token.symbol]);
			if (token.symbol === HX.symbol) {
				price = parseFloat(await this.$store.getters["stabilityFlashStore/getHYDROPriceInUSDC"]);
			} else if (token.symbol === USX.symbol) {
				price = parseFloat(await this.$store.getters["stabilityFlashStore/getUSXPriceInUSDC"]);
			} else {
				price = parseFloat(await this.$store.getters["collateralVaultStore/getCollateralPrice"](selectedTokenAddress));
			}
			price = price / decimals;

			const cid = this.allCollaterals.findIndex(c => c === selectedTokenAddress);
			if (cid !== -1) {
				const userAmounts = await this.$store.getters["collateralVaultStore/getUserAmounts"](this.connectedAccount, cid);
				balance = parseFloat(userAmounts[1]) / decimals;
			}
			this.withdrawToken = {...token, price, cid, balance, address: selectedTokenAddress};
		},
		async changeWithdrawValue(value) {
			if (!value) return;
			this.withdrawAmount = value;

			const cid = this.allCollaterals.findIndex(c => c === this.withdrawToken.address);
			const usxValueWithDecimals = toWei(value);
			let estimatedValue = null;
			try {
				estimatedValue = await this.$store.getters["collateralVaultStore/getEstimateCollateralsOut"](cid, this.connectedAccount, usxValueWithDecimals);
				this.estimatedWithdrawnUsxValue = estimatedValue[0] / (10 ** this.$store.state.erc20Store.decimals[this.withdrawToken.symbol]);
				this.feeAmount = fromWei(estimatedValue[2]);
			} catch (e) {
				this.failureToast(() => {},  e.message);
			}
		},
		async withdraw() {
			this.activeStep = "loading";
			this.withdrawing = true;
			const selectedTokenAddress = TOKENS_MAP[this.withdrawToken.symbol].address;
			const cid = this.allCollaterals.findIndex(c => c === selectedTokenAddress);
			const usxAmount = (this.withdrawAmount * (10 ** this.$store.state.erc20Store.decimals.USX)).toString();

			try {
				await this.$store.dispatch("collateralVaultStore/redeem",
					{
						usxAmount,
						cid,
						onConfirm: (txHash) => {
							this.successToast(null, "Withdraw successful", txHash);
						},
						onReject: null
					});
			} catch(e) {
				this.failureToast(null, e, "Transaction failed");
			}
			finally {
				this.withdrawing = false;
				this.activeStep = 1;
			}
		}
	}
};
</script>
