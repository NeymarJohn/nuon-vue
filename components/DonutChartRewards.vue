<template>
	<client-only>
		<apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
	</client-only>
</template>
<script>

export default {
	name: "DonutChartRewards",
	data() {
		return {
			series: [44, 55],
			chartOptions: {
				width: "100%",
				labels: ["Staked Rewards", "Burned Rewards"],
				colors: ["#65FFB5", "#FFC165"],
				chart: {
					type: "donut",
					foreColor: "#B7B7B7"
				},
				legend: {
					show: false
				},
				stroke: {
					show: false,
					width: 0
				},
				dataLabels: {
					enabled: false,
				},
				plotOptions: {
					pie: {
						expandOnClick: false,
						donut: {
							size: "75%"
						}
					},
				},
				tooltip: {
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
};
</script>
