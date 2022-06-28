<template>
	<div>
		<TheTabs size="thin" color="light" margin="24" @tab-changed="handleTabChanged">
			<TheTab title="D" />
			<TheTab title="W" />
			<TheTab title="M" />
		</TheTabs>
		<div id="lineChart" class="chart__container"></div>
	</div>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default {
	name: "LightweightChart",
	props: {
		dayData: {
			type:Array,
			default: () => [],
		},
		monthData: {
			type: Array,
			default: () => []
		},
		weekData: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			chartData: this.dayData, // Needs to be replaced / removed
			activeTab: "daily", // "weekly" "monthly",
			currentTabIndex: 0,
			chartObj: null,
			seriesesData: [this.dayData, this.weekData, this.monthData],
			lineSeries: null,
			tooltipDom: null
		};
	},
	mounted() {
		const container = document.getElementById("lineChart");
		const data = this.chartData; // Needs to be replaced / removed

		const chartOptions = {
			height: "270",
			layout: {
				textColor: "#B7B7B7",
				background: {
					type: "solid",
					color: "#3A3A3E",
				}
			},
			localization: {
				priceFormatter: (price) => {
					return formatPrice(price);
				},
			},
			rightPriceScale: {
				scaleMargins: {
					top: 0.35,
					bottom: 0.2,
				},
				borderVisible: false,
			},
			timeScale: {
				borderVisible: false,
				barSpacing: 18,
			},
			grid: {
				horzLines: {
					visible: false,
				},
				vertLines: {
					visible: false,
				},
			},
			crosshair: {
				horzLine: {
					visible: false,
					labelVisible: false,
				},
				vertLine: {
					visible: true,
					style: 0,
					width: 1,
					color: "#B7B7B7",
					labelVisible: false,
				},
			},
		};

		function numberWithCommas (x) {
			if (!x) return 0;
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		function formatPrice(num) {
			if (Math.abs(num) < 1000) {
				 return parseFloat(num.toFixed(1));
			}
			else if (Math.abs(num) < 1000000) {
				return parseFloat((num / 1000).toFixed(1)) + "K"; // convert to K for number from > 1000 < 1 million
			} else if (Math.abs(num) < 1000000000) {
				return parseFloat((num / 1000000).toFixed(1)) + "M"; // convert to M for number from > 1 million
			} else {
				return parseFloat((num / 1000000000).toFixed(1)) + "B"; // convert to M for number from > 1 billion
			}
		}

		const chart = window.tvchart = LightweightCharts.createChart(container, chartOptions);
		this.chartObj = chart;
		const tooltip = document.createElement("div");
		this.tooltipDom = tooltip;
		container.prepend(tooltip);

		this.setChartData();

		function getMonthName(x) {
			const date = new Date();
			date.setMonth(x - 1);
			const monthName = date.toLocaleString("default", { month: "short" });
			return monthName;
		}

		if (data.length === 0) return;

		const dateStr = `
			${getMonthName(data[data.length - 1].time.month)}
			${data[data.length - 1].time.day},
			${data[data.length - 1].time.year}
		`;

		this.tooltipDom.innerHTML =	`
			<p>TVL</p>
			<h1>$${numberWithCommas(data[data.length - 1].value.toFixed(2))}</h1>
			<p class="u-colour-white u-mb-16">${dateStr}</p>
		`;

		this.$root.$emit("tvl-chart-move", {data: data[data.length - 1], dateStr});
	},
	methods: {
		handleTabChanged(tabIndex) {
			this.currentTabIndex = tabIndex;
			this.setChartData();
		},
		setChartData() {
			if (this.chartObj) {
				if (this.lineSeries) {
					this.chartObj.removeSeries(this.lineSeries);
					this.lineSeries = null;
				}
				this.lineSeries = this.chartObj.addLineSeries({
					color: "#DFFF65",
					lineWidth: 2
				});
				this.lineSeries.setData(this.seriesesData[this.currentTabIndex]);
				const data = this.seriesesData[this.currentTabIndex];
				this.chartObj.subscribeCrosshairMove((param) => {
					function getMonthName(x) {
						const date = new Date();
						date.setMonth(x - 1);
						const monthName = date.toLocaleString("default", { month: "short" });
						return monthName;
					}
					let dateStr = `
						${getMonthName(data[data.length - 1].time.month)}
						${data[data.length - 1].time.day},
						${data[data.length - 1].time.year}
					`;
					if (param === undefined || param.time === undefined || param.point.x < 0 || param.point.x > 600 || param.point.y < 0 || param.point.y > 300) {
						this.tooltipDom.innerHTML =	`
							<p>TVL</p>
							<h1>$${this.$options.filters.numberWithCommas(data[data.length - 1].value.toFixed(2))}</h1>
							<p class="u-colour-white u-mb-16">${dateStr}</p>
						`;
					} else {
						const now = dayjs();
						const time = param?.time;
						const timeString = dayjs(time.year + "-" + time.month + "-" + time.day).format("YYYY-MM-DD");
						const formattedTime = dayjs(timeString).format("MMM D");
						const formattedTimeDaily = dayjs(timeString).format("MMM D YYYY");
						const formattedTimePlusWeek = dayjs(timeString).add(1, "week");
						const formattedTimePlusMonth = dayjs(timeString).add(1, "month");

						if (this.currentTabIndex === 1) { // weekly
							const isCurrent = formattedTimePlusWeek.isAfter(now);
							dateStr = formattedTime + "-" + (isCurrent ? "current" : formattedTimePlusWeek.format("MMM D, YYYY"));
						} else if (this.currentTabIndex === 2) { // Monthly
							const isCurrent = formattedTimePlusMonth.isAfter(now);
							dateStr = formattedTime + "-" + (isCurrent ? "current" : formattedTimePlusMonth.format("MMM D, YYYY"));
						} else {
							dateStr = formattedTimeDaily;
						}

						const price = param.seriesPrices.get(this.lineSeries);
						this.tooltipDom.innerHTML =	`
							<p>TVL</p>
							<h1>$${this.$options.filters.numberWithCommas((Math.round(price * 100) / 100).toFixed(2))}</h1>
							<p class="u-colour-white u-mb-16">${dateStr}</p>
						`;


						// Emit move event for update donut chart
						const currentData = this.seriesesData[this.currentTabIndex].find(item => item.formattedDate === timeString);
						this.$root.$emit("tvl-chart-move", {data: currentData, dateStr, param});
					}
				});
			}
		}
	},
};
</script>
