<template>
	<div class="collateral-table">
		<LayoutFlex direction="row-center-space-between u-mb-16">
			<h5 class="u-colour-light-grey">Locked Collateral</h5>
			<h4><AccelerateIcon /> {{ tokens.length }}</h4>
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
			<div v-for="(token, index) in tokens" :key="index" class="collateral-table__row" role="rowgroup">
				<div class="collateral-table__cell" role="cell">
					<TokePlaceholderIcon />
					<h5>{{ token.token }}</h5>
				</div>
				<div class="collateral-table__cell" role="cell">
					<h5>{{ numberWithCommas(token.amount.toFixed(2)) }} {{ token.symbol.toUpperCase() }}</h5>
				</div>
				<div class="collateral-table__cell" role="cell">
					<h5>${{ numberWithCommas(token.value.toFixed(2)) }}</h5>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AccelerateIcon from "@/assets/images/svg/svg-accelerate.svg";
import TokePlaceholderIcon from "@/assets/images/svg/svg-token-placeholder.svg";

export default {
	name: "CollateralTable",
	components: {
		AccelerateIcon,
		TokePlaceholderIcon
	},
	data() {
		return {
			tokens: [
				{ token: "Hydrogen X", symbol: "HX", amount: 1800.27, value: 232.50 },
				{ token: "ABC X", symbol: "ABC", amount: 20.27, value: 10.50 },
				{ token: "EF X", symbol: "EF", amount: 10.34, value: 5.26 },
				{ token: "TerraUSD", symbol: "USX", amount: 5.34, value: 2.26 },
				{ token: "Ion", symbol: "ION", amount: 2.34, value: 1.26 },
				{ token: "Luna", symbol: "LUNA", amount: 2.34, value: 1.26 }
			],
		};
	},
};
</script>
