<template>
	<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
		<template #step-one>
			<DataCard class="u-full-width u-mb-48">
				<LayoutFlex direction="row-space-between" class="u-full-width">
					<p>Amount of NUON</p>
					<p>Available balance: {{ (mintedAmount || 0) | formatLongNumber }}</p>
				</LayoutFlex>
				<InputMax v-model="inputValue" :maximum="mintedAmount" @click="inputMaxBalance" />
				<h5 v-if="inputValue" class="u-mb-0 l-flex--align-self-end">~ ${{ numberWithCommas(getDollarValue(inputValue, nuonPrice).toFixed(2)) }}</h5>
				<p v-if="readyToRepay" class="u-is-success l-flex--align-self-end">Ready to repay</p>
				<p v-if="amountMoreThanUserMinted" class="u-is-warning l-flex--align-self-end">Insufficient balance.</p>
			</DataCard>
			<DataCard class="u-full-width">
				<p>Estimated {{ currentlySelectedCollateral }} Redeemed</p>
				<h4 class="collateral-estimate">{{ estimatedWithdrawnNuonValue | toFixed | numberWithCommas }}<sup>{{ currentlySelectedCollateral }}</sup></h4>
			</DataCard>
			<div class="toggle__transaction">
				<TheButton
					:disabled="isApproved || isApproving"
					:class="isApproved"
					title="Click to approve"
					size="approved"
					class="u-min-width-185"
					@click="approveTokens">
					<span v-if="isApproved">Verified</span>
					<span v-else-if="isApproving">Approving...</span>
					<span v-else>Approve</span>
				</TheButton>
				<TheButton
					class="u-full-width"
					title="Click to deposit"
					:disabled="isNextDisabled"
					@click="activeStep = 2">Next</TheButton>
			</div>
		</template>
		<template #step-two>
			<TransactionSummaryChub
				:convert-from-amount="`${inputValue}`"
				convert-from-title="Repay"
				:convert-to-amount="estimatedWithdrawnNuonValue"
				convert-to-title="Redeem"
				:from-token="'NUON'"
				:to-token="currentlySelectedCollateral"
				:fee="redeemFee"
			/>
			<div class="toggle__transaction">
				<TheButton
					title="Click to go back"
					class="btn--back"
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
import { fromWei, toWei } from "~/utils/bnTools";

export default {
	name: "CollateralRedeem",
	props: {
		currentlySelectedCollateral: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			nuonPrice: 0,
			activeStep: 1,
			estimatedWithdrawnNuonValue: 0,
			withdrawing: false,
			inputValue: null,
			isApproving: false,
		};
	},
	computed: {
		isApproved() {
			return !!parseFloat(this.$store.state.collateralVaultStore.allowance.NUON);
		},
		isNextDisabled() {
			return !this.isApproved || !parseFloat(this.inputValue) || parseFloat(this.inputValue) > parseFloat(this.mintedAmount) || !this.connectedAccount;
		},
		readyToRepay() {
			return !!parseFloat(this.inputValue) && parseFloat(this.inputValue) <= parseFloat(this.mintedAmount);
		},
		amountMoreThanUserMinted() {
			return parseFloat(this.inputValue) > parseFloat(this.mintedAmount);
		},
		redeemFee() {
			return parseFloat(this.$store.state.collateralVaultStore.redeemFee) * 100;
		},
		mintedAmount() {
			const currentCollateralToken = this.$store.state.collateralVaultStore.currentCollateralToken;
			return this.$store.state.collateralVaultStore.mintedAmount[currentCollateralToken];
		}
	},
	watch: {
		async inputValue() {
			let result = {0: 0};
			const nuonRaisedToDecimals = this.$store.state.erc20Store.decimals.NUON;
			const redeemedTokenRaisedToDecimals =  this.$store.state.erc20Store.decimals[this.currentlySelectedCollateral];
			try {
				const amount = toWei(this.inputValue, nuonRaisedToDecimals);
				result = await this.$store.getters["collateralVaultStore/getEstimateCollateralsOut"](this.connectedAccount, amount);
			} catch (e) {
				if (!this.amountMoreThanUserMinted) {
					const message = this.getRPCErrorMessage(e);
					this.failureToast(null, message, "Transaction failed");
				}
			} finally {
				this.estimatedWithdrawnNuonValue = fromWei(result[0], redeemedTokenRaisedToDecimals);
			}
		},
		currentlySelectedCollateral() {
			this.$store.dispatch("erc20Store/initializeBalance", {address: this.connectedAccount});
			this.initialize();
		},
		connectedAccount() {
			this.initialize();
		}
	},
	mounted () {
		this.initialize();
	},
	methods: {
		async initialize() {
			if (this.connectedAccount) {
				try {
					const nuonPrice = await this.$store.getters["collateralVaultStore/getNuonPrice"]();
					this.nuonPrice = fromWei(nuonPrice);
				} catch(e) {
					this.failureToast(null, e, "An error occurred");
				}
			}

		},
		approveTokens() {
			this.isApproving = true;
			this.$store.dispatch("collateralVaultStore/approveToken",
				{
					tokenSymbol: "NUON",
					onConfirm: () => { },
					onReject: () => { },
					onCallback: () => {
						this.isApproving = false;
					}
				});
		},
		async withdraw() {
			this.activeStep = "loading";
			this.withdrawing = true;
			const nuonAmount = toWei(this.inputValue, this.$store.state.erc20Store.decimals.NUON);

			try {
				await this.$store.dispatch("collateralVaultStore/redeem",
					{
						nuonAmount,
						onConfirm: (_confNumber, receipt, _latestBlockHash) => {
							this.$store.commit("collateralVaultStore/setUserJustMinted", true);
							this.successToast(null, "Redeem successful", receipt.transactionHash);
							this.$store.dispatch("erc20Store/initializeBalance", {address: this.connectedAccount});
						},
						onReject: null
					});
			} catch(e) {
				const message = this.getRPCErrorMessage(e);
				this.failureToast(null, message || e, "Transaction failed");
			}
			finally {
				this.withdrawing = false;
				this.activeStep = 1;
			}
		},
		inputMaxBalance() {
			this.inputValue = this.twoDecimalPlaces(this.mintedAmount);
		}
	}
};
</script>
