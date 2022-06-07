<template>
	<LayoutContainer>
		<PageTitle class="u-mb-48">
			<h4>Collateral Hub</h4>
			<h1>Borrow Nuon Against Your Favourite Crypto Assets</h1>
		</PageTitle>
		<LayoutFlex direction="row-wrap-start">
			<BorrowCard
				token="ETH"
				:mint="151000"
				:ratio="170"
				:tvl="1234" />
			<BorrowCard
				token="WBTC"
				:mint="200000"
				:ratio="170"
				:tvl="1234" />
			<BorrowCard
				token="USDC"
				:mint="10000"
				:ratio="170"
				:tvl="1234" />
			<BorrowCard
				token="ETH"
				:mint="151000"
				:ratio="170"
				:tvl="1234" />
			<BorrowCard
				token="WBTC"
				:mint="200000"
				:ratio="170"
				:tvl="1234" />
			<BorrowCard
				token="USDC"
				:mint="10000"
				:ratio="170"
				:tvl="1234" />
		</LayoutFlex>
	</LayoutContainer>
</template>

<script>
export default {
	name: "CollateralHub",
	head() {
		return {
			title: "Collateral Hub | Nuon"
		};
	},
};
</script>
