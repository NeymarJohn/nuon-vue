<template>
	<LayoutContainer>
		<LayoutFlex direction="row-center-space-between" class="l-flex--column-start-sm u-mb-48">
			<PageTitle data-v-step="1">
				<h4>Dashboard</h4>
				<h1>My Portfolio</h1>
			</PageTitle>
			<PriceIndicator :nuon-price="nuonPrice" :truflation-peg="truflationPeg" />
		</LayoutFlex>
		<AccountBalance :locked-amount="userTotalLockedCollateralAmount" />
		<h3 class="u-mb-24">Collateral Hub</h3>
		<div class="l-collateral">
			<div class="l-collateral__toggle">
				<div class="l-collateral__toggle-btn is-active">
					<label>
						<TheDot color="light-green" />
						Locked Collateral
						<TheBadge v-if="!isNaN(getChangePercent('collateralTokens', collateralRatioArr, true))" class="u-ml-8" :color="getPercentChangeBadgeClass('collateralTokens', collateralRatioArr, true)">{{ getUserTVLSign }}{{ Math.abs(getChangePercent('collateralTokens', collateralRatioArr, true)) }}%</TheBadge>
					</label>
					<ComponentLoader component="h1" :loaded="balanceLoaded">
						<h3>${{ (graphSelectionTVL || totalValue) | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</div>
				<div class="l-collateral__toggle-btn">
					<label>
						<TheDot color="lime" />
						Total Minted Value (NUON)
						<TheBadge v-if="!isNaN(getChangePercent('mintedNuon', collateralRatioArr, true))" class="u-ml-8" :color="getPercentChangeBadgeClass('mintedNuon', collateralRatioArr, true)">{{ getUserMintedNuonSign }}{{ Math.abs(getChangePercent('mintedNuon', collateralRatioArr, true)) }}%</TheBadge>
					</label>
					<ComponentLoader component="h1" :loaded="balanceLoaded">
						<h3>${{ (graphSelectionMintedNuon || totalMintedNuon) | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</div>
			</div>
			<div class="l-collateral__chart">
				<template v-if="xAxisData.length">
					<span>{{graphSelectionDuraton}}</span>
					<TheTabs size="thin" color="light" margin="24" @tab-changed="handleTabChanged">
						<TheTab v-for="(period, periodIdx) in periods" :key="periodIdx" :title="period" />
					</TheTabs>
					<LineChart
						:key="selectedPeriod"
						class="u-mt-16 u-mb-48"
						:x-axis-labels="xAxisData"
						:y-axis-options="{showYAxis: false, opposite: false, labels: {formatter: (val) => {}}}"
						:series-data="yAxisData"
						data-v-step="4"
						@mouseOverDataPoint="handleMouseOverChart" />
				</template>
			</div>
		</div>
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
		<TransactionHistory data-v-step="7" />
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
		<v-tour name="myDashboardTour" :steps="steps" :callbacks="tourCallbacks"></v-tour>
	</LayoutContainer>
</template>

<script>
import dayjs from "dayjs";

import { fromWei } from "~/utils/bnTools";
import { getUserTVLDayData } from "~/services/theGraph";
import { USDT, WETH } from "~/constants/tokens";

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
			steps: [
				{
					target: "[data-v-step=\"1\"]",
					header: {
						title: "Welcome to the Dashboard",
					},
					content: "This page gives you a breakdown of your activity within the Nuon Protocol.",
				},
				{
					target: "[data-v-step=\"2\"]",
					content: "View your total deposited collateral here.",
				},
				{
					target: "[data-v-step=\"3\"]",
					content: "View the total value of your minted NUON here.",
				},
				{
					target: "[data-v-step=\"4\"]",
					content: "This chart shows your total value locked and the total value of your minted Nuon.",
				},
				{
					target: "[data-v-step=\"5\"]",
					content: "This section gives important details about your collateral, including your collateralization ratio for each asset type deposited, as well as the daily market price for your reference.",
				},
				{
					target: "[data-v-step=\"6\"]",
					content: "This section shows the total value of your account, including all Nuon minted, collateral deposited and nuMINT staked.",
				},
				{
					target: "[data-v-step=\"7\"]",
					content: "Lastly, this section provides a full history of all your transactions.",
					params: {
						placement: "left"
					}
				},
			],
			tourCallbacks: {
				onSkip: () => this.setCookie("skip_my_dashboard_tour"),
				onStop: () => this.setCookie("skip_my_dashboard_tour"),
				onFinish: () => this.setCookie("skip_my_dashboard_tour")
			},
			mobileView: false,
			collateralPrices: {},
			userMintedAmounts: {},
			nuonPrice: null,
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
					label: "Adjust Position",
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
			return parseFloat(Object.values(this.userMintedAmounts).reduce((acc, amount) => acc + amount, 0) * this.nuonPrice).toFixed(2);
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
			return changePercent > 0 ? "+ ":"- ";
		},
		getUserTVLSign() {
			const changePercent = this.getChangePercent("collateralTokens", this.collateralRatioArr, true);
			if (parseFloat(changePercent) === 0) return "";
			return changePercent > 0 ? "+ ":"- ";
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
					xData:Object.keys(weeks).map(d => new Date(d).toLocaleDateString()).reverse(),
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
					xData:Object.keys(months).map(d => new Date(d).toLocaleDateString()).reverse(),
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
				xData:this.collateralRatioArr.map(d => new Date(d.date * 1000).toLocaleDateString()).reverse(),
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
					this.getCollateralsPrices(collateral);
					this.getUserMintedAmount(collateral);
				}

				this.getNuonPrice();
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
		async getCollateralsPrices(collateral) {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getCollateralPrice"]()));
				this.$set(this.collateralPrices, collateral, result);
			} catch (e) {
			} finally {
				this.collateralPrice = result;
			}
		},
		async getUserMintedAmount(collateral) {
			let result = 0;
			try {
				result = fromWei(await this.$store.getters["collateralVaultStore/getUserMintedAmount"](this.connectedAccount));
			} catch (e) {
			} finally {
				this.$set(this.userMintedAmounts, collateral, result);
			}
		},
		async getNuonPrice() {
			let result = 0;
			try {
				result = parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getNuonPrice"]()));
			} catch (e) {
			} finally {
				this.nuonPrice = result;
			}
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
	}
};
</script>
