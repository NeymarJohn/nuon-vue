<template>
	<client-only>
		<apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
	</client-only>
</template>
<script>
export default {
	name: "DonutChartCollateral",
	props: {
		chartData: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			series: [],
			dateStr: "",
			chartOptions: {
				width: "100%",
				labels: ["nuMINT", "TNode", "Osmosis", "ANC", "Others"],
				colors: ["#FFC165", "#65B5FF", "#65FFED", "#E965FF", "#C4C4C4"],
				chart: {
					type: "donut",
					foreColor: "#B7B7B7"
				},
				legend: {
					position: "bottom",
					fontSize: "16",
					fontWeight: "400",
					fontFamily: "Plus Jakarta Sans",
				},
				stroke: {
					show: false,
					width: 0
				},
				dataLabels: {
					enabled: true,
					dropShadow: false,
					textAnchor: "start",
					style: {
						fontSize: "16",
						fontWeight: "400",
						fontFamily: "Plus Jakarta Sans",
					},
				},
				plotOptions: {
					pie: {
						expandOnClick: false,
						customScale: 0.8,
						dataLabels: {
							offset: 100
						},
						donut: {
							size: "75%"
						}
					},
				},
				tooltip: {
					enabled: false,
					theme: "dark",
				},
				states: {
					hover: {
						filter: {
							type: "none"
						}
					},
					active: {
						filter: {
							type: "none"
						}
					}
				}
			},
		};
	},
	mounted () {
		this.updateData();
	},
	methods: {
		updateData() {
			// const newSeriess = this.chartData.collateralTokens.map((item) => Number(fromWei(item.amount)));
			this.series = [49672.160947712415, 49672.160947712415]; // newSeriess;
			this.chartOptions.labels = ["WETH", "USDT"]; // this.chartData.collateralTokens.map((item) => item.token.symbol);
		}
	},
};
</script>
