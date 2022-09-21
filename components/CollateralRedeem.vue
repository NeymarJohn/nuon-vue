<template>
	<div class="swap">
		<div class="swap__container u-mb-8">
			<SwapBalance
				label="Redeem"
				:token="selectedCollateral" />
			<MintAccordion
				:disabled-tokens="[currentlySelectedCollateral, 'BTC', 'BUSD', 'AVAX']"
				:default-token="currentlySelectedCollateral"
				@selected-token="selectInputToken">
			</MintAccordion>
		</div>
		<div class="swap__container u-mb-24">
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
				<InputMax v-model="inputValue" :maximum="mintedAmount" @input="inputMaxBalance" />
			</div>
			<LayoutFlex direction="row-center-space-between">
				<div>
					<p v-if="readyToRedeem" class="u-font-size-14 u-is-success u-mb-0">Ready To Redeem</p>
					<p v-if="isMoreThanBalance" class="u-font-size-14 u-is-warning u-mb-0">Insufficient Balance</p>
				</div>
				<p class="u-mb-0 u-font-size-14 u-color-light-grey">~ ${{ numberWithCommas(getDollarValue(inputValue, nuonPrice).toFixed(2)) }}</p>
			</LayoutFlex>
		</div>
		<TransactionSummary v-if="inputValue > 0 && !isMoreThanBalance" :values="summary" />
		<LayoutFlex direction="row-justify-end">
			<TheButton
				title="Click to mint"
				:disabled="isRedeemDisabled"
				@click="redeem">
				Redeem
			</TheButton>
		</LayoutFlex>
	</div>
</template>

<script>
import { fromWei, toWei } from "~/utils/bnTools";
import NuonLogo from "@/assets/images/logo/logo-numint.svg";

export default {
	name: "CollateralRedeem",
	components: {
		NuonLogo,
	},
	props: {
		currentlySelectedCollateral: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			nuonPrice: 0,
			estimatedWithdrawnNuonValue: 0,
			inputValue: null,
			mintFee: 5
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
					val: this.estimatedWithdrawnNuonValue,
					currency: this.selectedCollateral,
				},
				{
					title: "Collateral ratio",
					val: this.numberWithCommas(Number(this.selectedCollateralRatio).toFixed(2)),
					currency: "%",
				},
				{
					title: "Liquidation price",
					val: this.numberWithCommas(Number(this.liquidationPrice).toFixed(2)),
					currency: "USD",
				},
				{
					title: "Fee",
					val: this.mintFee,
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
				if (!this.isMoreThanBalance) {
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
		async redeem() {
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
		},
		inputMaxBalance() {
			this.inputValue = this.twoDecimalPlaces(this.mintedAmount);
		}
	}
};
</script>
