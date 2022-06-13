<template>
	<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
		<template #step-one>
			<DataCard class="u-full-width u-mb-48">
				<LayoutFlex direction="row-space-between" class="u-full-width">
					<p>{{ selectedToken.symbol }} amount</p>
					<p>Available balance: {{ (ethBalance || 0) | formatLongNumber }}</p>
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
				<p v-if="readyToDeposit" class="u-is-success l-flex--align-self-end">Ready to deposit</p>
			</DataCard>
			<DataCard class="u-full-width">
				<p>Estimated NUON minted</p>
				<h4 class="collateral-estimate">{{ estimatedMintedNuonValue }} NUON</h4>
			</DataCard>
			<DataCard class="u-full-width">
				<p>Set your Collateral Ratio</p>
				<div class="collateral">
					<LayoutFlex direction="row-space-between" class="u-full-width">
						<div class="collateral__text">
							<p>Liquidation Price</p>
							<h4>${{ liquidationPrice | toFixed | numberWithCommas }}</h4>
						</div>
						<div class="collateral__text">
							<p>Collateral Ratio</p>
							<h4>{{ selectedCollateralRatio }}%</h4>
						</div>
					</LayoutFlex>
					<RangeSlider :min="170" :max="1000" @emit-change="sliderChanged" />
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
import BigNumber from "bignumber.js";
import { TOKENS_MAP} from "~/constants/tokens";
import { fromWei, toWei } from "~/utils/bnTools";

export default {
	name: "CollateralMint",
	data() {
		return {
			selectedCollateralRatio: 170,
			tokenPrice: 2,
			inputValue: 0,
			estimatedMintedNuonValue: 0,
			depositLockedCollateral: 0,
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
			// this.$store.state.collateralVaultStore.allowance[this.mintToken.symbol]
			return true;
		},
		disabledMint() {
			// !this.isApproved || !parseFloat(this.depositLockedCollateral) || this.isMoreThanBalance
			return false;
		},
		isMoreThanBalance() {
			return  parseFloat(this.depositLockedCollateral) > this.tokenBalance;
		},
		tokenBalance() {
			return parseFloat(this.mintToken.balance);
		},
		mintingFee() {
			return this.$store.state.collateralVaultStore.mintingFee;
		},
		readyToDeposit() {
			return !!this.inputValue;
		},
		ethBalance() {
			return this.$store.state.erc20Store.balance.ETH;
		}
	},
	watch: {
		inputValue(newValue) {
			if (newValue) this.getEstimatedMintedUsx();
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
					tokenSymbol: this.mintToken.symbol,
					onConfirm: () => { },
					onReject: () => { },
					onCallback: () => {
						this.isApproving = false;
					}
				});
		},
		async changeMintValue(value) {
			this.depositLockedCollateral = value;
			const estimatedValue = await this.getEstimatedMintedUsx();
			this.estimatedMintedNuonValue = fromWei(estimatedValue[0]);
		},
		async getEstimatedMintedUsx() {
			const test = new BigNumber(1e18);
			const ans = await this.$store.getters["collateralVaultStore/getEstimateMintedNUONAmount"](test, new BigNumber(0.4e18));
			this.estimatedMintedNuonValue = ans[0];
		},
		async mint() {
			this.activeStep = "loading";
			this.minting = true;
			const selectedTokenAddress = TOKENS_MAP[this.mintToken.symbol].address;
			const cid = this.allCollaterals.findIndex(c => c === selectedTokenAddress);
			const amount = toWei(this.depositLockedCollateral, this.$store.state.erc20Store.decimals[this.mintToken.symbol]);
			this.mintToken = {...this.mintToken, cid};
			await this.$store.dispatch("collateralVaultStore/mint",
				{
					amount,
					cid,
					onTxHash: null,
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
			this.inputValue = this.ethBalance;
		}
	}
};
</script>
