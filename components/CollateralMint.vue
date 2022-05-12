<template>
	<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
		<template #step-one>
			<div class="toggle__content">
				<h5 class="u-mb-12">Select Your Collateral Token To Deposit</h5>
				<CollateralClaimAccordion
					:token="mintToken"
					:default-value="depositLockedCollateral"
					@selected-token="selectClaimToken"
					@change-input="changeMintValue"
				/>
			</div>
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
			<TransactionSummary :values="summary" />
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
import { HX, TOKENS_MAP} from "~/constants/tokens";
import { fromWei, toWei } from "~/utils/bnTools";

export default {
	name: "CollateralMint",
	data() {
		return {
			mintToken: {
				symbol: HX.symbol,
				price: 0,
				balance: 0
			},
			depositLockedCollateral: 0,
			estimatedMintedUsxValue: 0,
			maxUsxMinted: 3401,
			activeStep: 1,
			isApproving: false,
			minting: false,
			allCollaterals: []
		};
	},
	computed: {
		summary() {
			return [
				{
					title: "Collateral to Deposit",
					val: this.numberWithCommas(parseFloat(this.depositLockedCollateral).toFixed(2)),
					currency: this.mintToken.symbol,
					dollar: this.numberWithCommas(this.getDollarValue(this.depositLockedCollateral, this.mintToken.price).toFixed(2))
				},
				{
					title: "Maximum Minted USX",
					val: this.numberWithCommas(this.estimatedMintedUsxValue.toFixed(2)),
					currency: "USX",
					dollar: this.numberWithCommas(this.getDollarValue(this.estimatedMintedUsxValue, this.tokenPrices.USX).toFixed(2))
				},
				{
					title: "Fee",
					val: `${this.mintingFee * 100}%`,
					dollar: this.numberWithCommas(this.getDollarValue(parseFloat(this.depositLockedCollateral) * this.mintingFee, this.tokenPrices[this.mintToken.symbol]).toFixed(2))
				},
				{
					title: "Total Received",
					val: this.numberWithCommas((this.depositLockedCollateral * (1 - this.mintingFee)).toFixed(2)),
					currency: this.mintToken.symbol,
					dollar: this.numberWithCommas(this.getDollarValue(this.depositLockedCollateral * (1 - this.mintingFee), this.tokenPrices[this.mintToken.symbol]).toFixed(2))
				}
			];
		},
		isApproved() {
			return !!this.$store.state.collateralVaultStore.allowance[this.mintToken.symbol];
		},
		disabledMint() {
			return !this.isApproved || !this.depositLockedCollateral || this.depositLockedCollateral > this.tokenBalance;
		},
		tokenBalance() {
			const symbol = this.mintToken.symbol;
			return parseFloat(this.$store.state.erc20Store.balance[symbol]) / this.$store.state.erc20Store.decimals[symbol];
		},
		mintingFee() {
			return this.$store.state.collateralVaultStore.mintingFee;
		},
	},
	async mounted () {
		this.allCollaterals = await this.$store.getters["collateralVaultStore/getCollaterals"]();
		const hxPrice = this.tokenPrices[HX.symbol];
		this.mintToken.price = hxPrice;
	},
	methods: {
		selectClaimToken(token) {
			const price = this.tokenPrices[token.symbol];
			const balance = fromWei(this.$store.state.erc20Store.balance[token.symbol], this.$store.state.erc20Store.decimals[token.symbol]);
			const selectedTokenAddress = TOKENS_MAP[this.mintToken.symbol].address;
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
		async getEstimatedMintedUsx() {
			const selectedTokenAddress = TOKENS_MAP[this.mintToken.symbol].address;
			const cid = this.allCollaterals.findIndex(c => c === selectedTokenAddress);
			if (cid < 0) return 0;
			const estimatedMintedUsx  =  await this.$store.getters["collateralVaultStore/getEstimatedMintedUSXAmount"](toWei(this.depositLockedCollateral ,this.$store.state.erc20Store.decimals[this.mintToken.symbol]), cid);
			return estimatedMintedUsx;
		},
		async mint() {
			this.minting = true;
			const selectedTokenAddress = TOKENS_MAP[this.mintToken.symbol].address;
			const cid = this.allCollaterals.findIndex(c => c === selectedTokenAddress);
			const amount = toWei(this.depositLockedCollateral, this.$store.state.erc20Store.decimals[this.mintToken.symbol]);
			this.mintToken = {...this.mintToken, cid};
			await this.$store.dispatch("collateralVaultStore/mint",
				{
					amount,
					cid,
					onConfirm: (txHash) => {
						this.$store.commit("collateralVaultStore/setUserJustMinted", true);
						this.successToast(null, "You've successfully minted USX", txHash);
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
