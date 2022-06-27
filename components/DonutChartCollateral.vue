<template>
	<client-only>
		<apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
	</client-only>
</template>
<script>

export default {
	name: "DonutChartCollateral",
	data() {
		return {
			series: [44, 55, 41, 17, 15],
			chartOptions: {
				width: "100%",
				labels: ["HX", "TNode", "Osmosis", "ANC", "Others"],
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
							offset: 50
						},
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
