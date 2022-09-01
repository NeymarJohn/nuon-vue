<template>
	<client-only>
		<apexchart v-if="hasData" class="chart-donut" type="donut" :options="chartOptions" :series="series"></apexchart>
		<apexchart v-else  class="chart-donut"  type="donut" :options="emptyChartOptions" :series="[1]"></apexchart>
	</client-only>
</template>
<script>
export default {
	name: "DonutChartCollateral",
	props: {
		chartData: {
			type: Array,
			default: () => []
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
			emptyChartOptions: {
				width: "100%",
				labels: ["No Data"],
				colors: ["#EEEEEE10"],
				chart: {
					type: "donut",
					foreColor: "#B7B7B7"
				},
				legend: {
					show: false,
				},
				stroke: {
					show: false,
				},
				dataLabels: {
					enabled: false,
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
							offset: 50
						},
						donut: {
							size: "75%"
						}
					},
				},
				tooltip: {
					enabled: false
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
	computed: {
		hasData() {
			return this.series.some(value => value );
		}
	},
	watch: {
		chartData() {
			this.updateData();
		}
	},
	mounted () {
		this.updateData();
	},
	methods: {
		updateData() {
			// const newSeriess = this.chartData.collateralTokens.map((item) => Number(fromWei(item.amount)));
			if (this.chartData.length > 0) {
				this.series = this.chartData.map(item => item.value);
				this.chartOptions.labels = this.chartData.map(item => item.label);
			} else {
				this.series = [49672.160947712415, 49672.160947712415]; // newSeriess;
				this.chartOptions.labels = ["WETH", "USDT"]; // this.chartData.collateralTokens.map((item) => item.token.symbol);
			}
		}
	},
};
</script>
