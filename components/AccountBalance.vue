<template>
	<div>
		<h3 class="u-mb-24">Account Balance</h3>
		<div class="l-balance">
			<div class="l-balance__control">
				<label>Total Value</label>
				<ComponentLoader component="h3 u-mb-24" :loaded="totalValue !== 0 && balancesValue !== 0 && stakedBalance !== 0">
					<h3>${{ totalValue + balancesValue + stakedBalance | toFixed | numberWithCommas }}</h3>
				</ComponentLoader>
				<ul class="l-balance__toggle">
					<li>
						<span><TheDot color="lime" /><label>NUON Balance</label></span>
						<div class="l-balance__toggle__value">
							<ComponentLoader component="account-balance" :loaded="balancesValue !== 0">
								{{ tokenBalances.NUON | toFixed | numberWithCommas }}
								<sub class="badge--success--no_border" >+1.25%</sub>
							</ComponentLoader>
						</div>
						<TheButton size="icon" title="Click to show chart" @click="toggleShowChart('nuon')">
							<template v-if="!activeCharts.includes('nuon')">
								<LineChartIcon v-if="!activeCharts.includes('nuon')"/>
								<span>Show Chart</span>
							</template>
							<template v-else>
								<LineChartIconActive />
								<span class="u-colour-lime">Hide Chart</span>
							</template>
						</TheButton>
					</li>
					<li>
						<span><TheDot color="light-green" /><label>NuMINT Balance</label></span>
						<div class="l-balance__toggle__value">
							<ComponentLoader component="account-balance" :loaded="balancesValue !== 0">
								{{ tokenBalances.nuMINT | toFixed | numberWithCommas }}
								<sub class="badge--grey--no_border">0.00%</sub>
							</ComponentLoader>
						</div>
						<TheButton size="icon" title="Click to show chart" @click="toggleShowChart('nuMint')">
							<template v-if="!activeCharts.includes('nuMint')">
								<LineChartIcon />
								<span>Show Chart</span>
							</template>
							<template v-else>
								<LineChartIconActive />
								<span class="u-colour-lime">Hide Chart</span>
							</template>
						</TheButton>
					</li>
					<li>
						<span><TheDot color="blue" /><label>Locked Collateral</label></span>
						<div class="l-balance__toggle__value">
							<ComponentLoader component="account-balance" :loaded="balancesValue !== 0">
								${{ totalValue | toFixed | numberWithCommas }}
								<sub class="badge--success--no_border">+1.25%</sub>
							</ComponentLoader>
						</div>
						<TheButton size="icon" title="Click to show chart" @click="toggleShowChart('collateral')">
							<template v-if="!activeCharts.includes('collateral')">
								<LineChartIcon />
								<span>Show Chart</span>
							</template>
							<template v-else>
								<LineChartIconActive />
								<span class="u-colour-lime">Hide Chart</span>
							</template>
						</TheButton>
					</li>
					<li>
						<span><TheDot color="orange" /><label>NuMINT in Boardroom</label></span>
						<div class="l-balance__toggle__value">
							<ComponentLoader component="account-balance" :loaded="balancesValue !== 0">
								{{ stakedBalance | toFixed | numberWithCommas }}
								<sub class="badge--error--no_border">-1.25%</sub>
							</ComponentLoader>
						</div>
						<TheButton size="icon" title="Click to show chart" @click="toggleShowChart('boardroom')">
							<template v-if="!activeCharts.includes('boardroom')">
								<LineChartIcon />
								<span>Show Chart</span>
							</template>
							<template v-else>
								<LineChartIconActive />
								<span class="u-colour-lime">Hide Chart</span>
							</template>
						</TheButton>
					</li>
				</ul>
			</div>
			<div class="l-balance__chart">
				<LayoutFlex direction="row-space-between" class="l-flex--column-md">
					<div>
						<LayoutFlex direction="row-center" class="l-flex--column-md">
							<TheDot :color="selectedChart.color" />
							<label>{{selectedChart.title}}</label>
							<TheBadge color="price-down">-12%</TheBadge>
						</LayoutFlex>
						<ComponentLoader component="h3" :loaded="totalValue !== 0 && balancesValue !== 0 && stakedBalance !== 0">
							<h3>${{ graphSelectionTVL || (totalValue + balancesValue + stakedBalance) | toFixed | numberWithCommas }}</h3>
						</ComponentLoader>
						<label>{{graphSelectionDuraton}}</label>
					</div>
					<ComponentLoader component="tab u-mb-24" :loaded="xAxisData.length > 0">
						<TheTabs size="thin" color="dark" margin="24" @tab-changed="handleTabChanged">
							<TheTab v-for="(period, periodIdx) in periods" :key="periodIdx" :title="period" />
						</TheTabs>
					</ComponentLoader>
				</LayoutFlex>
				<ComponentLoader component="chart u-mt-16" :loaded="xAxisData.length > 0">
					<LineChart
						:key="`${selectedPeriod}-${activeCharts[0]}`"
						class="u-mt-16"
						:x-axis-labels="xAxisData"
						:y-axis-options="{showYAxis: false, opposite: false, labels: {formatter: (val) => {}}}"
						:series-data="yAxisData"
						@mouseOverDataPoint="handleMouseOverChart" />
				</ComponentLoader>
			</div>
		</div>
	</div>
</template>

<script>
import dayjs from "dayjs";
import LineChartIcon from "@/assets/images/svg/svg-line-chart.svg";
import LineChartIconActive from "@/assets/images/svg/svg-line-chart-active.svg";
import { fromWei } from "~/utils/bnTools";
import { getUserTVLDayData } from "~/services/theGraph";

export default {
	name: "AccountBalance",
	components: {
		LineChartIcon,
		LineChartIconActive
	},
	props: {
		lockedAmount: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			collateralRatioArr: [],
			graphSelectionDuraton: "",
			graphSelectionTVL: "",
			activeCharts: [],
			selectedPeriod: 0
		};
	},
	computed: {
		balancesValue() {
			if (this.tokenBalances.nuMINT && this.tokenPrices.nuMINT && this.tokenBalances.NUON && this.tokenPrices.NUON) {
				return parseFloat((this.tokenBalances.nuMINT * this.tokenPrices.nuMINT + this.tokenBalances.NUON * this.tokenPrices.NUON).toFixed(2));
			} else {
				return 0;
			}
		},
		stakedBalance() {
			return fromWei(this.$store.state.boardroomStore.stakedBalance);
		},
		lockedValueChartData() {
			const weeks = {};
			const months = {};

			this.collateralRatioArr.forEach(item => {
				const currentDate = dayjs(new Date(item.date * 1000));
				if (!weeks[currentDate.startOf("week").format("YYYY-MM-DD")])
					weeks[currentDate.startOf("week").format("YYYY-MM-DD")] = item;
				if (!months[currentDate.startOf("month").add(1,"day").format("YYYY-MM-DD")])
					months[currentDate.startOf("month").add(1,"day").format("YYYY-MM-DD")] = item;
			});
			const yData = [];
			if (this.activeCharts.includes("nuon")) {
				const monthData = Object.values(months).map(d => d.value * 1.2).reverse();
				const weekData  =  Object.values(weeks).map(d => d.value * 1.2).reverse();
				const dayData = this.collateralRatioArr.map(d => d.value * 1.2).reverse();
				yData.push({
					name: "NUON Balance",
					data: this.selectedPeriod === 0?dayData: this.selectedPeriod === 1?weekData:monthData,
					color: "#dfff65" // Lime
				});
			} else if (this.activeCharts.includes("nuMint")) {
				const monthData = Object.values(months).map(d => d.value * 1.5).reverse();
				const weekData  =  Object.values(weeks).map(d => d.value * 1.5).reverse();
				const dayData = this.collateralRatioArr.map(d => d.value * 1.5).reverse();
				yData.push({
					name: "NuMINT Balance",
					data: this.selectedPeriod === 0?dayData: this.selectedPeriod === 1?weekData:monthData,
					color: "#65ffb5" // Green
				});
			} else if (this.activeCharts.includes("collateral")) {
				const monthData = Object.values(months).map(d => d.value * 0.8).reverse();
				const weekData  =  Object.values(weeks).map(d => d.value * 0.8).reverse();
				const dayData = this.collateralRatioArr.map(d => d.value * 0.8).reverse();
				yData.push({
					name: "Locked Collateral",
					data: this.selectedPeriod === 0?dayData: this.selectedPeriod === 1?weekData:monthData,
					color: "#65b5ff" // Blue
				});
			} else if (this.activeCharts.includes("boardroom")) {
				const monthData = Object.values(months).map(d => d.value * 0.5).reverse();
				const weekData  =  Object.values(weeks).map(d => d.value * 0.5).reverse();
				const dayData = this.collateralRatioArr.map(d => d.value * 0.5).reverse();
				yData.push({
					name: "NuMINT In Boardroom",
					data: this.selectedPeriod === 0?dayData: this.selectedPeriod === 1?weekData:monthData,
					color: "#ffc165" // Orange
				});
			} else {
				const monthData = Object.values(months).map(d => d.value ).reverse();
				const weekData  =  Object.values(weeks).map(d => d.value ).reverse();
				const dayData = this.collateralRatioArr.map(d => d.value ).reverse();
				yData.push({
					name: "Locked Collateral",
					data: this.selectedPeriod === 0?dayData: this.selectedPeriod === 1?weekData:monthData,
					color: "#fff" // Green
				});
			}

			return {
				xData:this.collateralRatioArr.map(d => new Date(d.date * 1000).toLocaleDateString()).reverse(),
				yData
			};
		},
		xAxisData() {
			return this.lockedValueChartData.xData || [];
		},
		yAxisData() {
			return this.lockedValueChartData.yData || [];
		},
		colors() {
			return this.lockedValueChartData.colors || [];
		},
		collateralPrices() {
			return this.$store.state.collateralVaultStore.collateralPrices;
		},
		totalValue() {
			return Object.entries(this.lockedAmount).reduce((acc, [collateral, amount]) => acc + this.collateralPrices[collateral] * parseFloat(amount), 0);
		},
		selectedChart() {
			switch (this.activeCharts[0]){	
			case "nuon": 
				return {
					title: "NUON Balance",
					color: "lime"
				};
			case "nuMint": 
				return {
					title: "NuMINT Balance",
					color: "light-green"
				};
			case "collateral": 
				return {
					title: "Locked Collateral",
					color: "blue"
				};
			case "boardroom": 
				return {
					title: "NuMINT in Boardroom",
					color: "orange"
				};
			default: 
				return {
					title: "Total Value",
					color: "white"
				};
			}
		
		}
	},
	mounted () {
		this.getDiffMinted();
	},
	methods: {
		getDiffMinted() {
			this.graphSelectionDuraton = dayjs(new Date()).format("M/DD/YYYY");
			getUserTVLDayData({user: this.connectedAccount}).then(res => {
				this.collateralRatioArr = res.data.data.userTVLDayDatas;
			}).catch((err) => {
				this.failureToast(() => {}, err, "An error occurred");
			}).finally(() => {
				const storageKey = `NUON-user_collateral_history_${this.connectedAccount}`;
				if (this.collateralRatioArr.length === 0) {
					const stringData = window.localStorage.getItem(storageKey);
					if (!stringData) return;
					const jsonData = JSON.parse(stringData);
					if (jsonData && jsonData.length) this.collateralRatioArr = jsonData;
				} else {
					window.localStorage.setItem(storageKey, JSON.stringify(this.collateralRatioArr));
				}
			});
		},
		handleMouseOverChart(e) {
			let idx = e;
			if (this.yAxisData.length === 0) return;
			if (e === -1) {
				idx = this.yAxisData[0]?.data?.length - 1;
				this.graphSelectionDuraton = dayjs(new Date()).format("M/DD/YYYY");
			}
			this.graphSelectionTVL = this.yAxisData[0]?.data[idx];
			this.graphSelectionMintedNuon = this.yAxisData[1]?.data[idx];
			if (e === -1) return;
			const startDate = this.xAxisData[idx];
			if (this.selectedPeriod === 0) {
				this.graphSelectionDuraton = startDate;
			} else if (this.selectedPeriod === 1) {
				this.graphSelectionDuraton = `${startDate} - ${this.xAxisData[idx]}`;
			} else if (this.selectedPeriod === 2) {
				this.graphSelectionDuraton = `${startDate}`;
			}
		},
		toggleShowChart(element) {
			if (this.activeCharts[0] === element) {
				this.activeCharts = [];
			} else {
				this.activeCharts = [element];
			}
		},
		handleTabChanged(e) {
			this.selectedPeriod = e;
		},
	},
};
</script>
