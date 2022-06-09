<template>
	<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
		<template #step-one>
			<DataCard class="u-full-width u-mb-48">
				<LayoutFlex direction="row-space-between" class="u-full-width">
					<p>{{ withdrawToken.symbol }} amount</p>
					<p>Available balance: {{ (withdrawToken.balance || 0) | formatLongNumber }}</p>
				</LayoutFlex>
				<div class="input u-mb-12">
					<div class="input__container">
						<input
							v-model="inputValue"
							placeholder="0.0"
							type="number"
							min="0"
							max="79"
							autocomplete="off"
							autocorrect="off"
							spellcheck="false"
							inputmode="decimal" />
						<TheButton :disabled="isMaxInputDisabled(withdrawToken ? withdrawToken.balance : 0)" size="sm" title="Click to input your max balance" @click="inputMaxBalance">Max</TheButton>
					</div>
				</div>
				<h5 v-if="withdrawToken" class="u-mb-0 l-flex--align-self-end">~ ${{ numberWithCommas(getDollarValue(inputValue, withdrawToken.price).toFixed(2)) }}</h5>
				<p v-if="readyToDeposit" class="u-is-success l-flex--align-self-end">Ready to repay</p>
			</DataCard>
			<DataCard class="u-full-width">
				<p>Estimated ETH Redeemed</p>
				<h4 class="collateral-estimate">{{ collateralEstimate | toFixed | numberWithCommas }}<sup>ETH</sup></h4>
			</DataCard>
			<TheButton
				class="u-full-width"
				title="Click to deposit"
				:disabled="isNextDisabled"
				@click="activeStep = 2">Next</TheButton>
		</template>
		<template #step-two>
			<TransactionSummaryChub :values="summary" />
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
import { HX, TOKENS_MAP } from "~/constants/tokens";
import { fromWei, toWei } from "~/utils/bnTools";

export default {
	name: "CollateralRedeem",
	data() {
		return {
			withdrawCollateral: 3223,
			maxUsxRedeemed: 3401,
			activeStep: 1,
			collateralEstimate: 1.3,
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
			// !!this.$store.state.collateralVaultStore.allowance[this.withdrawToken.symbol]
			return true;
		},
		tokenBalance() {
			return parseFloat(this.withdrawToken.balance);
		},
		isNextDisabled() {
			// !this.isApproved || !this.withdrawAmount || this.withdrawAmount > this.tokenBalance
			return false;
		},
		feeDollarValue() {
			return (this.withdrawAmount * this.withdrawToken.price * this.feeAmount).toFixed(2);
		},
		summary() {
			return [
				// {
				// 	title: "Collateral to Withdraw",
				// 	val: this.numberWithCommas(parseFloat(this.withdrawAmount).toFixed(2)),
				// 	currency: this.withdrawToken.symbol,
				// 	dollar: this.numberWithCommas((this.withdrawAmount * this.withdrawToken.price).toFixed(2))
				// },
				// {
				// 	title: "Maximum Withdrawn Nuon",
				// 	val: this.numberWithCommas(this.estimatedWithdrawnUsxValue),
				// 	currency: "Nuon",
				// 	dollar: this.numberWithCommas((this.estimatedWithdrawnUsxValue * this.tokenPrices.USX).toFixed(2))
				// },
				// {
				// 	title: "Fee",
				// 	val: `${this.redeemFee * 100}%`,
				// 	dollar: this.numberWithCommas(this.feeDollarValue)
				// },
				// {
				// 	title: "Total Received",
				// 	val: this.numberWithCommas((this.estimatedWithdrawnUsxValue * (1 - this.feeAmount)).toFixed(2)),
				// 	currency: "HX",
				// 	dollar: this.numberWithCommas((this.estimatedWithdrawnUsxValue * this.tokenPrices.USX).toFixed(2) - this.feeDollarValue)
				// }
			];
		},
		redeemFee() {
			// this.$store.state.collateralVaultStore.redeemFee
			return 0;
		}
	},
	async mounted () {
		// const hxPrice = parseFloat(this.tokenPrices.HX);
		// this.withdrawToken.price = hxPrice;
		// this.allCollaterals = await this.$store.getters["collateralVaultStore/getCollaterals"]();
		// const cid = this.allCollaterals.findIndex(c => c === TOKENS_MAP.HX.address);
		// if (cid !== -1) {
		// 	const userAmounts = await this.$store.getters["collateralVaultStore/getUserAmounts"](this.connectedAccount, cid);
		// 	const balance = parseFloat(userAmounts[1]) / (10 ** this.$store.state.erc20Store.decimals[token.symbol]);
		// 	this.withdrawToken = {...this.withdrawToken, balance};
		// }
	},
	methods: {
		async selectClaimToken(token) {
			let price = 0;
			let balance = 0;
			const selectedTokenAddress = TOKENS_MAP[token.symbol].address;
			const decimals = (10 ** this.$store.state.erc20Store.decimals[token.symbol]);
			price = this.tokenPrices[token.symbol] || 0;
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
				this.failureToast(null, e, "An error occurred");
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
