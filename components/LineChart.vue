<template>
	<client-only>
		<apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
	</client-only>
</template>
<script>

export default {
	name: "LineChart",
	data() {
		return {
			series: [{
				name: "TVL",
				data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
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
						formatter (value) {
							return value + "M";
						}
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
					categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
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
