<template>
	<div class="l-chart l-chart--token-price">
		<div class="l-chart__toggle">
			<TheButton
				title="Click to view HX section"
				:class="{ active: isHxView }"
				@click="toggleHxView">HX</TheButton>
			<TheButton
				title="Click to view USX section"
				:class="{ active: isUsxView }"
				@click="toggleUsxView">USX</TheButton>
		</div>
		<LayoutFlex v-if="isHxView">
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
		<LayoutFlex v-else>
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
	</div>
</template>

<script>

export default {
	name: "TokenPriceToggle",
	data() {
		return {
			isHxView: true,
			isUsxView: false,
		};
	},
	methods: {
		toggleHxView() {
			this.isHxView = true;
			this.isUsxView = false;
		},
		toggleUsxView() {
			this.isHxView = false;
			this.isUsxView = true;
		},
	}
};
</script>
