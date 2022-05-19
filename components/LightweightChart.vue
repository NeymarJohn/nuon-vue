<template>
	<div>
		<div id="lineChart"></div>
	</div>
</template>

<script>
import DayData from "@/assets/json/day-data.json";
import WeekData from "@/assets/json/week-data.json";
import MonthData from "@/assets/json/month-data.json";

export default {
	name: "LightweightChart",
	data() {
		return {
			DayData,
			WeekData,
			MonthData,
			chartData: DayData // Needs to be replaced / removed
		};
	},
	mounted() {
		const container = document.getElementById("lineChart");

		const data = this.chartData; // Needs to be replaced / removed

		const chartOptions = {
			width: "600",
			height: "300",
			layout: {
				textColor: "#B7B7B7",
				background: {
					type: "solid",
					color: "#3A3A3E"
				}
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
					labelVisible: false
				},
				vertLine: {
      		visible: false,
					labelVisible: false,
				}
			},
		};

		const chart = window.tvchart = LightweightCharts.createChart(container, chartOptions);

		const tooltip = document.createElement("div");
		container.prepend(tooltip);

		function createTimePeriodToggle(items, activeItem, activeItemChangedCallback) {
			const timePeriodToggle = document.createElement("ul");
			timePeriodToggle.classList.add("tabs__header", "u-mb-24");

			const timePeriodItems = items.map(function(item) {
				const timePeriod = document.createElement("li");
				timePeriod.innerHTML = `<h5>${item}</h5>`;
				timePeriod.classList.toggle("is-active", item === activeItem);
				timePeriod.addEventListener("click", function() {
					onItemClicked(item);
				});
				timePeriodToggle.appendChild(timePeriod);
				return timePeriod;
			});

			function onItemClicked(item) {
				if (item === activeItem) {
					return;
				}
				timePeriodItems.forEach(function(element, index) {
					element.classList.toggle("is-active", items[index] === item);
				});
				activeItem = item;
				activeItemChangedCallback(item);
			}

			return timePeriodToggle;
		}

		const timePeriod = ["D", "W", "M"];

		const seriesesData = new Map([
			["D", this.DayData ],
			["W", this.WeekData ],
			["M", this.MonthData ],
		]);

		const timePeriodToggle = createTimePeriodToggle(timePeriod, timePeriod[0], getTimePeriod);

		container.prepend(timePeriodToggle);

		// eslint-disable-next-line
		var lineSeries = null;

		function getTimePeriod(interval) {
			if (lineSeries) {
				chart.removeSeries(lineSeries);
				lineSeries = null;
			}
			lineSeries = chart.addLineSeries({
				color: "#DFFF65",
				lineWidth: 2
			});
			lineSeries.setData(seriesesData.get(interval));
		}

		getTimePeriod(timePeriod[0]);

		function getMonthName(x) {
			const date = new Date();
			date.setMonth(x - 1);
			const monthName = date.toLocaleString("default", { month: "short" });
			return monthName;
		}

		// eslint-disable-next-line
		var dateStr = `
			${getMonthName(data[data.length - 1].time.month)}
			${data[data.length - 1].time.day},
			${data[data.length - 1].time.year}
		`;

		function getTooltipValue() {
			tooltip.innerHTML =	`
				<p>TVL</p>
				<h1>$${data[data.length - 1].value}</h1>
				<p class="u-colour-white u-mb-16">${dateStr}</p>
			`;
		}

		getTooltipValue();

		chart.subscribeCrosshairMove(function(param) {
			if (param === undefined || param.time === undefined || param.point.x < 0 || param.point.x > 600 || param.point.y < 0 || param.point.y > 300) {
				getTooltipValue();
			} else {
				dateStr = `
					${getMonthName(param.time.month)}
					${param.time.day},
					${param.time.year}
				`;
				const price = param.seriesPrices.get(lineSeries);
				tooltip.innerHTML =	`
					<p>TVL</p>
					<h1>$${(Math.round(price * 100) / 100).toFixed(2)}</h1>
					<p class="u-colour-white u-mb-16">${dateStr}</p>
				`;
			}

		});
	},
};
</script>
