<template>
	<LayoutContainer>
		<PageTitle class="u-mb-48">
			<h4>Collateral Hub</h4>
			<h1>Borrow Nuon Against Your Favourite Crypto Assets</h1>
		</PageTitle>
		<LayoutFlex direction="row-wrap-start">
			<BorrowCard />
			<BorrowCard />
			<BorrowCard />
			<BorrowCard />
			<BorrowCard />
			<BorrowCard />
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
