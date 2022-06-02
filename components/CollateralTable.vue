<template>
	<div class="collateral-table">
		<LayoutFlex direction="row-center-space-between u-mb-16">
			<h5 class="u-colour-light-grey">Locked Collateral</h5>
			<h4><AccelerateIcon /> {{ allCollaterals.length }}</h4>
		</LayoutFlex>
		<div class="collateral-table__container" role="table" aria-label="Collaterals">
			<div class="collateral-table__row" role="rowgroup">
				<div class="collateral-table__cell" role="columnheader">
					<h5>Tokens</h5>
				</div>
				<div class="collateral-table__cell" role="columnheader">
					<h5>Amount</h5>
				</div>
				<div class="collateral-table__cell" role="columnheader">
					<h5>Locked Value</h5>
				</div>
			</div>
			<div v-for="(token, index) in allCollaterals" :key="index" class="collateral-table__row" role="rowgroup">
				<div class="collateral-table__cell" role="cell">
					<TokePlaceholderIcon />
					<h5>{{ token.symbol }}</h5>
				</div>
				<div class="collateral-table__cell" role="cell">
					<h5>{{ token.amount && numberWithCommas(token.amount.toFixed(2)) }} {{ token.symbol && token.symbol.toUpperCase() }}</h5>
				</div>
				<div class="collateral-table__cell" role="cell">
					<h5>${{ token.value && numberWithCommas(parseFloat(token.value).toFixed(2)) }}</h5>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AccelerateIcon from "@/assets/images/svg/svg-accelerate.svg";
import TokePlaceholderIcon from "@/assets/images/svg/svg-token-placeholder.svg";
import {TOKENS_MAP} from "@/constants/tokens";
import { fromWei } from "~/utils/bnTools";

export default {
	name: "CollateralTable",
	components: {
		AccelerateIcon,
		TokePlaceholderIcon
	},
	data() {
		return {
			collateralPrices: {},
			tokens: Object.values(TOKENS_MAP),
			collateralTVL: {},
			collateralAddresses: []
		};
	},
	computed: {
		allCollaterals() {
			const collaterals = this.collateralAddresses.map(c => {
				const tokenDetails = this.tokens.find(t => t.address === c);
				const symbol = (tokenDetails && tokenDetails.symbol) || "HX";
				const price = this.collateralPrices[c] * (10 ** 18) / (10 ** this.$store.state.erc20Store.decimals[symbol]);
				const TVL = (this.collateralTVL[c] * (10 ** 18) / (10 ** this.$store.state.erc20Store.decimals[symbol])) || 0;
				const amount = (TVL/price) || 0;
				return	{...tokenDetails, amount, value: TVL};
			});
			return  collaterals.filter(t => t.symbol && t.amount);
		},
	},
	async mounted() {
		this.collateralAddresses = await this.$store.getters["collateralVaultStore/getCollaterals"]();
		const collateralPrices = await Promise.all(this.collateralAddresses.map(c => this.$store.getters["collateralVaultStore/getCollateralPriceDeprecated"](c)));
		this.collateralAddresses.forEach((a, i) => this.$set(this.collateralPrices, a, fromWei(collateralPrices[i])));
		const collateralTVL = await Promise.all(this.collateralAddresses.map((_, i) => this.$store.getters["collateralVaultStore/getAmountsStakedInVault"](i)));
		this.collateralAddresses.forEach((a, i) => this.$set(this.collateralTVL, a, fromWei(collateralTVL[i])));
	},
};
</script>
