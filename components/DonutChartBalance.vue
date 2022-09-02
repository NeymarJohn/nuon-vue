<template>
	<client-only>
		<apexchart v-if="hasData" type="donut" :options="chartOptions" :series="series"></apexchart>
		<apexchart v-else type="donut" :options="emptyChartOptions" :series="[1]"></apexchart>
	</client-only>
</template>
<script>
export default {
	name: "DonutChartBalance",
	props: {
		chartData: {
			type: Array,
			required: true
		},
	},
	data() {
		return {
			series: this.chartData,
			dateStr: "",
			chartOptions: {
				width: "100%",
				labels: ["Balance", "Collateral Locked", "Staked"],
				colors: ["#FFC165", "#65b5FF", "#65F6FF"],
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
};
</script>
