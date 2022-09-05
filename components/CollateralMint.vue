<template>
	<LayoutContainer size="sm" class="u-pt-0">
		<div class="swap">
			<div class="swap__container u-mb-8">
				<SwapBalance
					label="Deposit"
					:token="input.token" />
				<MintAccordion
					:disabled-tokens="[input.token, 'BTC', 'BUSD', 'AVAX']"
					:default-token="input.token"
					@selected-token="selectInputToken">
					<InputMax v-model="inputValue" :maximum="tokenBalances[input.token]" @click="inputMaxBalance" />
					<LayoutFlex direction="row-justify-end">
						<p class="u-mb-0 u-font-size-14">~ ${{ getPrice(inputValue, collateralPrice) | toFixed | numberWithCommas }}</p>
					</LayoutFlex>
				</MintAccordion>
				<p v-if="isMoreThanBalance" class="u-is-warning l-flex--align-self-end">Insufficient balance</p>
				<p v-if="isLTEMinimumDepositAmount" class="u-is-warning l-flex--align-self-end">Please deposit more than {{ minimumDepositAmount }}</p>
			</div>
			<div class="swap__container u-mb-24">
				<div class="swap__balance">
					<label>Mint</label>
				</div>
				<div class="swap__wrapper">
					<div class="swap__return">
						<img src="~/assets/images/borrow/NUON.png" alt="NUON logo">
						<div class="swap__token">
							<h5>NUON</h5>
						</div>
					</div>
					<h3>{{numberWithCommas(estimatedMintedNuonValue | toFixed)}}<sup>NUON</sup></h3>
				</div>
			</div>
			<div class="collateral">
				<div class="collateral__header">
					<p>Set your Collateral Ratio<TooltipIcon v-tooltip="'Enter content here'" /></p>
					<TheButton size="link" title="Click to view advanced options" @click="isVisible = !isVisible">{{ isVisible ? "Basic" : "Advanced" }}</TheButton>
				</div>
				<div v-if="isVisible !== true" class="collateral__body">
					<TheButton title="Click to select high risk">200% <span>High Risk</span></TheButton>
					<TheButton title="Click to select medium risk">300% <span>Medium Risk</span></TheButton>
					<TheButton title="Click to select low risk">400% <span>Low Risk</span></TheButton>
				</div>
				<div v-else class="collateral__body">
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
			</div>
			<TransactionSummary v-if="inputValue > 0" :values="summary" />
			<TheButton
				title="Click to mint"
				:disabled="minting"
				@click="mint">
				Mint
			</TheButton>
		</div>
	</LayoutContainer>
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
			isVisible: false,
			selectedCollateralRatio: null,
			collateralPrice: 0,
			inputValue: null,
			estimatedMintedNuonValue: "0",
			isApproving: false,
			minting: false,
			sliderMin: "0",
			estimatedExtraRequiredCollateral: "0",
			input: {
				value: "",
				token: "WETH"
			},
			output: {
				value: "",
				token: ""
			},
		};
	},
	computed: {
		summary() {
			return [
				{
					title: "Estimated total NUON minted",
					val: this.numberWithCommas(this.estimatedMintedNuonValue | this.toFixed),
					currency: "NUON",
				},
				{
					title: "Estimated extra required collateral",
					val: this.numberWithCommas(this.estimatedExtraRequiredCollateral | this.toFixed),
					currency: "WETH",
				},
				{
					title: "Collateral ratio",
					val: this.selectedCollateralRatio,
					currency: "%",
				},
				{
					title: "Liquidation price",
					val: this.liquidationPrice | this.toFixed,
					currency: "USD",
				},
				{
					title: "Fee",
					val: this.mintFee,
					currency: "%",
				},
			];
		},
		disabledMint() {
			return !parseFloat(this.inputValue) || this.isMoreThanBalance || !this.connectedAccount || this.isLTEMinimumDepositAmount;
		},
		isMoreThanBalance() {
			return  parseFloat(this.inputValue) > this.tokenBalance;
		},
		tokenBalance() {
			return this.$store.state.erc20Store.balance[this.currentlySelectedCollateral];
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
		},
		currentCollateralToken() {
			return this.$store.state.collateralVaultStore.currentCollateralToken;
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
		currentCollateralToken() {
			this.$store.dispatch("collateralVaultStore/updateStatus");
			this.initialize();
		}
	},
	mounted() {
		this.initialize();
	},
	methods: {
		async initialize() {
			if (!this.isConnectedWallet) return;
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
			}
		},
		inputMaxBalance() {
			this.inputValue = this.twoDecimalPlaces(this.tokenBalance);
		},
		selectInputToken(token) {
			this.input.token = token.symbol;
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
	}
};
</script>
