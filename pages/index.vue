<template>
	<LayoutContainer>
		<LayoutFlex direction="row-center-space-between" class="l-flex--column-start-sm u-mb-48">
			<PageTitle>
				<h4>Dashboard</h4>
				<h1>My Portfolio</h1>
			</PageTitle>
			<PriceIndicator :nuon-price="tokenPrices.NUON" :truflation-peg="truflationPeg" />
		</LayoutFlex>
		<h3 class="u-mb-24">Account Health</h3>
		<div class="l-collateral l-collateral--distribution">
			<div class="l-collateral__donut">
				<label>Collateral Distribution</label>
				<DonutChartCollateral :chart-data="collateralDonutChartData" />
			</div>
			<TheLoader component="table" class="l-collateral__table">
				<TransactionTable
					v-if="!mobileView"
					size="collateral"
					class="u-p-0"
					aria="Collateral Hub transactions"
					:data="chubData"
					:config="configData"
					:misc="miscConfig"
					:actions="actions" />
				<TransactionCard
					v-else
					:data="chubData"
					:config="configData" />
			</TheLoader>
		</div>
		<div class="l-collateral">
			<div class="l-collateral__toggle">
				<div class="l-collateral__toggle-btn" :class="{'is-active': selectedCollateralToggleBtn === 0}" @click="handleCollaterlToggleBtn(0)">
					<label>
						<TheDot color="blue" />
						Locked Collateral
						<ComponentLoader component="badge u-ml-8" :loaded="collateralRatioArr.length > 0">
							<TheBadge v-if="!isNaN(getChangePercent('collateralTokens', collateralRatioArr, true))" class="u-ml-8" :color="getPercentChangeBadgeClass('collateralTokens', collateralRatioArr, true)">{{ getUserTVLSign }}{{ Math.abs(getChangePercent('collateralTokens', collateralRatioArr, true)) }}%</TheBadge>
						</ComponentLoader>
					</label>
					<ComponentLoader component="h3" :loaded="balanceLoaded">
						<h3>${{ (graphSelectionTVL || totalValue) | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</div>
				<div class="l-collateral__toggle-btn" :class="{'is-active': selectedCollateralToggleBtn === 1}" @click="handleCollaterlToggleBtn(1)">
					<label>
						<TheDot color="lime" />
						Total NUON Minted Value
						<ComponentLoader component="badge u-ml-8" :loaded="collateralRatioArr.length > 0">
							<TheBadge v-if="!isNaN(getChangePercent('mintedNuon', collateralRatioArr, true))" class="u-ml-8" :color="getPercentChangeBadgeClass('mintedNuon', collateralRatioArr, true)">{{ getUserMintedNuonSign }}{{ Math.abs(getChangePercent('mintedNuon', collateralRatioArr, true)) }}%</TheBadge>
						</ComponentLoader>
					</label>
					<ComponentLoader component="h3" :loaded="balanceLoaded">
						<h3>${{ (graphSelectionMintedNuon || totalMintedNuon) | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</div>
			</div>
			<div class="l-collateral__chart">
				<LayoutFlex direction="row-justify-end">
					<ComponentLoader component="tab u-mb-24" :loaded="xAxisData.length > 0">
						<TheTabs size="thin" color="dark" margin="24" @tab-changed="handleTabChanged">
							<TheTab v-for="(period, periodIdx) in periods" :key="periodIdx" :title="period" />
						</TheTabs>
					</ComponentLoader>
				</LayoutFlex>
				<ComponentLoader component="chart u-mt-16" :loaded="xAxisData.length > 0">
					<LineChart
						:key="selectedPeriod"
						:x-axis-labels="xAxisData"
						:y-axis-options="{
							showYAxis: false,
							opposite: false,
							labels: {formatter: (val) => {}}
						}"
						:colors="['#65b5ff', '#dfff65']"
						:series-data="yAxisData"
						@mouseOverDataPoint="handleMouseOverChart" />
				</ComponentLoader>
			</div>
		</div>
		<AccountBalance :locked-amount="userTotalLockedCollateralAmount" />
		<TransactionHistory />
		<TheModal
			v-show="isMintModalVisible"
			title="Mint"
			subtitle="Deposit collateral to mint NUON"
			@close-modal="setModalVisibility('mintModal', false)">
			<CollateralMint
				:minimum-deposit-amount="minimumDepositAmount" :currently-selected-collateral="currentlySelectedCollateral" />
		</TheModal>
		<TheModal
			v-show="isRedeemModalVisible"
			title="Redeem"
			subtitle="Burn NUON to redeem collateral"
			@close-modal="setModalVisibility('redeemModal', false)">
			<CollateralRedeem :currently-selected-collateral="currentlySelectedCollateral" />
		</TheModal>
		<TheModal
			v-show="isAdjustPositionModalVisible"
			:title="`Adjust Position${adjustModalPositionTitle && ': '}${adjustModalPositionTitle}`"
			:subtitle="adjustModalPositionSubtitle || 'Manage your collateral'"
			@close-modal="setModalVisibility('adjustPositionModal', false)">
			<AdjustPosition
				:minimum-deposit-amount="minimumDepositAmount"
				:currently-selected-collateral="currentlySelectedCollateral"
				:user-minted-amount="userMintedAmount"
				@action-changed="setAdjustPositionModalTitle" />
		</TheModal>
		<!-- <v-tour name="myDashboardTour" :steps="steps" :callbacks="tourCallbacks"></v-tour> -->
	</LayoutContainer>
</template>

<script>
import dayjs from "dayjs";
import { fromWei } from "~/utils/bnTools";
import { getUserTVLDayData } from "~/services/theGraph";
import { NUON, USDT, WETH } from "~/constants/tokens";

export default {
	name: "TheDashboard",
	data() {
		return {
			tvl: 0,
			totalMintedNuonValue: 0,
			myCollateralizationRatio: 0,
			configData: [
				{title: "Locked Collateral", id: "lockedCollateral"},
				{title: "Total Value Locked", id: "lockedValueStr"},
				{title: "Collateralization Ratio", id: "collateralizationRatio"}
			],
			miscConfig: {
				hasImage: {
					lockedCollateral: ["WETH", "USDT"]
				},
			},
			// To be implemented after dashboard is finished.
			// tourCallbacks: {
			// 	onSkip: () => this.setCookie("skip_my_dashboard_tour"),
			// 	onStop: () => this.setCookie("skip_my_dashboard_tour"),
			// 	onFinish: () => this.setCookie("skip_my_dashboard_tour")
			// },
			mobileView: false,
			truflationPeg: 0,
			collateralRatioArr: [],
			graphSelectionTVL: "",
			graphSelectionMintedNuon: "",
			balanceLoaded: false,
			selectedPeriod: 0,
			graphSelectionDuraton: "",
			currentlySelectedCollateral: "WETH",
			actions:[
				{
					label: "Mint",
					handler: (row) => {
						this.setCurrentlySelectedCollateral(row.lockedCollateral);
						this.setModalVisibility("mintModal", true);
					}
				},
				{
					label: "Redeem",
					handler: (row) =>  {
						this.setCurrentlySelectedCollateral(row.lockedCollateral);
						this.setModalVisibility("redeemModal", true);
					}
				},
				{
					label: "Adjust",
					handler: (row) =>  {
						this.setCurrentlySelectedCollateral(row.lockedCollateral);
						this.setModalVisibility("adjustPositionModal", true);
					}
				}
			],
			minimumDepositAmount: 0,
			adjustModalPositionTitle: "",
			adjustModalPositionSubtitle: "",
			userMintedAmount: null,
			selectedCollateralToggleBtn: 0
		};
	},
	head () {
		return {
			title: "Dashboard | NUON"
		};
	},
	computed: {
		collaterals() {
			const collaterals = [WETH.symbol, USDT.symbol];
			return collaterals;
		},
		collateralPrices() {
			return this.$store.state.collateralVaultStore.collateralPrices;
		},
		userMintedAmounts() {
			return this.$store.state.collateralVaultStore.mintedAmount;
		},
		pendingRewards() {
			return this.$store.state.boardroomStore.earned;
		},
		rewardsDollarValue() {
			if (!parseFloat(this.pendingRewards)) return 0;
			return this.pendingRewards * this.tokenPrices.nuMINT;
		},
		myCollateralLocked() {
			return Object.values(this.userTotalLockedCollateralAmount).reduce((acc, val) => acc + parseFloat(val), 0);
		},
		totalValue() {
			return Object.entries(this.userTotalLockedCollateralAmount).reduce((acc, [collateral, amount]) => acc + this.collateralPrices[collateral] * parseFloat(amount), 0);
		},
		myCollateralLockedPercentage() {
			return Number(this.myCollateralLocked) / this.totalValue * 100;
		},
		totalMintedNuon() {
			if (Object.values(this.userMintedAmounts).length === 0) return 0;
			return parseFloat(Object.values(this.userMintedAmounts).reduce((acc, amount) => acc + amount, 0) * this.tokenPrices[NUON.symbol]).toFixed(2);
		},
		userTotalLockedCollateralAmount() {
			return this.$store.state.collateralVaultStore.lockedAmount;
		},
		userCollateralizationRatios() {
			return this.$store.state.collateralVaultStore.collateralRatio;
		},
		chubData() {
			const data = [];

			for (let i = 0; i < this.collaterals.length; i++) {
				const collateral = this.collaterals[i];
				const obj = {
					lockedCollateral: collateral,
					lockedValueStr: `$${this.numberWithCommas((this.userTotalLockedCollateralAmount[collateral] * this.collateralPrices[collateral]).toFixed(2))}`,
					lockedValue: (this.userTotalLockedCollateralAmount[collateral] * this.collateralPrices[collateral]).toFixed(2),
					mintedNuon: this.numberWithCommas(parseFloat(this.userMintedAmounts[collateral]).toFixed(2)),
					collateralizationRatio: `${this.numberWithCommas(parseFloat(this.userCollateralizationRatios[collateral]).toFixed(2))}`,
					currentPrice: `$${this.numberWithCommas(parseFloat(this.collateralPrices[collateral]).toFixed(2))}`
				};
				data.push(obj);
			}

			return data;
		},
		collateralDonutChartData() {
			return this.chubData.map(cdata=>({label: cdata.lockedCollateral, value: Number(cdata.lockedValue)}));
		},
		getUserMintedNuonSign() {
			const changePercent = this.getChangePercent("mintedNuon", this.collateralRatioArr, true);
			if (parseFloat(changePercent) === 0) return "";
			return changePercent > 0 ? "+ " : "- ";
		},
		getUserTVLSign() {
			const changePercent = this.getChangePercent("collateralTokens", this.collateralRatioArr, true);
			if (parseFloat(changePercent) === 0) return "";
			return changePercent > 0 ? "+ " : "- ";
		},
		xAxisData() {
			return this.lockedValueChartData.xData || [];
		},
		yAxisData() {
			return this.lockedValueChartData.yData || [];
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
			if (this.selectedPeriod === 1) { // week
				return {
					xData: Object.keys(weeks).map(d => new Date(d).toLocaleDateString()).reverse(),
					yData:[{
						name: "My Total Value Locked",
						data: Object.values(weeks).map(d => d.value).reverse()
					}, {
						name: "My Total Minted Value",
						data: Object.values(weeks).map(d => d.mintedValue).reverse()
					}]
				};}
			if (this.selectedPeriod === 2) { // month
				return {
					xData: Object.keys(months).map(d => new Date(d).toLocaleDateString("default", { month: "short" })).reverse(),
					yData:[{
						name: "My Total Value Locked",
						data: Object.values(months).map(d => d.value).reverse()
					}, {
						name: "My Total Minted Value",
						data: Object.values(months).map(d => d.mintedValue).reverse()
					}]
				};
			};
			return {
				xData: this.collateralRatioArr.map(d => new Date(d.date * 1000).toLocaleDateString()).reverse(),
				yData:[{
					name: "My Total Value Locked",
					data: this.collateralRatioArr.map(d => d.value).reverse()
				}, {
					name: "My Total Minted Value",
					data: this.collateralRatioArr.map(d => d.mintedValue).reverse()
				}]
			};
		},
		isMintModalVisible() {
			return this.$store.state.modalStore.modalVisible.mintModal;
		},
		isRedeemModalVisible() {
			return this.$store.state.modalStore.modalVisible.redeemModal;
		},
		isAdjustPositionModalVisible() {
			return this.$store.state.modalStore.modalVisible.adjustPositionModal;
		},
	},
	watch: {
		connectedAccount(newValue) {
			if (newValue) this.initialize(this.collaterals);
		},
		yAxisData() {
			this.handleMouseOverChart(-1);
		}
	},
	mounted() {
		this.mobileView = this.isMobile();
		this.initialize(this.collaterals);
		this.handleMouseOverChart(-1);
		if (!$cookies.get("skip_my_dashboard_tour")) this.$tours.myDashboardTour.start();
	},
	methods: {
		async initialize(collaterals) {
			try {
				for (let i = 0; i < collaterals.length; i++) {
					const collateral = collaterals[i];
					await this.$store.dispatch("collateralVaultStore/changeCollateral", collateral);
				}
				this.getTruflationPeg();
				this.getDiffMinted();
			} catch (e) {
			} finally {
				setTimeout(() => {
					this.balanceLoaded = true;
				}, 500);
			}
			this.getMinimumDepositAmount();
		},
		async getTruflationPeg() {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getTruflationPeg"]()));
			} catch (e) {
			} finally {
				this.truflationPeg = result;
			}
		},
		getDiffMinted() {
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
				this.graphSelectionDuraton = "";
			}
			this.graphSelectionTVL = this.yAxisData[0]?.data[idx];
			this.graphSelectionMintedNuon = this.yAxisData[1]?.data[idx];
			if (e === -1) return;
			const startDate = dayjs(this.xAxisData[idx]).format("MMM D YYYY");
			if (this.selectedPeriod === 0) {
				this.graphSelectionDuraton = startDate;
			} else if (this.selectedPeriod === 1) {
				this.graphSelectionDuraton = `${startDate} - ${dayjs(this.xAxisData[idx]).add(1,"week").format("MMM D YYYY")}`;
			} else if (this.selectedPeriod === 2) {
				this.graphSelectionDuraton = `${startDate} - ${dayjs(this.xAxisData[idx]).add(1,"month").format("MMM D YYYY")}`;
			}
		},
		handleTabChanged(e) {
			this.selectedPeriod = e;
		},
		setCurrentlySelectedCollateral(cToken) {
			this.$store.commit("collateralVaultStore/setCollateralToken", cToken );
			this.currentlySelectedCollateral = cToken;
		},
		setAdjustPositionModalTitle(obj) {
			this.adjustModalPositionTitle = obj.title;
			this.adjustModalPositionSubtitle = obj.subtitle;
		},
		async getMinimumDepositAmount() {
			let result = 0;
			try {
				result = await this.$store.getters["collateralVaultStore/getMinimumDepositAmount"]() / (10 ** this.decimals);
			} catch (e) {
			} finally {
				this.minimumDepositAmount = result;
			}
		},
		handleCollaterlToggleBtn(selectedIndex) {
			this.selectedCollateralToggleBtn = selectedIndex;
		}
	}
};
</script>
