<template>
	<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
		<template #step-one>
			<DataCard class="u-full-width u-mb-48">
				<LayoutFlex direction="row-space-between" class="u-full-width">
					<p>NUON amount</p>
					<p>Available balance: {{ (userMintedNuon || 0) | formatLongNumber }}</p>
				</LayoutFlex>
				<div class="input u-mb-12">
					<div class="input__container">
						<input
							v-model="inputValue"
							placeholder="0.0"
							type="number"
							min="0"
							autocomplete="off"
							autocorrect="off"
							spellcheck="false"
							inputmode="decimal" />
						<TheButton :disabled="isMaxInputDisabled(userMintedNuon ? userMintedNuon : 0)" size="sm" title="Click to input your max balance" @click="inputMaxBalance">Max</TheButton>
					</div>
				</div>
				<h5 v-if="inputValue" class="u-mb-0 l-flex--align-self-end">~ ${{ numberWithCommas(getDollarValue(inputValue, nuonPrice).toFixed(2)) }}</h5>
				<p v-if="readyToRepay" class="u-is-success l-flex--align-self-end">Ready to repay</p>
				<p v-if="amountMoreThanUserMinted" class="u-is-warning l-flex--align-self-end">Insufficient balance.</p>
			</DataCard>
			<DataCard class="u-full-width">
				<p>Estimated ETH Redeemed</p>
				<h4 class="collateral-estimate">{{ estimatedWithdrawnNuonValue | toFixed | numberWithCommas }}<sup>ETH</sup></h4>
			</DataCard>
			<div class="toggle__transaction">
				<TheButton
					:disabled="isApproved || isApproving"
					:class="isApproved"
					title="Click to approve"
					size="approved"
					class="u-min-width-185"
					@click="approveTokens">
					<span v-if="isApproved">Approved</span>
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
			/>
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
import { BigNumber } from "bignumber.js";
import { fromWei, toWei } from "~/utils/bnTools";

export default {
	name: "CollateralRedeem",
	data() {
		return {
			nuonPrice: 0,
			activeStep: 1,
			estimatedWithdrawnNuonValue: 0,
			withdrawing: false,
			inputValue: null,
			userMintedNuon: 0,
			isApproving: false
		};
	},
	computed: {
		isApproved() {
			return !!this.$store.state.collateralVaultStore.allowance.NUON;
		},
		tokenBalance() {
			return parseFloat(this.$store.state.erc20Store.balance.NUON);
		},
		isNextDisabled() {
			return !this.isApproved || !parseFloat(this.inputValue) || parseFloat(this.inputValue) > parseFloat(this.userMintedNuon);
		},
		readyToRepay() {
			return !!parseFloat(this.inputValue) && parseFloat(this.inputValue) <= parseFloat(this.userMintedNuon);
		},
		amountMoreThanUserMinted() {
			return parseFloat(this.inputValue) > parseFloat(this.userMintedNuon);
		}
	},
	watch: {
		async inputValue() {
			let result = {0: 0};
			try {
				result = await this.$store.getters["collateralVaultStore/getEstimateCollateralsOut"](this.connectedAccount, toWei(this.inputValue));
			} catch (e) {
				const jsonRPCErrorMessage = this.getRPCErrorMessage(e);
				this.failureToast(null, jsonRPCErrorMessage, "Transaction failed");
			} finally {
				this.estimatedWithdrawnNuonValue = fromWei(result[0]);
			}
		}
	},
	async mounted () {
		this.userMintedNuon = fromWei(await this.$store.getters["collateralVaultStore/getUserMintedAmount"](this.connectedAccount));
		this.nuonPrice = fromWei(await this.$store.getters["collateralVaultStore/getNuonPrice"]());
	},
	methods: {
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
			const nuonAmount = (this.inputValue * (10 ** this.$store.state.erc20Store.decimals.NUON)).toString();

			try {
				await this.$store.dispatch("collateralVaultStore/redeem",
					{
						nuonAmount: new BigNumber(nuonAmount),
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
		},
		inputMaxBalance() {
			this.inputValue = this.userMintedNuon;
		}
	}
};
</script>
