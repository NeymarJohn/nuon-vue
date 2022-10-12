<template>
	<LayoutContainer>
		<LayoutHeader>
			<PageTitle data-v-step="1">
				<h1>Dashboard</h1>
			</PageTitle>
			<PriceIndicator data-v-step="3" />
		</LayoutHeader>
		<h3 class="u-mb-24">Account Health</h3>
		<div class="l-collateral l-collateral--distribution" data-v-step="4">
			<TheLoader component="table" class="l-collateral__donut">
				<label>Collateral Distribution</label>
				<DonutChartCollateral :chart-data="collateralDonutChartData" />
			</TheLoader>
			<TheLoader component="table" class="l-collateral__table">
				<TransactionTable
					v-if="!mobileView"
					data-v-step="2"
					size="collateral"
					class="u-p-0"
					aria="Collateral Hub transactions"
					:data="chubData"
					:config="configData"
					:misc="miscConfig"
					:actions="actions" />
			</TheLoader>
		</div>
		<div class="l-collateral" data-v-step="5">
			<div class="l-collateral__toggle">
				<div
					class="l-collateral__toggle-btn"
					:class="{'is-active': selectedCollateralToggleBtn === 0}"
					@click="handleCollateralToggle(0)">
					<label>
						<TheDot color="blue" />
						Locked Collateral
						<ComponentLoader component="badge u-ml-8" :loaded="collateralRatioArr.length > 0">
							<TheBadge
								v-if="!isNaN(getChangePercent('collateralTokens', collateralRatioArr, true))"
								class="u-ml-8"
								:color="getPercentChangeBadgeClass('collateralTokens', collateralRatioArr, true)">
								{{ getUserTVLSign }}{{ Math.abs(getChangePercent('collateralTokens', collateralRatioArr, true)) }}%
							</TheBadge>
						</ComponentLoader>
					</label>
					<ComponentLoader component="h3" :loaded="balanceLoaded">
						<h3 >${{ (graphSelectionTVL || totalValue) | toFixed | numberWithCommas }}</h3>
					</ComponentLoader>
				</div>
				<div
					class="l-collateral__toggle-btn"
					:class="{'is-active': selectedCollateralToggleBtn === 1}"
					@click="handleCollateralToggle(1)">
					<label>
						<TheDot color="lime" />
						Total NUON Minted Value
						<ComponentLoader component="badge u-ml-8" :loaded="collateralRatioArr.length > 0">
							<TheBadge
								v-if="!isNaN(getChangePercent('mintedValue', collateralRatioArr, true))"
								class="u-ml-8"
								:color="getPercentChangeBadgeClass('mintedValue', collateralRatioArr, true)">
								{{ getUserMintedNuonSign }}{{ Math.abs(getChangePercent('mintedValue', collateralRatioArr, true)) }}%
							</TheBadge>
						</ComponentLoader>
					</label>
					<ComponentLoader component="h3" :loaded="balanceLoaded">
						<h3>${{ (graphSelectionMintedNuon) | toFixed | numberWithCommas }}</h3>
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
						:key="`${selectedPeriod}_${selectedCollateralToggleBtn}`"
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
		<AccountBalance :locked-amount="userTotalLockedCollateralAmount" data-v-step="6" />
		<TransactionHistory data-v-step="7" />
		<v-tour name="myDashboardTour" :steps="steps" :callbacks="tourCallbacks"></v-tour>
		<div v-if="mobileView" class="mobile-blocker">
			<NuonLogo />
			<div>
				<h1>Coming Soon To Your Mobile.</h1>
				<h4 class="u-text-right">Please View On Large Desktop.</h4>
			</div>
			<div class="tuned">
				<h4>Stay Tuned.</h4>
				<div class="follow">
					<a href="https://twitter.com/NuonFinance" target="_blank" rel="noopener noreferrer" title="Click to follow us on Twitter">
						<TwitterIcon />
					</a>
					<a href="https://t.me/NuonFinance" target="_blank" rel="noopener noreferrer" title="Click to chat with us on Telegram">
						<TelegramIcon />
					</a>
					<a href="https://nuonfinance.medium.com/" target="_blank" rel="noopener noreferrer" title="Click to follow us on Medium">
						<MediumIcon />
					</a>
					<a href="https://discord.com/invite/pWT49HTJJu" target="_blank" rel="noopener noreferrer" title="Click to follow us on Discord">
						<DiscordIcon />
					</a>
				</div>
			</div>
		</div>
	</LayoutContainer>
</template>

<script>
import dayjs from "dayjs";
import { getUserTVLDayData, setTheGraphUrl } from "~/services/theGraph";
import { NUON, USDT, WETH } from "~/constants/tokens";
import NuonLogo from "@/assets/images/logo/logo-nuon-lg.svg";
import DiscordIcon from "@/assets/images/svg/svg-discord-lg.svg";
import MediumIcon from "@/assets/images/svg/svg-medium-lg.svg";
import TelegramIcon from "@/assets/images/svg/svg-telegram-lg.svg";
import TwitterIcon from "@/assets/images/svg/svg-twitter-lg.svg";
import { LAST_CHAIN_ID } from "~/store/web3Store";

export default {
	name: "TheDashboard",
	components: {
		NuonLogo,
		DiscordIcon,
		MediumIcon,
		TelegramIcon,
		TwitterIcon
	},
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
						title: "Get Started Minting Nuon",
					},
					content: "This walkthrough tour will show you all the steps needed to mint your own Nuon. This page showcases all of the important information related to your positions on the Nuon Protocol.",
					params: {
						enableScrolling: false,
					}
				},
				{
					target: "[data-v-step=\"2\"]",
					content: "Click “Mint”, “Redeem” or “Manage” to instantly go to the appropriate page.",
				},
				{
					target: "[data-v-step=\"3\"]",
					header: {
						title: "Price and Peg Information",
					},
					content: "At the top of each page, the Nuon price and Target Peg are prominently displayed, along with the Soft Peg Gap. This information makes it easy to spot arbitrage opportunities.",
				},
				{
					target: "[data-v-step=\"4\"]",
					header: {
						title: "Account Health",
					},
					content: "This section gives you a broad overview of all your positions, showing the total value locked and collateralization ratio for each collateral asset.",
				},
				{
					target: "[data-v-step=\"5\"]",
					header: {
						title: "Total Locked Collateral and Nuon",
					},
					content: "This section shows your total locked collateral and minted Nuon, and how much these values have changed over time.",
				},
				{
					target: "[data-v-step=\"6\"]",
					header: {
						title: "Account Balance and Total Collateral Value",
					},
					content: "This section shows your Nuon and nuMINT balances, as well as the amount of collateral you have locked in the protocol and nuMINT locked in the Boardroom. On the right is the total value of your locked collateral, and how it varies over time.",
				},
				{
					target: "[data-v-step=\"7\"]",
					header: {
						title: "Transaction History",
					},
					content: "You can also view your entire transaction history at the bottom of the screen.",
				},
			],
			tourCallbacks: {
				onSkip: () => this.setCookie("skip_my_dashboard_tour"),
				onStop: () => this.setCookie("skip_my_dashboard_tour"),
				onFinish: () => this.setCookie("skip_my_dashboard_tour")
			},
			mobileView: false,
			collateralRatioArr: [],
			graphSelectionTVL: "",
			graphSelectionMintedNuon: "",
			balanceLoaded: false,
			selectedPeriod: 0,
			graphSelectionDuraton: "",
			actions:[
				{
					label: "Mint",
					handler: (row) => {
						this.$nuxt.$options.router.push(`/mint?action=0&collateral=${row.lockedCollateral}`);
					}
				},
				{
					label: "Redeem",
					handler: (row) =>  {
						this.$nuxt.$options.router.push(`/mint?action=1&collateral=${row.lockedCollateral}`);

					}
				},
				{
					label: "Manage",
					handler: (row) =>  {
						this.$nuxt.$options.router.push(`/manage?collateral=${row.lockedCollateral}`);
					}
				}
			],
			userMintedAmount: null,
			selectedCollateralToggleBtn: 0,
		};
	},
	head () {
		return {
			title: "Dashboard | NUON",
			meta: [
				{ hid: "dashboard", name: "description", content: "Nuon is the first flatcoin — an overcollateralized, inflation-shielded stablecoin. Mint Nuon here on the Nuon Protocol." },
				{ hid: "og-type", property: "og:type", content: "website" },
				{ hid: "og-title", property: "og:title", content: "Dashboard | NUON" },
				{ hid: "og-desc", property: "og:description", content: "Nuon is the first flatcoin — an overcollateralized, inflation-shielded stablecoin. Mint Nuon here on the Nuon Protocol." },
				{ hid: "og-image", property: "og:image", content: "https://nuon.fi/assets/img/opengraph-default.jpg" },
				{ hid: "og-url", property: "og:url", content: "https://app.nuon.fi/" },
				{ hid: "twitter", property: "twitter:card", content: "summary_large_image" },
			]
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
			const changePercent = this.getChangePercent("mintedValue", this.collateralRatioArr, true);
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
			if (this.selectedCollateralToggleBtn === 0)
				return this.lockedValueChartData.yData0 || [];
			else 
				return this.lockedValueChartData.yData1 || [];
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
					yData0:[{
						name: "My Total Value Locked",
						data: Object.values(weeks).map(d => d.value).reverse(),
						color: "#65b5ff"
					}],
					yData1:[{
						name: "My Total Minted Value",
						data: Object.values(weeks).map(d => d.mintedValue).reverse(),
						color: "#dfff65"
					}]
				};}
			if (this.selectedPeriod === 2) { // month
				return {
					xData: Object.keys(months).map(d => new Date(d).toLocaleDateString("default", { month: "short" })).reverse(),
					yData0: [{
						name: "My Total Value Locked",
						data: Object.values(months).map(d => d.value).reverse(),
						color: "#65b5ff"
					}], 
					yData1: [{
						name: "My Total Minted Value",
						data: Object.values(months).map(d => d.mintedValue).reverse(),
						color: "#dfff65"
					}]
				};
			};
			return {
				xData: this.collateralRatioArr.map(d => new Date(d.date * 1000).toLocaleDateString()).reverse(),
				yData0:[{
					name: "My Total Value Locked",
					data: this.collateralRatioArr.map(d => d.value).reverse(),
					color: "#65b5ff"
				}],
				yData1:[{
					name: "My Total Minted Value",
					data: this.collateralRatioArr.map(d => d.mintedValue).reverse(),
					color: "#dfff65"
				}]
			};
		},
	},
	watch: {
		connectedAccount(newValue) {
			if (newValue) this.initialize(this.collaterals);
		},
		yAxisData() {
			this.handleMouseOverChart(-1);
		},
		lockedValueChartData() {
			this.graphSelectionMintedNuon = this.lockedValueChartData.yData1[0].data[this.lockedValueChartData.yData1[0].data.length - 1];
		}
	},
	mounted() {
		this.mobileView = this.isMobile();
		this.initialize(this.collaterals);
		this.handleMouseOverChart(-1);
		if (!$cookies.get("skip_my_dashboard_tour")) this.$tours.myDashboardTour.start();
		this.$gtm.push({ event: "visited", name: "Dashboard"  });
	},
	methods: {
		async initialize(collaterals) {
			try {
				for (let i = 0; i < collaterals.length; i++) {
					const collateral = collaterals[i];
					await this.$store.dispatch("collateralVaultStore/changeCollateral", collateral);
				}
				this.getDiffMinted();
			} catch (e) {
			} finally {
				setTimeout(() => {
					this.balanceLoaded = true;
				}, 500);
			}
		},
		getDiffMinted() {
			setTheGraphUrl(localStorage.getItem(LAST_CHAIN_ID));
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
			if (this.selectedCollateralToggleBtn === 0) {
				this.graphSelectionTVL = this.yAxisData[0]?.data[idx];
			} else {
				this.graphSelectionMintedNuon = this.yAxisData[0]?.data[idx];
			}
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
		handleCollateralToggle(selectedIndex) {
			this.selectedCollateralToggleBtn = selectedIndex;
		}
	}
};
</script>
