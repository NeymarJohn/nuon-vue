<template>
	<div id="lineChart" class="chart__container"></div>
</template>

<script>
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import DayData from "@/assets/json/day-data.json";
import WeekData from "@/assets/json/week-data.json";
import MonthData from "@/assets/json/month-data.json";

dayjs.extend(utc);

export default {
	name: "LightweightChart",
	data() {
		return {
			DayData,
			WeekData,
			MonthData,
			chartData: DayData, // Needs to be replaced / removed
			activeTab: "dialy", // "weekly" "mothly"
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
		let currentInterval = "D";
		const seriesesData = new Map([
			["D", this.DayData ],
			["W", this.WeekData ],
			["M", this.MonthData ],
		]);

		const timePeriodToggle = createTimePeriodToggle(timePeriod, timePeriod[0], getTimePeriod);

		container.prepend(timePeriodToggle);

		let lineSeries = null;


		function getTimePeriod(interval) {
			currentInterval = interval;
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

		let dateStr = `
			${getMonthName(data[data.length - 1].time.month)}
			${data[data.length - 1].time.day},
			${data[data.length - 1].time.year}
		`;

		function getTooltipValue() {
			tooltip.innerHTML =	`
				<p>TVL</p>
				<h1>$${numberWithCommas(data[data.length - 1].value)}</h1>
				<p class="u-colour-white u-mb-16">${dateStr}</p>
			`;
		}

		getTooltipValue();

		chart.subscribeCrosshairMove(function(param) {
			if (param === undefined || param.time === undefined || param.point.x < 0 || param.point.x > 600 || param.point.y < 0 || param.point.y > 300) {
				getTooltipValue();
			} else {
				const now = dayjs();
				const time = param?.time;
				const timeString = dayjs(time.year + "-" + time.month + "-" + time.day).format("YYYY-MM-DD");
				const formattedTime = dayjs(timeString).format("MMM D");
				const formattedTimeDaily = dayjs(timeString).format("MMM D YYYY");
				const formattedTimePlusWeek = dayjs(timeString).add(1, "week");
				const formattedTimePlusMonth = dayjs(timeString).add(1, "month");

				if (currentInterval === "W") {
					const isCurrent = formattedTimePlusWeek.isAfter(now);
					dateStr = formattedTime + "-" + (isCurrent ? "current" : formattedTimePlusWeek.format("MMM D, YYYY"));
				} else if (currentInterval === "M") {
					const isCurrent = formattedTimePlusMonth.isAfter(now);
					dateStr = formattedTime + "-" + (isCurrent ? "current" : formattedTimePlusMonth.format("MMM D, YYYY"));
				} else {
					dateStr = formattedTimeDaily;
				}
				
				
				const price = param.seriesPrices.get(lineSeries);
				tooltip.innerHTML =	`
					<p>TVL</p>
					<h1>$${numberWithCommas((Math.round(price * 100) / 100).toFixed(2))}</h1>
					<p class="u-colour-white u-mb-16">${dateStr}</p>
				`;
			}

		});

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
	},
};
</script>
