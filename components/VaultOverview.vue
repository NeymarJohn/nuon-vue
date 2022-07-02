<template>
	<div>
		<h2 class="u-mb-24">Vault Overview</h2>
		<div class="l-chart l-chart--vault-overview">
			<LayoutFlex>
				<div class="chart">
					<LightweightChart v-if="isLoadedData && !error" :day-data="dayData" :week-data="weekData" :month-data="monthData"/>
					<div v-if="error" class="warn">
						<p>TVL</p>
						<p>Data is not ready...</p>
					</div>
					
				</div>
				<div class="chart chart--donut">
					<p class="u-mb-4">Collateral Distribution</p>
					<p class="u-colour-white u-mb-16">{{dateStr}}</p>
					<DonutChartCollateral v-if="donutChartData" class="u-mb-24" :chart-data="donutChartData"/>
					<p>APY <TooltipIcon v-tooltip="'Enter APY tooltip content here.'" /></p>
					<h3 class="u-mb-24">Inflation 34.3%</h3>
					<p>Collateralization Ratio<TooltipIcon v-tooltip="'Enter collateralization ratio tooltip content here.'" /></p>
					<h3>{{collateralRatio}}%</h3>
				</div>
			</LayoutFlex>
		</div>
	</div>
</template>

<script>
import dayjs from "dayjs";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";
import { getCollateralTVLDayData } from "~/services/theGraph";

export default {
	name: "VaultOverview",
	components: {
		TooltipIcon
	},
	data() {
		return {
			dayData: [],
			weekData: [],
			monthData: [],
			isLoadedData: false,
			loadingData: false,
			error: false,
			dateStr: "",
			donutChartData: null,
			collateralRatio: 0,
		};
	},
	mounted () {
	// getCollateralTVLDayData
		this.loadingData = true;
		getCollateralTVLDayData().then((res) => {
			const data = res.data.data.collateralDayDatas;
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
			this.dayData = chartData;
			this.monthData = Object.values(monthData);
			this.weekData = Object.values(weekData);
			this.isLoadedData  = true;
			this.error = false;
		}).catch(() => {
			this.isLoadedData = false;
			this.error = true;
		});
		this.$root.$on("tvl-chart-move", ({dateStr, data}) => {
			this.dateStr = dateStr;
			this.donutChartData = data;
		});
		this.$store.getters["collateralVaultStore/getCollateralRatioInPercent"]().then(res => {
			this.collateralRatio = res;
		}).catch(() => {
			this.collateralRatio = 0;
		});
	},
};
</script>
