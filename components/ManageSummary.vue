<template>
	<LayoutFlex direction="column" class="u-full-width" border="column">
		<LayoutFlex border="row">
			<CurrencyCard 
				class="u-mb-32" 
				label="Locked Collateral" 
				:value="lockedCollateral" 
				:currency="collateral" 
				:badge="estimation['lockedCollateral']" 
				:badge-currency="collateral" 
				:badge-color="calcBadgeColor(lockedCollateral,estimation['lockedCollateral']) "
			/>
			<CurrencyCard 
				class="u-mb-32" 
				label="NUON Minted" 
				:value="mintedNuon" 
				currency="NUON" 
				:badge="estimation['mintedNuon']" 
				:badge-currency="'NUON'" 
				:badge-color="calcBadgeColor(mintedNuon,estimation['mintedNuon'])" />
			<CurrencyCard 
				class="u-mb-32" 
				label="Collateralization Ratio" 
				:value="collateralRatio" 
				currency="%" 
				:badge="estimation['collateralRatio']" 
				badge-currency="%" 
				:badge-color="calcBadgeColor(collateralRatio,estimation['collateralRatio'])" />
		</LayoutFlex>
		<LayoutFlex border="row">
			<CurrencyCard 
				label="Liquidation Price" 
				:value="liquidationPrice" 
				symbol="$" 
				:badge="estimation['liquidationPrice']" 
				badge-currency="USD" 
				:badge-color="calcBadgeColor(liquidationPrice,estimation['liquidationPrice'])" />
			<CurrencyCard 
				label="Liquidation Ratio" 
				:value="globalRatio" 
				currency="%" 
				badge-currency="%" 
				:badge-color="calcBadgeColor(globalRatio,estimation['liquidationRatio'])" />
			<CurrencyCard 
				label="Liquidity Position" 
				:value="getDollarValue(lpAmountOfUser, tokenPrices[collateral])" 
				symbol="$" 
				badge-currency="USD" 
				:badge-color="calcBadgeColor(getDollarValue(lpAmountOfUser, tokenPrices[collateral]),estimation['liquidationRatio'])" />
		</LayoutFlex>
	</LayoutFlex>
</template>
<script>
export default {
	name: "ManageSummary",
	props: {
		collateral: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			lockedCollateralAfter: 5.47,
			// estimation: { }
		};
	},
	computed: {
		estimation() {
			return this.$store.state.collateralVaultStore.estimation;
		},
		lockedCollateral() {
			return this.$store.state.collateralVaultStore.lockedAmount[this.collateral]; 
		},
		mintedNuon() {
			return this.$store.state.collateralVaultStore.mintedAmount[this.collateral];
		},
		collateralRatio() {
			return this.$store.state.collateralVaultStore.collateralRatio[this.collateral];
		},
		liquidationPrice() {
			const targetPeg = this.$store.state.collateralVaultStore.targetPeg;
			const mintedNuon = this.mintedNuon;
			if (!this.lockedCollateral) return 0;
			if ([targetPeg, mintedNuon, this.globalRatio].some(v => v === null || v === undefined)) return 0;
			const minimumCollateralRatio = Math.floor(this.globalRatio) + 10;
			const nounMinBacking = targetPeg * minimumCollateralRatio / 100;
			return nounMinBacking * mintedNuon / this.lockedCollateral;
		},
		globalRatio() {
			return this.$store.state.collateralVaultStore.globalRatio[this.collateral];
		},
		liquidationRatio() {
			return this.$store.state.collateralVaultStore.collateralRatio[this.collateral];
		},
		liquidationPosition() {
			return this.$store.state.collateralVaultStore.collateralRatio[this.collateral];
		},
		lpAmountOfUser() {
			return this.$store.state.collateralVaultStore.lpValueOfUser[this.collateral];
		}
	},
	methods: {
		calcBadgeColor(current, estimation) {
			if (current !== estimation) return "green";
			return "grey";
		}
	},
};
</script>
