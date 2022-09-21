<template>
	<div>
		<h3 class="u-mb-24">Collateral Overview</h3>
		<LayoutFlex direction="column" class="l-chart l-chart--vault-overview">
			<ComponentLoader component="collateral-hub-chart-tabs" :loaded="isLoadedData">
				<TheTabs size="thin" color="light" margin="24" @tab-changed="handleTabChanged">
					<TheTab v-for="(period, periodIdx) in periods" :key="periodIdx" :title="period" />
				</TheTabs>
			</ComponentLoader>
			<LayoutFlex class="l-flex--column-md">
				<div class="chart chart-container">
					<ComponentLoader component="collateral-hub-chart" :loaded="isLoadedData">
						<LightweightChart
							v-if="isLoadedData && !error"
							:day-data="dayData"
							:week-data="weekData"
							:month-data="monthData"
							:selected-tab-idx="selectedPeriod" />
					</ComponentLoader>
				</div>
				<div class="chart chart--donut">
					<ComponentLoader component="collateral-hub-chart" :loaded="isLoadedData">
						<p class="u-mb-4">Collateral Distribution</p>
						<p class="u-colour-white u-mb-16">{{ dateStr }}</p>
						<DonutChartCollateral class="u-mb-24" :chart-data="[]" />
						<p>Protocol Collateralization Ratio<TooltipIcon v-tooltip="'The amount of collateral deposited across the protocol to back all minted NUON.'" /></p>
						<h3>{{ collateralRatio }}%</h3>
					</ComponentLoader>
				</div>
			</LayoutFlex>
		</LayoutFlex>
	</div>
</template>

<script>
import dayjs from "dayjs";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";
import { getCollateralTVLDayData } from "~/services/theGraph";
import { fromWei } from "~/utils/bnTools";
import mockDayData from "@/assets/json/day-data.json";
import mockMonthData from "@/assets/json/month-data.json";
import mockWeekData from "@/assets/json/week-data.json";

export default {
	name: "CollateralHubOverview",
	components: {
		TooltipIcon
	},
	data() {
		return {
			dayData: [],
			weekData: [],
			monthData: [],
			mockDayData,
			mockMonthData,
			mockWeekData,
			isLoadedData: false,
			loadingData: false,
			error: false,
			dateStr: "",
			donutChartData: null,
			collateralRatio: 0,
			selectedPeriod: "",
			periods: ["D", "W", "M"],
		};
	},
	mounted () {
		this.loadingData = true;
		getCollateralTVLDayData().then((res) => {
			let data = res.data.data.collateralDayDatas;

			if (data === undefined || data.length === 0) {
				const stringData = window.localStorage.getItem("NUON-collateralTVLDayData");
				if (!stringData) return;
				const jsonData = JSON.parse(stringData);
				if (jsonData && jsonData.length) data = jsonData;
			} else {
				window.localStorage.setItem("NUON-collateralTVLDayData", JSON.stringify(data));
			}

			let totalValue = 0;
			const chartData = [];
			const weekData = {};
			const monthData = {};
			data.forEach((item) => {
				totalValue += item.totalValue * item.price;
				const currentDate = dayjs(new Date(item.date * 1000));
				chartData.push({
					...item,
					time: currentDate.format("YYYY-MM-DD"),
					value: totalValue,
					formattedDate: currentDate.format("YYYY-MM-DD"),
				});
				weekData[currentDate.startOf("week").format("YYYY-MM-DD")] = {
					...item,
					time: currentDate.startOf("week").format("YYYY-MM-DD"),
					value: totalValue,
					formattedDate: currentDate.format("YYYY-MM-DD"),
				};
				monthData[currentDate.startOf("month").format("YYYY-MM-DD")] = {
					...item,
					time: currentDate.startOf("month").format("YYYY-MM-DD"),
					value: totalValue,
					formattedDate: currentDate.format("YYYY-MM-DD"),
				};
			});
			// this.dayData = chartData;
			// this.monthData = Object.values(monthData);
			// this.weekData = Object.values(weekData);

			this.dayData = this.mockDayData;
			this.monthData = this.mockMonthData;
			this.weekData = this.mockWeekData;
			this.isLoadedData  = true;
			this.error = false;
		}).catch(() => {
			this.isLoadedData = false;
			this.error = true;
		});
		// this.$root.$on("tvl-chart-move", ({dateStr, data}) => {
		// 	this.dateStr = dateStr;
		// 	this.donutChartData = data;
		// });
		const chubAddress = this.$store.getters["addressStore/collateralHubs"][this.$store.state.collateralVaultStore.currentCollateralToken];
		this.$store.getters["collateralVaultStore/getGlobalCR"](chubAddress).then(res => {
			this.collateralRatio = parseFloat(fromWei(res)).toFixed(0);
		}).catch(() => {
			this.collateralRatio = 0;
		});
	},
	methods: {
		handleTabChanged(e) {
			this.selectedPeriod = e;
		},
	}
};
</script>
