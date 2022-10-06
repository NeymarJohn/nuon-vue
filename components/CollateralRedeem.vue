<template>
	<div class="swap">
		<div class="swap__container u-mb-8">
			<LayoutFlex direction="row-center-space-between swap__balance">
				<label>Burn</label>
				<ComponentLoader component="label" :loaded="Number(mintedAmount) !== 0">
					<label>Balance:
						<span>{{ mintedAmount | formatLongNumber }}</span>
					</label>
				</ComponentLoader>
			</LayoutFlex>
			<div class="input-wrapper">
				<div class="input-token">
					<NuonLogo />
					<h5>NUON</h5>
				</div>
				<InputMax v-model="inputValue" :maximum="mintedAmount" @input="debouncedHandler"/>
			</div>
			<LayoutFlex direction="row-center-space-between">
				<div>
					<p v-if="readyToRedeem" class="u-font-size-14 u-is-success u-mb-0">Ready To Redeem</p>
					<p v-if="isMoreThanBalance" class="u-font-size-14 u-is-warning u-mb-0">Insufficient Balance</p>
				</div>
				<p class="u-mb-0 u-font-size-14 u-color-light-grey">~ ${{ getDollarValue(inputValue, tokenPrices.NUON) | toFixed | numberWithCommas }}</p>
			</LayoutFlex>
		</div>
		<div class="swap__container u-mb-24">
			<SwapBalance
				label="Redeem"
				:token="selectedCollateral"
				:balance="tokenBalances[selectedCollateral]" />
			<MintAccordion
				:disabled-tokens="['BTC', 'BUSD', 'AVAX']"
				:default-token="selectedCollateral"
				@selected-token="selectCollateralToken">
				<template #input>
					<h3>{{estimatedWithdrawnValue | toFixed | numberWithCommas}}<sup>{{selectedCollateral}}</sup></h3>
				</template>
			</MintAccordion>
		</div>
		<TransactionSummary v-if="inputValue > 0 && !isMoreThanBalance" :values="summary" />
		<LayoutFlex direction="row-justify-end">
			<TheButton
				title="Click to mint"
				:disabled="isRedeemDisabled"
				@click="approveAndRedeem">
				Redeem
			</TheButton>
		</LayoutFlex>
	</div>
</template>

<script>
import debounce from "lodash.debounce";
import { fromWei, toWei } from "~/utils/bnTools";
import NuonLogo from "@/assets/images/logo/logo-numint.svg";
import { NUON } from "~/constants/tokens";

export default {
	name: "CollateralRedeem",
	components: {
		NuonLogo,
	},
	props: {
		defaultCollateral: {
			type: String,
			required: true,
			defaultValue: "WETH"
		}
	},
	data() {
		return {
			estimatedWithdrawnValue: 0,
			inputValue: null,
			selectedCollateral: "WETH"
		};
	},
	computed: {
		summary() {
			return [
				{
					title: "NUON repaid",
					val: this.inputValue,
					currency: "NUON",
				},
				{
					title: `Estimated ${this.selectedCollateral} redeemed`,
					val: this.estimatedWithdrawnValue,
					currency: this.selectedCollateral,
				},
				{
					title: "Fee",
					val: this.redeemFee,
					currency: "%",
				},
			];
		},
		isRedeemDisabled() {
			return !parseFloat(this.inputValue) || this.isMoreThanBalance || !this.connectedAccount;
		},
		readyToRedeem() {
			return !!parseFloat(this.inputValue) && parseFloat(this.inputValue) <= parseFloat(this.mintedAmount);
		},
		isMoreThanBalance() {
			return parseFloat(this.inputValue) > parseFloat(this.mintedAmount);
		},
		redeemFee() {
			return this.$store.state.collateralVaultStore.redeemFee[this.selectedCollateral];
		},
		mintedAmount() {
			return this.$store.state.collateralVaultStore.mintedAmount[this.selectedCollateral];
		},		
		isApproved() {
			const allowance = this.$store.state.collateralVaultStore.allowance;
			return allowance[this.selectedCollateral] > 0;
		},
	},
	mounted () {
		if (this.defaultCollateral) {
			this.selectedCollateral = this.defaultCollateral;
		};
	},
	methods: {
		debouncedHandler: debounce(function(e) {
			this.changeInputValue(e);
		}, 0),
		async changeInputValue() {
			let result = {0: 0};
			const nuonRaisedToDecimals = this.$store.state.erc20Store.decimals.NUON;
			const redeemedTokenRaisedToDecimals =  this.$store.state.erc20Store.decimals[this.selectedCollateral];
			try {
				const amount = toWei(this.inputValue, nuonRaisedToDecimals);
				result = await this.$store.getters["collateralVaultStore/getEstimateCollateralsOut"](this.connectedAccount, this.selectedCollateral, amount);
			} catch (e) {
				if (!this.isMoreThanBalance) {
					const message = this.getRPCErrorMessage(e);
					this.failureToast(null, message, "Transaction failed");
				}
			} finally {
				this.estimatedWithdrawnValue = fromWei(result[0], redeemedTokenRaisedToDecimals);
			}
		},
		async approveAndRedeem() {
			if (this.isApproved) {
				this.redeem();
			} else {
				await this.$store.dispatch("collateralVaultStore/approveToken",
					{
						tokenSymbol: NUON.symbol,
						collateralToken: this.selectedCollateral,
						onCallback: () => {
							this.redeem();
						}
					});}
		},
		async redeem() {
			const nuonAmount = toWei(this.inputValue, this.$store.state.erc20Store.decimals.NUON);
			try {
				await this.$store.dispatch("collateralVaultStore/redeem",
					{
						collateralToken: this.selectedCollateral,
						nuonAmount,
						onConfirm: (_confNumber, receipt, _latestBlockHash) => {
							this.$store.commit("collateralVaultStore/setUserJustMinted", true);
							this.successToast(null, "Redeem successful", receipt.transactionHash);
							this.$store.dispatch("erc20Store/initializeBalance", {address: this.connectedAccount});
							this.$store.dispatch("collateralVaultStore/updateStatus");
						},
						onReject: null
					});
			} catch(e) {
				const message = this.getRPCErrorMessage(e);
				this.failureToast(null, message || e, "Transaction failed");
			}
		},
		selectCollateralToken(token) {
			this.selectedCollateral = token.symbol;
			this.$store.dispatch("collateralVaultStore/getAllowance", this.selectedCollateral);
		},
	}
};
</script>
