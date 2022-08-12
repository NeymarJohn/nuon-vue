<template>
	<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
		<template #step-one>
			<DataCard class="u-full-width u-mb-48">
				<LayoutFlex direction="row-space-between" class="u-full-width">
					<p>Amount of {{ currentlySelectedCollateral }}</p>
					<p>Available balance: {{ (tokenBalance || 0) | formatLongNumber }}</p>
				</LayoutFlex>
				<div class="input u-mb-12">
					<div class="input__container">
						<input
							v-model="inputValue"
							placeholder="0.0"
							type="number"
							:min="minimumDepositAmount"
							autocomplete="off"
							autocorrect="off"
							spellcheck="false"
							inputmode="decimal" />
						<TheButton
							:disabled="isMaxInputDisabled(tokenBalance ? tokenBalance : 0)"
							size="sm"
							title="Click to input your max balance"
							@click="inputMaxBalance">Max</TheButton>
					</div>
				</div>
				<h5 v-if="inputValue" class="u-mb-0 l-flex--align-self-end">~ ${{ numberWithCommas(getDollarValue(inputValue, collateralPrice).toFixed(2)) }}</h5>
				<p v-if="readyToDeposit && !isLTEMinimumDepositAmount" class="u-is-success l-flex--align-self-end">Ready to deposit</p>
				<p v-if="isMoreThanBalance" class="u-is-warning l-flex--align-self-end">Insufficient balance</p>
				<p v-if="isLTEMinimumDepositAmount" class="u-is-warning l-flex--align-self-end">Please deposit more than {{ minimumDepositAmount }}</p>
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
							<h4 :class="selectedCollateralRatio < 300 ? selectedCollateralRatio < 200 ? 'u-is-warning' : 'u-is-caution' : 'u-is-success'">{{ selectedCollateralRatio }}%</h4>
						</div>
					</LayoutFlex>
					<RangeSlider :min="`${sliderMin}`" :max="'1000'" :slider-disabled="!inputValue || isMoreThanBalance" :selected-collateral-ratio="`${selectedCollateralRatio}`" @emit-change="sliderChanged" />
					<LayoutFlex direction="row-space-between">
						<div class="range-slider__value">
							<h5>{{ sliderMin }}%</h5>
							<p>Increased Risk</p>
						</div>
						<div class="range-slider__value">
							<h5>1000%</h5>
							<p>Decreased Risk</p>
						</div>
					</LayoutFlex>
				</div>
			</DataCard>
			<DataCard class="u-full-width">
				<p>Estimated total NUON minted</p>
				<h4 class="collateral-estimate">{{ estimatedMintedNuonValue | toFixed | numberWithCommas }} <sup>NUON</sup></h4>
			</DataCard>
			<DataCard class="u-full-width">
				<label>Estimated extra required collateral<TooltipIcon v-tooltip="'Nuon requires an extra amount of collaterals to be deposited that will be converted in LPs. This amount is used to ensure liquidity protection in the ecosystem and will be returned to you at redeem.'" /></label>
				<h4 class="collateral-estimate">{{ estimatedExtraRequiredCollateral | toFixed | numberWithCommas }} <sup>{{ currentlySelectedCollateral }}</sup></h4>
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
					:disabled="disabledMint"
					@click="activeStep = 2">Next</TheButton>
			</div>
		</template>
		<template #step-two>
			<TransactionSummaryChub
				:convert-from-amount="`${inputValue}`"
				convert-from-title="Deposit"
				:convert-to-amount="estimatedMintedNuonValue"
				convert-to-title="Mint"
				:collateral-ratio="selectedCollateralRatio"
				:liquidation-price="liquidationPrice"
				:from-token="currentlySelectedCollateral"
				:to-token="'NUON'"
				:fee="mintFee"
			/>
			<div class="toggle__transaction">
				<TheButton
					title="Click to go back"
					class="btn--back"
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
import { fromWei, toWei } from "~/utils/bnTools";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "CollateralMint",
	components: {
		TooltipIcon
	},
	props: {
		currentlySelectedCollateral: {
			type: String,
			required: true
		},
		minimumDepositAmount: {
			type: Number,
			required: true,
			default: 0
		}
	},
	data() {
		return {
			selectedCollateralRatio: null,
			collateralPrice: 0,
			inputValue: null,
			estimatedMintedNuonValue: "0",
			activeStep: 1,
			isApproving: false,
			minting: false,
			sliderMin: "0",
			estimatedExtraRequiredCollateral: "0"
		};
	},
	computed: {
		isApproved() {
			return !!parseFloat(this.$store.state.collateralVaultStore.allowance[this.currentlySelectedCollateral]);
		},
		disabledMint() {
			return !this.isApproved || !parseFloat(this.inputValue) || this.isMoreThanBalance || !this.connectedAccount || this.isLTEMinimumDepositAmount;
		},
		isMoreThanBalance() {
			return  parseFloat(this.inputValue) > this.tokenBalance;
		},
		tokenBalance() {
			return this.$store.state.erc20Store.balance[this.currentlySelectedCollateral];
		},
		readyToDeposit() {
			return !!this.inputValue && !this.isMoreThanBalance;
		},
		mintFee() {
			return parseFloat(this.$store.state.collateralVaultStore.mintingFee) * 100;
		},
		decimals() {
			return this.$store.state.erc20Store.decimals[this.currentlySelectedCollateral];
		},
		isLTEMinimumDepositAmount() {
			return parseFloat(this.inputValue) <= this.minimumDepositAmount;
		},
		liquidationPrice() {
			if (!Number(this.inputValue)) return 0;

			if (parseFloat(this.selectedCollateralRatio) === this.sliderMin) return this.collateralPrice * 0.99;

			const targetPeg = this.$store.state.collateralVaultStore.targetPeg;
			const mintedNuon = this.estimatedMintedNuonValue;
			const nounMinBacking = targetPeg * this.sliderMin / 100;
			return nounMinBacking * mintedNuon / this.inputValue;
		}
	},
	watch: {
		inputValue() {
			this.getEstimatedMintedNuon();
		},
		selectedCollateralRatio(newValue) {
			if (newValue) {
				this.getEstimatedMintedNuon();
			}
		},
		currentlySelectedCollateral() {
			this.$store.dispatch("collateralVaultStore/updateStatus");
			this.initialize();
		},
	},
	mounted() {
		this.initialize();
	},
	methods: {
		async initialize() {
			try {
				const chubAddress = this.$store.getters["addressStore/collateralHubs"][this.$store.state.collateralVaultStore.currentCollateralToken];
				const min = await this.$store.getters["collateralVaultStore/getGlobalCR"](chubAddress);
				this.sliderMin = Math.floor(fromWei(min)) + 10;
				this.selectedCollateralRatio = this.sliderMin;
				const collateralPrice = await this.$store.getters["collateralVaultStore/getCollateralPrice"]();
				this.collateralPrice = fromWei(collateralPrice);
			} catch (e) {
				this.failureToast(null, e, "An error occurred");
			}
		},
		sliderChanged(e) {
			this.selectedCollateralRatio = e;
		},
		approveTokens() {
			this.isApproving = true;
			this.$store.dispatch("collateralVaultStore/approveToken",
				{
					tokenSymbol: this.currentlySelectedCollateral,
					onConfirm: () => { },
					onReject: () => { },
					onCallback: () => {
						this.isApproving = false;
					}
				});
		},
		async getEstimatedMintedNuon() {
			if (!this.inputValue) return;
			if (this.isLTEMinimumDepositAmount) return;

			const currentRatio = this.selectedCollateralRatio;
			const collateralRatio = `${(10 ** 18) / (currentRatio / 100)}`;
			const inputValueWithDecimals = toWei(this.inputValue, this.decimals);
			let ans = {0: 0, 3: 0};
			try {
				ans = await this.$store.getters["collateralVaultStore/getEstimateMintedNUONAmount"](inputValueWithDecimals, collateralRatio);
			} catch(e) {
				const message = this.getRPCErrorMessage(e);
				this.failureToast(null, message || e, "An error occurred");
			} finally {
				this.estimatedMintedNuonValue = fromWei(ans[0]);
				this.estimatedExtraRequiredCollateral = fromWei(ans[3], this.$store.state.erc20Store.decimals[this.currentlySelectedCollateral]);
			}
		},
		async mint() {
			this.activeStep = "loading";
			this.minting = true;
			const amount = toWei(this.inputValue, this.decimals);
			const collateralRatioToWei = 10 ** 18 / parseFloat(this.selectedCollateralRatio / 100);

			try {
				await this.$store.dispatch("collateralVaultStore/mintNuon",
					{
						collateralRatio: `${collateralRatioToWei}`,
						collateralAmount: amount,
						onConfirm: (_confNumber, receipt, _latestBlockHash) => {
							this.$store.commit("collateralVaultStore/setUserJustMinted", true);
							this.successToast(null, `You've successfully minted ${parseFloat(this.estimatedMintedNuonValue).toFixed(2)} NUON`, receipt.transactionHash);
							this.$store.dispatch("erc20Store/initializeBalance", {address: this.connectedAccount});
						},
						onReject: (err) => {
							this.failureToast(null, err, "Transaction failed");
						}
					});
			} catch (e) {
				const message = this.getRPCErrorMessage(e);
				this.failureToast(null, message || e, "Minting failed");
			} finally {
				this.minting = false;
				this.activeStep = 1;
			}
		},
		inputMaxBalance() {
			this.inputValue = this.twoDecimalPlaces(this.tokenBalance);
		}
	}
};
</script>
