<template>
	<client-only>
		<apexchart width="300" type="donut" :options="chartOptions" :series="series"></apexchart>
	</client-only>
</template>
<script>

export default {
	name: "DonutChart",
	data() {
		return {
			series: [44, 55, 41, 17, 15],
			chartOptions: {
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
					style: {
						fontSize: "16",
						fontWeight: "400",
						fontFamily: "Plus Jakarta Sans",
					},
					offsetX: 100
				},
			},
		};
	},
};
</script>
