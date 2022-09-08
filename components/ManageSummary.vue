<template>
	<LayoutFlex direction="column" class="u-full-width" border="column">
		<LayoutFlex border="row">
			<CurrencyCard class="u-mb-32" label="Locked Collateral" :value="lockedCollateral" :currency="collateral" />
			<CurrencyCard class="u-mb-32" label="NUON Minted" :value="mintedNuon" currency="NUON" />
			<CurrencyCard class="u-mb-32" label="Collateralization Ratio" :percent="collateralRatio" />
		</LayoutFlex>
		<LayoutFlex border="row">
			<CurrencyCard label="Liquidation Price" :value="liquidationPrice" symbol="$" />
			<CurrencyCard label="Liquidation Ratio" :value="globalRatio" currency="%" />
			<CurrencyCard label="Liquidity Position" :value="liquidationPosition" currency="%" />
		</LayoutFlex>
	</LayoutFlex>
</template>
<script>
export default {
	name: "InputManageCollateral",
	props: {
		collateral: {
			type: String,
			required: true,
		},
	},
	computed: {
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
		}
	},
};
</script>
