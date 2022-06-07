<template>
	<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
		<template #step-one>
			<DataCard class="u-full-width">
				<div class="u-full-width l-flex l-flex--row-space-between">
					<p class="accordion__available">{{ selectedToken.symbol }} amount</p>
					<p class="accordion__available">Available balance: {{ (selectedToken.balance || 0) | formatLongNumber }}</p>
				</div>
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
						<TheButton :disabled="isMaxInputDisabled(selectedToken ? selectedToken.balance : 0)" size="sm" title="Click to input your max balance" @click="inputMaxBalance">Max</TheButton>
					</div>
				</div>
				<h5 v-if="selectedToken" class="u-mb-0 l-flex--align-self-end">~ ${{ numberWithCommas(getDollarValue(inputValue, selectedToken.price).toFixed(2)) }}</h5>
				<p v-if="readyToDeposit" class="u-is-success l-flex--align-self-end">Ready to deposit</p>
			</DataCard>
			<DataCard class="u-full-width">
				<p class="accordion__available">Estimated NUON minted</p>
				<div class="accordion u-border-radius-10">124.00 NUON</div>
			</DataCard>
			<DataCard class="u-full-width u-mt-24">
				<p class="accordion__available">Set your Collateral Ratio</p>
				<div class="accordion u-border-radius-10">
					<div class="u-full-width l-flex l-flex--row-space-between">
						<p class="accordion__available">Liquidation Price</p>
						<p class="accordion__available">Collateral Ratio</p>
					</div>
					<div class="u-full-width l-flex l-flex--row-space-between">
						<h4>$1495.00</h4>
						<h4 class="u-is-success">204%</h4>
					</div>
					<RangeSlider class="u-mt-24" />
					<div class="u-full-width l-flex l-flex--row-space-between u-mt-24">
						<p class="accordion__available">250%</p>
						<p class="accordion__available">170%</p>
					</div>
					<div class="u-full-width l-flex l-flex--row-space-between">
						<p class="accordion__available">Decrease risk</p>
						<p class="accordion__available">Increase risk</p>
					</div>
				</div>
			</DataCard>
			<div class="toggle__transaction u-mt-24">
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
			<TransactionSummaryChub :values="summary" />
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
import { TOKENS_MAP} from "~/constants/tokens";
import { fromWei, toWei } from "~/utils/bnTools";

export default {
	name: "CollateralMint",
	data() {
		return {
			inputValue: 0,
			mintToken: {},
			depositLockedCollateral: 0,
			estimatedMintedUsxValue: 0,
			maxUsxMinted: 3401,
			activeStep: 1,
			isApproving: false,
			minting: false,
			allCollaterals: [],
			selectedToken: {
				symbol: "ETH",
				balance: 0
			}
		};
	},
	computed: {
		summary() {
			return [
				{
					title: "Collateral to Deposit",
					val: this.depositLockedCollateral,
					currency: this.mintToken.symbol,
					dollar: this.getDollarValue(this.depositLockedCollateral, this.mintToken.price)
				},
				{
					title: "Maximum Minted Nuon",
					val: this.estimatedMintedUsxValue,
					currency: "Nuon",
					dollar: this.getDollarValue(this.estimatedMintedUsxValue, this.tokenPrices.USX)
				},
				{
					title: "Fee",
					val: `${this.mintingFee * 100}%`,
					dollar: this.getDollarValue(this.getDollarValue(this.depositLockedCollateral, this.mintingFee), this.tokenPrices[this.mintToken.symbol]),
				},
				{
					title: "Total Received",
					val: this.numberWithCommas((this.depositLockedCollateral * (1 - this.mintingFee)).toFixed(2)),
					currency: this.mintToken.symbol,
					dollar: this.getDollarValue(this.getDollarValue(this.depositLockedCollateral, (1 - this.mintingFee)), this.tokenPrices[this.mintToken.symbol]),
				}
			];
		},
		isApproved() {
			return !!this.$store.state.collateralVaultStore.allowance[this.mintToken.symbol];
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
		}
	},
	mounted () {
		// await this.$store.getters["collateralVaultStore/getCollaterals"]();
		this.allCollaterals = [];
		// const hxPrice = this.tokenPrices[HX.symbol];
		// this.mintToken.price = hxPrice;
	},
	methods: {
		selectClaimToken(token) {
			const price = this.tokenPrices[token.symbol];
			const balance = this.tokenBalances[token.symbol];
			const selectedTokenAddress = TOKENS_MAP[token.symbol].address;
			const cid = this.allCollaterals.findIndex(c => c === selectedTokenAddress);
			this.mintToken = {...token, price, cid, balance, symbol: token.symbol};
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
			this.estimatedMintedUsxValue = fromWei(estimatedValue[0]);
		},
		getEstimatedMintedUsx() {
			// const selectedTokenAddress = TOKENS_MAP[this.mintToken.symbol].address;
			// const cid = this.allCollaterals.findIndex(c => c === selectedTokenAddress);
			// if (cid < 0) return 0;
			// const estimatedMintedUsx  =  await this.$store.getters["collateralVaultStore/getEstimatedMintedUSXAmount"](toWei(this.depositLockedCollateral ,this.$store.state.erc20Store.decimals[this.mintToken.symbol]), cid);
			return 0;
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
						this.successToast(null, `You've successfully minted ${this.estimatedMintedUsxValue} Nuon`, receipt.transactionHash);
					},
					onReject: (err) => {
						this.failureToast(null, err, "Transaction failed");
					}
				});
			this.minting = false;
			this.activeStep = 1;
		}
	}
};
</script>
