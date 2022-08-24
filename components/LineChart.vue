<template>
	<client-only>
		<apexchart type="line" height="367" :options="chartOptions" :series="series"></apexchart>
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
		yAxisOptions: {
			type: Object,
			default() {
				return {
					showYAxis: false,
					opposite: false,
					labels: {
						align: "right",
						formatter: () => {}
					}
				};
			},
			required: false
		},
		showTooltip: {
			type: Boolean,
			required: false,
			default: true
		},
		dashArray: {
			type: Array,
			required: false,
			default() {
				return new Array(this.yAxisOptions.length).fill(0);
			}
		},
		colors: {
			type: Array,
			required: false,
			default() {
				return ["#FFF", "#65FFB5", "#65B5FF", "#FFC165"];
			}
		},
	},
	data() {
		return {
			series: this.seriesData,
			chartOptions: {
				colors: this.colors,
				chart: {
					animations: {
						enabled: this.animate,
						 easing: "easeinout",
					},
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
						},
					}
				},
				grid: {
					show: false,
					 padding: {
						top: 32,
						right: 0,
						bottom: 32,
						left: 0
					},
				},
				yaxis: {
					opposite: this.yAxisOptions.opposite,
					show: this.yAxisOptions.showYAxis,
					labels: this.yAxisOptions.labels
				},
				dataLabels: {
					enabled: false
				},
				stroke: {
					curve: "smooth",
					width: 2,
					dashArray: this.dashArray
				},
				legend: {
					show: false
				},
				xaxis: {
					categories: this.xAxisLabels,
					tickPlacement: "between",
					axisTicks: {
						show: false
					},
					axisBorder: {
						show: false
					},
					labels: {
						style: {
							fontSize: "14",
							fontWeight: "400",
							fontFamily: "Plus Jakarta Sans",
						},
					},
					tooltip: {
						enabled: false
					}
				},
				tooltip: {
					followCursor: true,
					theme: "dark",
					custom() {
						return "";
					}
				}
			},
		};
	},
};
</script>
