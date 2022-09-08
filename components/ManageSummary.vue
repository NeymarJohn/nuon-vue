<template>
	<LayoutFlex direction="column" class="u-full-width" border="column">
		<LayoutFlex border="row">
			<CurrencyCard class="u-mb-32" label="Locked Collateral" :value="122" currency="WETH" />
			<CurrencyCard class="u-mb-32" label="NUON Minted" :value="122" currency="NUON" />
			<CurrencyCard class="u-mb-32" label="Collateralization Ratio" :percent="10" />
		</LayoutFlex>
		<LayoutFlex border="row">
			<CurrencyCard label="Liquidation Price" :value="122" symbol="$" />
			<CurrencyCard label="Liquidation Ratio" :value="122" currency="%" />
			<CurrencyCard label="Liquidity Position" :value="122" currency="%" />
		</LayoutFlex>
	</LayoutFlex>
</template>
<script>
export default {
	name: "InputManageCollateral",
	props: {}
};
</script>
