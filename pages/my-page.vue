<template>
	<LayoutContainer>
		<PageTitle class="u-mb-48">
			<h4>Dashboard</h4>
			<h1>My Page</h1>
		</PageTitle>
		<h2 class="u-mb-24">Account Balance</h2>
		<div class="l-chart l-chart--account-balance">
			<LayoutFlex>
				<div class="chart">
					<p>TVL</p>
					<h1>$6,126,304</h1>
					<p class="u-colour-white u-mb-16">Apr 14, 2022</p>
					<LineChart />
				</div>
				<div class="chart chart--donut">
					<p class="u-mb-4">Collateral Distribution</p>
					<p class="u-colour-white u-mb-16">Apr 14, 2022</p>
					<DonutChart class="u-mb-24" />
					<p>APY <TooltipIcon v-tooltip="'Enter APY tooltip content here.'" /></p>
					<h3 class="u-mb-24">Inflation 34.3%</h3>
					<p>Collateralization Ratio <TooltipIcon v-tooltip="'Enter collateralization ratio tooltip content here.'" /></p>
					<h3>150%</h3>
				</div>
			</LayoutFlex>
		</div>
	</LayoutContainer>
</template>

<script>
export default {
	name: "MyPage",
	head () {
		return {
			title: "My Page | Nuon"
		};
	},
};
</script>
