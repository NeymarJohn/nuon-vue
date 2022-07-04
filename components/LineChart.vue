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
		seriesData: {
			type: Array,
			required: true
		},
		animate: {
			type: Boolean,
			required: false,
			default: true
		},
	},
	data() {
		return {
			series: this.seriesData,
			chartOptions: {
				colors: ["#DFFF65"],
				chart: {
					animations: {
						enabled: this.animate,
						 easing: "easeinout",
					},
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
