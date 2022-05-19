<template>
	<div>
		<h2 class="u-mb-24">Token Price</h2>
		<div class="l-chart l-chart--token-price">
			<TheTabs margin="24">
				<TheTab title="HX">
					<LayoutFlex>
						<div class="chart">
							<p>Market Cap <TheBadge color="price-down" class="u-ml-8">-1.79%</TheBadge></p>
							<h3 class="u-mb-48">$39,887,462</h3>
							<p>Circulating Supply <TheBadge color="price-up" class="u-ml-8">+1.79%</TheBadge></p>
							<h3 class="u-mb-48">$12,343,334.34</h3>
							<p>Price <TheBadge color="price-up" class="u-ml-8">+1.79%</TheBadge></p>
							<h3>1.03<sup>HX</sup></h3>
						</div>
						<div class="chart chart--token-price">
							<div class="chart__overview">
								<p>Price</p>
								<h1>1.03<sup>HX</sup></h1>
								<p class="u-colour-white">Apr 14, 2022</p>
							</div>
							<TheTabs size="thin" color="light" margin="0">
								<TheTab title="Price">
									<TheTabs size="thin" color="light" margin="absolute">
										<TheTab title="D">
											<LineChart />
										</TheTab>
										<TheTab title="W">
											<LineChart />
										</TheTab>
										<TheTab title="M">
											<LineChart />
										</TheTab>
									</TheTabs>
								</TheTab>
								<TheTab title="Market Cap">
									<TheTabs size="thin" color="light" margin="absolute">
										<TheTab title="D">
											<LineChart />
										</TheTab>
										<TheTab title="W">
											<LineChart />
										</TheTab>
										<TheTab title="M">
											<LineChart />
										</TheTab>
									</TheTabs>
								</TheTab>
								<TheTab title="Circulating Supply">
									<TheTabs size="thin" color="light" margin="absolute">
										<TheTab title="D">
											<LineChart />
										</TheTab>
										<TheTab title="W">
											<LineChart />
										</TheTab>
										<TheTab title="M">
											<LineChart />
										</TheTab>
									</TheTabs>
								</TheTab>
							</TheTabs>
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
						<div class="chart chart--token-price">
							<div class="chart--overview">
								<p>Price</p>
								<h1>1.03<sup>USX</sup></h1>
								<p class="u-colour-white">Apr 14, 2022</p>
							</div>
							<TheTabs size="thin" color="light" margin="0">
								<TheTab title="Price">
									<TheTabs size="thin" color="light" margin="absolute">
										<TheTab title="D">
											<LineChart />
										</TheTab>
										<TheTab title="W">
											<LineChart />
										</TheTab>
										<TheTab title="M">
											<LineChart />
										</TheTab>
									</TheTabs>
								</TheTab>
								<TheTab title="Market Cap">
									<TheTabs size="thin" color="light" margin="absolute">
										<TheTab title="D">
											<LineChart />
										</TheTab>
										<TheTab title="W">
											<LineChart />
										</TheTab>
										<TheTab title="M">
											<LineChart />
										</TheTab>
									</TheTabs>
								</TheTab>
								<TheTab title="Circulating Supply">
									<TheTabs size="thin" color="light" margin="absolute">
										<TheTab title="D">
											<LineChart />
										</TheTab>
										<TheTab title="W">
											<LineChart />
										</TheTab>
										<TheTab title="M">
											<LineChart />
										</TheTab>
									</TheTabs>
								</TheTab>
							</TheTabs>
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
