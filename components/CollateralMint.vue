<template>
	<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
		<template #step-one>
			<DataCard class="u-full-width u-mb-48">
				<LayoutFlex direction="row-space-between" class="u-full-width">
					<p>{{ selectedToken.symbol }} amount</p>
					<p>Available balance: {{ (tokenBalance || 0) | formatLongNumber }}</p>
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
						<TheButton
							:disabled="isMaxInputDisabled(selectedToken ? selectedToken.balance : 0)"
							size="sm"
							title="Click to input your max balance"
							@click="inputMaxBalance">Max</TheButton>
					</div>
				</div>
				<h5 v-if="selectedToken" class="u-mb-0 l-flex--align-self-end">~ ${{ numberWithCommas(getDollarValue(inputValue, tokenPrice).toFixed(2)) }}</h5>
				<p v-if="readyToDeposit && !isMoreThanBalance" class="u-is-success l-flex--align-self-end">Ready to deposit</p>
				<p v-if="isMoreThanBalance" class="u-is-warning l-flex--align-self-end">Insufficient balance</p>
			</DataCard>
			<DataCard class="u-full-width">
				<p>Estimated NUON minted</p>
				<h4 class="collateral-estimate">{{ estimatedMintedNuonValue | toFixed | numberWithCommas }} NUON</h4>
			</DataCard>
			<DataCard class="u-full-width">
				<p>Set Your Collateral Ratio</p>
				<div class="collateral">
					<LayoutFlex direction="row-space-between" class="u-full-width">
						<div class="collateral__text">
							<p>Liquidation Price</p>
							<h4>${{ liquidationPrice | toFixed | numberWithCommas }}</h4>
						</div>
						<div class="collateral__text">
							<p>Collateral Ratio</p>
							<h4 :class="selectedCollateralRatio < 722 ? selectedCollateralRatio < 446 ? 'u-is-warning' : 'u-is-caution' : 'u-is-success'">{{ selectedCollateralRatio }}%</h4>
						</div>
					</LayoutFlex>
					<RangeSlider :min="'170'" :max="'1000'" :slider-disabled="!inputValue || isMoreThanBalance" :selected-collateral-ratio="`${selectedCollateralRatio}`" @emit-change="sliderChanged" />
					<LayoutFlex direction="row-space-between">
						<div class="range-slider__value">
							<h5>170%</h5>
							<p>Increased Risk</p>
						</div>
						<div class="range-slider__value">
							<h5>1000%</h5>
							<p>Decreased Risk</p>
						</div>
					</LayoutFlex>
				</div>
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
					:disabled="disabledMint"
					@click="activeStep = 2">Next</TheButton>
			</div>
		</template>
		<template #step-two>
			<TransactionSummaryChub
				:deposit-amount="inputValue"
				:mint-amount="estimatedMintedNuonValue"
				:collateral-ratio="selectedCollateralRatio"
				:liquidation-price="liquidationPrice"
			/>
			<div class="toggle__transaction">
				<TheButton
					title="Click to go back"
					@click="activeStep = 1">Back</TheButton>
				<TheButton
					class="u-full-width"
					title="Click to confirm"
					:disabled="minting"
					@click="mint">
					<span v-if="minting">Minting...</span>
					<span v-else>Confirm</span>
				</TheButton>
			</div>
		</template>
	</TheStepper>
</template>

<script>
import { BigNumber } from "bignumber.js";
import { toWei } from "~/utils/bnTools";

export default {
	name: "CollateralMint",
	data() {
		return {
			selectedCollateralRatio: "170",
			tokenPrice: 2,
			inputValue: 0,
			estimatedMintedNuonValue: 0,
			maxUsxMinted: 3401,
			activeStep: 1,
			isApproving: false,
			minting: false,
			allCollaterals: [],
			selectedToken: {
				symbol: "ETH",
				balance: 0
			},
			liquidationPrice: 0
		};
	},
	computed: {
		isApproved() {
			return this.$store.state.collateralVaultStore.allowance.HX;
		},
		disabledMint() {
			return !this.isApproved || !parseFloat(this.inputValue) || this.isMoreThanBalance;
		},
		isMoreThanBalance() {
			return  parseFloat(this.inputValue) > this.tokenBalance;
		},
		tokenBalance() {
			return parseFloat(this.$store.state.erc20Store.balance.HX);
		},
		mintingFee() {
			return this.$store.state.collateralVaultStore.mintingFee;
		},
		readyToDeposit() {
			return !!this.inputValue;
		},
	},
	watch: {
		inputValue() {
			this.getEstimatedMintedNuon();
			if (this.selectedCollateralRatio) this.liquidationPrice = (this.inputValue * this.tokenPrice) / (this.selectedCollateralRatio / 100);
		},
		selectedCollateralRatio(newValue) {
			if (newValue) this.liquidationPrice = (this.inputValue * this.tokenPrice) / (this.selectedCollateralRatio / 100);
		}
	},
	methods: {
		sliderChanged(e) {
			this.selectedCollateralRatio = e;
		},
		approveTokens() {
			this.isApproving = true;
			this.$store.dispatch("collateralVaultStore/approveToken",
				{
					tokenSymbol: "HX",
					onConfirm: () => { },
					onReject: () => { },
					onCallback: () => {
						this.isApproving = false;
					}
				});
		},
		async getEstimatedMintedNuon() {
			const ans = await this.$store.getters["collateralVaultStore/getEstimateMintedNUONAmount"](new BigNumber(toWei(this.inputValue)), new BigNumber(0.4e18));
			this.estimatedMintedNuonValue = ans[0];
		},
		async mint() {
			this.activeStep = "loading";
			this.minting = true;
			const amount = toWei(this.inputValue, this.$store.state.erc20Store.decimals.HX);
			// const collateralRatioToWei = this.selectedCollateralRatio * 10;
			await this.$store.dispatch("collateralVaultStore/mintNuon",
				{
					collateralRatio,
					collateralAmount: amount,
					onConfirm: (_confNumber, receipt, _latestBlockHash) => {
						this.$store.commit("collateralVaultStore/setUserJustMinted", true);
						this.successToast(null, `You've successfully minted ${this.estimatedMintedNuonValue} Nuon`, receipt.transactionHash);
					},
					onReject: (err) => {
						this.failureToast(null, err, "Transaction failed");
					}
				});
			this.minting = false;
			this.activeStep = 1;
		},
		inputMaxBalance() {
			this.inputValue = this.tokenBalance;
		}
	}
};
</script>
