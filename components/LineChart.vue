<template>
	<client-only>
		<apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
	</client-only>
</template>
<script>

export default {
	name: "LineChart",
	props: {
		xAxisLabels: {
			type: Array,
			required: true
		},
		chartData: {
			type: Array,
			required: true
		},
		name: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			series: [{
				name: this.name,
				data: this.chartData
			}],
			chartOptions: {
				colors: ["#DFFF65"],
				chart: {
					height: 300,
					type: "line",
					zoom: {
						enabled: false
					},
					foreColor: "#B7B7B7",
					toolbar: {
						show: false,
					},
					events: {
						mouseMove: (_event, _chartContext, config) => {
							this.$emit("mouseOverDataPoint", config.dataPointIndex);
						}
					}
				},
				grid: {
					show: false,
				},
				yaxis: {
					opposite: true,
					labels: {
						style: {
							fontSize: "12",
							fontWeight: "400",
							fontFamily: "Plus Jakarta Sans",
						},
						// formatter (value) {
						// 	return value + "M";
						// }
					}
				},
				dataLabels: {
					enabled: false
				},
				stroke: {
					curve: "smooth",
					width: [2]
				},
				xaxis: {
					categories: this.xAxisLabels,
					axisTicks: {
						show: false
					},
					axisBorder: {
						show: false
					},
					labels: {
						style: {
							fontSize: "12",
							fontWeight: "400",
							fontFamily: "Plus Jakarta Sans",
						}
					}
				},
				tooltip: {
					theme: "dark"
				}
			},
		};
	},
};
</script>
