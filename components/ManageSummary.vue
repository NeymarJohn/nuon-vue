<template>
	<LayoutFlex direction="column" class="u-full-width" border="column">
		<LayoutFlex>
			<CurrencyCard class="u-mb-32" label="Locked Collateral" :value="122" currency="nuMINT" />
			<CurrencyCard label="My Collateralization Ratio" :percent="10" />
		</LayoutFlex>
		<LayoutFlex border="row">
			<CurrencyCard label="Liquidation Price" :value="122" />
			<CurrencyCard label="Liquidation Ratio" :value="122" currency="nuMINT" />
			<CurrencyCard label="Liquidation Position" :value="122" currency="nuMINT" />
		</LayoutFlex>
	</LayoutFlex>
</template>
<script>
export default {
	name: "InputManageCollateral",
	props: {}
};
</script>
