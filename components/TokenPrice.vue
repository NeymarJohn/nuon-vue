<template>
	<div>
		<h2 class="u-mb-24">Token Price</h2>
		<div class="l-chart l-chart--token-price">
			<TheTabs>
				<TheTab title="HX">
					<LayoutFlex>
						<div class="chart">
							<p>Market Cap</p>
							<h3 class="u-mb-48">$39,887,462</h3>
							<p>Circulating Supply</p>
							<h3 class="u-mb-48">$12,343,334.34</h3>
							<p>Price</p>
							<h3>1.03<sup>HX</sup></h3>
						</div>
						<div class="chart">
							<p>Price</p>
							<h1>1.03<sup>HX</sup></h1>
							<p class="u-colour-white">Apr 14, 2022</p>
							<LineChart />
						</div>
					</LayoutFlex>
				</TheTab>
				<TheTab title="USX">
					<LayoutFlex>
						<div class="chart">
							<p>Market Cap</p>
							<h3 class="u-mb-48">$39,887,462</h3>
							<p>Circulating Supply</p>
							<h3 class="u-mb-48">$12,343,334.34</h3>
							<p>Price</p>
							<h3>1.03<sup>USX</sup></h3>
						</div>
						<div class="chart">
							<p>Price</p>
							<h1>1.03<sup>USX</sup></h1>
							<p class="u-colour-white">Apr 14, 2022</p>
							<LineChart />
						</div>
					</LayoutFlex>
				</TheTab>
			</TheTabs>
		</div>
	</div>
</template>

<script>
export default {
	name: "TokenPrice",
};
</script>
