<template>
	<div>
		<div id="lineChart" style="position: relative"></div>
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
			chartData: DayData
		};
	},
	mounted() {
		const container = document.getElementById("lineChart");

		const data = this.chartData;

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

		const toolTip = document.createElement("div");
		container.prepend(toolTip);

		function createSimpleSwitcher(items, activeItem, activeItemChangedCallback) {
			const switcherElement = document.createElement("ul");
			switcherElement.classList.add("tabs__header", "u-mb-24");

			const intervalElements = items.map(function(item) {
				const itemEl = document.createElement("li");
				itemEl.innerHTML = `<h5>${item}</h5>`;
				itemEl.classList.toggle("is-active", item === activeItem);
				itemEl.addEventListener("click", function() {
					onItemClicked(item);
				});
				switcherElement.appendChild(itemEl);
				return itemEl;
			});

			function onItemClicked(item) {
				if (item === activeItem) {
					return;
				}

				intervalElements.forEach(function(element, index) {
					element.classList.toggle("is-active", items[index] === item);
				});

				activeItem = item;

				activeItemChangedCallback(item);
			}

			return switcherElement;
		}

		const intervals = ["D", "W", "M"];

		const seriesesData = new Map([
			["D", DayData ],
			["W", WeekData ],
			["M", MonthData ],
		]);

		const switcherElement = createSimpleSwitcher(intervals, intervals[0], syncToInterval);

		container.prepend(switcherElement);

		// eslint-disable-next-line
		var areaSeries = null;

		function syncToInterval(interval) {
			if (areaSeries) {
				chart.removeSeries(areaSeries);
				areaSeries = null;
			}
			areaSeries = chart.addLineSeries({
				color: "#DFFF65",
				lineWidth: 2
			});
			areaSeries.setData(seriesesData.get(interval));
		}

		syncToInterval(intervals[0]);

		function getMonthName (x) {
			const date = new Date();
			date.setMonth(x - 1);
			const monthName = date.toLocaleString("default", { month: "short" });
			return monthName;
		}

		// eslint-disable-next-line
		var dateStr = `${getMonthName(data[data.length - 1].time.month)} ${data[data.length - 1].time.day}, ${data[data.length - 1].time.year}`;

		function setLastBarText() {
			toolTip.innerHTML =	`
				<p>TVL</p>
				<h1>$${data[data.length - 1].value}</h1>
				<p class="u-colour-white u-mb-16">${dateStr}</p>
			`;
		}

		setLastBarText();

		chart.subscribeCrosshairMove(function(param) {
			if (param === undefined || param.time === undefined || param.point.x < 0 || param.point.x > 600 || param.point.y < 0 || param.point.y > 300) {
				setLastBarText();
			} else {
				dateStr = `${getMonthName(param.time.month)} ${param.time.day}, ${param.time.year}`;
				const price = param.seriesPrices.get(areaSeries);
				toolTip.innerHTML =	`
					<p>TVL</p>
					<h1>$${(Math.round(price * 100) / 100).toFixed(2)}</h1>
					<p class="u-colour-white u-mb-16">${dateStr}</p>
				`;
			}

		});
	},
};
</script>
