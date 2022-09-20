<template>
	<div class="swap">
		<div class="swap__container u-mb-8">
			<SwapBalance
				label="Deposit"
				:token="selectedCollateral" />
			<MintAccordion
				:disabled-tokens="[selectedCollateral, 'BTC', 'BUSD', 'AVAX']"
				:default-token="selectedCollateral"
				@selected-token="selectInputToken">
				<template #input>
					<InputMax v-model="inputValue" :maximum="tokenBalances[selectedCollateral]" @click="inputMaxBalance" />
				</template>
				<template #messages>
					<LayoutFlex direction="row-center-space-between">
						<div>
							<p v-if="isMoreThanEqualMinimum && isLessThanEqualBalance" class="u-font-size-14 u-is-success u-mb-0">Ready To Mint</p>
							<p v-if="isMoreThanBalance" class="u-font-size-14 u-is-warning u-mb-0">Insufficient Balance</p>
							<p v-if="isLTEMinimumDepositAmount" class="u-font-size-14 u-is-warning u-mb-0">Please Deposit More Than {{ minimumDepositAmount }} {{ selectedCollateral }}</p>
						</div>
						<p class="u-mb-0 u-font-size-14 u-color-light-grey">~ ${{ getDollarValue(inputValue, collateralPrice) | toFixed | numberWithCommas }}</p>
					</LayoutFlex>
				</template>
			</MintAccordion>
		</div>
		<div class="swap__container u-mb-24">
			<div class="swap__balance">
				<label>Mint</label>
			</div>
			<div class="swap__wrapper">
				<div class="swap__return">
					<NuonLogo />
					<div class="swap__token">
						<h5>NUON</h5>
					</div>
				</div>
				<h3>{{estimatedMintedNuonValue | toFixed | numberWithCommas}}<sup>NUON</sup></h3>
			</div>
		</div>
		<div class="collateral">
			<div class="collateral__header">
				<p>Set your Collateral Ratio<TooltipIcon v-tooltip="'Enter content here'" /></p>
				<TheButton size="link" title="Click to view advanced options" @click="isVisible = !isVisible">{{ isVisible ? "Basic" : "Advanced" }}</TheButton>
			</div>
			<div v-if="isVisible !== true" class="collateral__body">
				<TheButton v-for="(ratio, index) in ratios" :key="ratio.index" :class="{'is-active': (index === selectedRatio)}" :title="`Click to select ${ratio.label.toLowerCase()}`" @click="selectRatio(index)">
					{{ ratio.value }}% <span>{{ ratio.label }}</span>
				</TheButton>
			</div>
			<div v-else class="collateral__body">
				<RangeSlider :min="`${sliderMin}`" :max="'1000'" :slider-disabled="!inputValue || isMoreThanBalance" :selected-collateral-ratio="`${selectedCollateralRatio}`" @emit-change="debouncedSliderChanged" />
			</div>
		</div>
		<TransactionSummary v-if="inputValue > 0" :values="summary" />
		<LayoutFlex direction="row-justify-end">
			<TheButton
				title="Click to mint"
				:disabled="isMintDisabled"
				@click="mint">
				Mint
			</TheButton>
		</LayoutFlex>
	</div>
</template>

<script>
import debounce from "lodash.debounce";
import { DEFAULT_BASIC_RATIO } from "../constants/web3";
import { fromWei, toWei } from "~/utils/bnTools";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";
import NuonLogo from "@/assets/images/logo/logo-numint.svg";

export default {
	name: "CollateralMint",
	components: {
		TooltipIcon,
		NuonLogo
	},
	props: {
		minimumDepositAmount: {
			type: Number,
			required: true,
			default: 0
		}
	},
	data() {
		return {
			isVisible: false,
			selectedCollateralRatio: DEFAULT_BASIC_RATIO,
			inputValue: null,
			estimatedMintedNuonValue: "0",
			isApproving: false,
			minting: false,
			estimatedExtraRequiredCollateral: "0",
			selectedCollateral: "WETH",
			ratios: [
				{
					label: "High Risk",
					value: 200
				},
				{
					label: "Medium Risk",
					value: 300,
				},
				{
					label: "Low Risk",
					value: 400
				}
			],
			selectedRatio: 1
		};
	},
	computed: {
		summary() {
			return [
				{
					title: "Estimated total NUON minted",
					val: this.numberWithCommas((Number(this.estimatedMintedNuonValue).toFixed(2))),
					currency: "NUON",
				},
				{
					title: "Estimated extra required collateral",
					val: this.numberWithCommas(Number(this.estimatedExtraRequiredCollateral).toFixed(2)),
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
		isMintDisabled() {
			return !parseFloat(this.inputValue) || this.isMoreThanBalance || !this.connectedAccount || this.isLTEMinimumDepositAmount;
		},
		isMoreThanEqualMinimum() {
			return this.inputValue >= this.isLTEMinimumDepositAmount;
		},
		isMoreThanBalance() {
			return parseFloat(this.inputValue) > this.tokenBalance;
		},
		isLessThanEqualBalance() {
			return parseFloat(this.inputValue) <= this.tokenBalance;
		},
		tokenBalance() {
			return this.$store.state.erc20Store.balance[this.selectedCollateral];
		},
		mintFee() {
			return parseFloat(this.$store.state.collateralVaultStore.mintingFee) * 100;
		},
		decimals() {
			return this.$store.state.erc20Store.decimals[this.selectedCollateral];
		},
		isLTEMinimumDepositAmount() {
			return parseFloat(this.inputValue) <= this.minimumDepositAmount;
		},
		liquidationPrice() {
			if (!Number(this.inputValue)) return 0;

			if (parseFloat(this.selectedCollateralRatio) === this.sliderMin) return this.collateralPrice * 0.99;

			const targetPeg = this.$store.state.collateralVaultStore.targetPeg;
			const mintedNuon = Number(this.estimatedMintedNuonValue);
			const nounMinBacking = targetPeg * this.sliderMin / 100;
			return nounMinBacking * mintedNuon / Number(this.inputValue);
		},
		collateralPrice() {
			return this.tokenPrices[this.selectedCollateral];
		},
		sliderMin() {
			return Math.floor(this.$store.state.collateralVaultStore.globalRatio[this.selectedCollateral]) + 10;
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
		isVisible(newValue) {
			if (newValue) {
				this.selectedCollateralRatio = this.sliderMin;
			} else {
				this.selectedCollateralRatio = DEFAULT_BASIC_RATIO;
				this.selectedRatio = 1;
			}
		}
	},
	mounted() {
		this.initialize();
	},
	methods: {
		initialize() {
			if (!this.isConnectedWallet) return;
			try {
				this.selectedCollateralRatio = DEFAULT_BASIC_RATIO;
			} catch (e) {
				this.failureToast(null, e, "An error occurred");
			}
		},
		debouncedSliderChanged: debounce(function(e) {
			this.sliderChanged(e);
		}, 500),
		sliderChanged(e) {
			this.selectedCollateralRatio = e;
		},
		async getEstimatedMintedNuon() {
			if (!this.inputValue){
				this.estimatedMintedNuonValue = 0;
				return;
			}
			if (this.isLTEMinimumDepositAmount) return;

			const currentRatio = this.selectedCollateralRatio;
			const collateralRatio = `${(10 ** 18) / (currentRatio / 100)}`;
			const inputValueWithDecimals = toWei(this.inputValue, this.decimals);
			let ans = {0: 0, 3: 0};
			try {
				ans = await this.$store.getters["collateralVaultStore/getEstimateMintedNUONAmount"](this.selectedCollateral, inputValueWithDecimals, collateralRatio);
			} catch(e) {
				const message = this.getRPCErrorMessage(e);
				this.failureToast(null, message || e, "An error occurred");
			} finally {
				this.estimatedMintedNuonValue = fromWei(ans[0]);
				this.estimatedExtraRequiredCollateral = fromWei(ans[3], this.$store.state.erc20Store.decimals[this.selectedCollateral]);
			}
		},
		async mint() {
			this.minting = true;
			const amount = toWei(this.inputValue, this.decimals);
			const collateralRatioToWei = 10 ** 18 / parseFloat(this.selectedCollateralRatio / 100);

			try {
				await this.$store.dispatch("collateralVaultStore/mintNuon",
					{
						collateralToken: this.selectedCollateral,
						collateralRatio: `${collateralRatioToWei}`,
						collateralAmount: amount,
						onConfirm: (_confNumber, receipt, _latestBlockHash) => {
							this.$store.commit("collateralVaultStore/setUserJustMinted", true);
							this.successToast(null, `You successfully minted ${parseFloat(this.estimatedMintedNuonValue).toFixed(2)} NUON`, receipt.transactionHash);
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
			}
		},
		inputMaxBalance() {
			this.inputValue = this.twoDecimalPlaces(this.tokenBalance);
		},
		selectInputToken(token) {
			this.selectedCollateral = token.symbol;
		},
		selectOutputToken(token) {
			this.output.token = token.symbol;
		},
		onInputKeyUp(changedValue) {
			this.changedValue = changedValue;
		},
		getPrice(token, value) {
			return this.getDollarValue(this.tokenPrices[token], value) || 0;
		},
		selectRatio (i) {
			this.selectedRatio = i;
			this.ratios.forEach((ratio, index) => {
				ratio.isActive = (index === i);
				this.selectedCollateralRatio = this.ratios[i].value;
			});
		}
	}
};
</script>
