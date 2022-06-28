<template>
	<LayoutContainer>
		<PageTitle class="u-mb-48">
			<h4>My Dashboard</h4>
			<h1>Portfolio Details</h1>
		</PageTitle>
		<h2 class="u-mb-24">Account Balance</h2>
		<LayoutFlex direction="row l-chart chart">
			<LayoutFlex direction="column" class="balance-first">
				<LayoutFlex direction="column">
					<p>Total value</p>
					<h1 class="u-mb-24">${{totalValue | toFixed | numberWithCommas}}</h1>
				</LayoutFlex>
				<LayoutFlex direction="row-center-space-around l-flex--wrap">
					<div><DonutChartBalance :chart-data="[1,2,3]" /></div>
					<div>
						<LayoutFlex direction="row-center">
							<div class="dot orange"></div>
							<p>Balance</p>
						</LayoutFlex>
						<h3>${{balancesValue | toFixed | numberWithCommas}}</h3>
					</div>
					<div>
						<LayoutFlex direction="row-center">
							<div class="dot blue"></div>
							<p>Collateral locked</p>
						</LayoutFlex>
						<h3>${{myCollateralLocked | toFixed | numberWithCommas}}</h3>
					</div>
					<div>
						<LayoutFlex direction="row-center">
							<div class="dot tourquise"></div>
							<p>Staked</p>
						</LayoutFlex>
						<h3>${{stakedBalance | toFixed | numberWithCommas}}</h3>
					</div>
				</LayoutFlex>
			</LayoutFlex>
			<div class="balance-second">
				<p>Pending Rewards</p>
				<h1>{{pendingRewards | toFixed | numberWithCommas}}<sup>HX</sup></h1>
				<h3>${{rewardsDollarValue | toFixed | numberWithCommas }}</h3>
			</div>
		</LayoutFlex>
		<h2 class="u-mb-24">My Collateral Hub</h2>
		<LayoutFlex direction="column l-chart chart">
			<LayoutFlex direction="row">
				<LayoutFlex direction="column" class="u-flex-1">
					<p>My Total Value Locked</p>
					<h1 class="u-mb-24">${{tvl | toFixed | numberWithCommas}}</h1>
				</LayoutFlex>
				<LayoutFlex direction="column" class="u-flex-1">
					<p>My Total Minted Nuon Value</p>
					<h1 class="u-mb-24">${{totalMintedNuonValue | toFixed | numberWithCommas}}</h1>
				</LayoutFlex>
				<LayoutFlex direction="column" class="u-flex-1">
					<p>My Collateralization Ratio</p>
					<h1 class="u-mb-24">${{myCollateralizationRatio | toFixed | numberWithCommas}}</h1>
				</LayoutFlex>
			</LayoutFlex>
			<LineChart
				class="u-mt-32"
				:x-axis-labels="['a', 'b', 'c']"
				:series-data="[{name: 'test1', data: [1, 2, 3]}, {name: 'test2', data: [2, 3, 4]}]"
				@mouseOverDataPoint="handleMouseOverChart"
			/>
			<TheLoader component="table">
				<TransactionTable
					v-if="!mobileView"
					size="4"
					aria=""
					:data="chubData"
					:config="configData"
					:misc="miscConfig" />
				<TransactionCard
					v-else
					:data="chubData"
					:config="configData" />
			</TheLoader>
		</LayoutFlex>
		<h2 class="u-mb-24">Transaction History</h2>
		<TheTabs size="full-width" color="mobile-scroll tabs--dark" margin="sm-24">
			<TheTab title="Collateral Hub">
				<TabCollateralHub />
			</TheTab>
			<TheTab title="Swap">
				<TabSwap />
			</TheTab>
			<TheTab title="Boardroom">
				<TabBoardroom />
			</TheTab>
			<TheTab title="Rewards">
				<TabRewards />
			</TheTab>
		</TheTabs>
	</LayoutContainer>
</template>

<script>
import { fromWei } from "~/utils/bnTools";
export default {
	name: "MyDashboard",
	data() {
		return {
			pendingRewards: 0,
			rewardsDollarValue: 0,
			tvl: 0,
			totalMintedNuonValue: 0,
			myCollateralizationRatio: 0,
			configData: [{title: "My Locked Collateral", id: "lockedCollateral"},
				{title: "My Total Locked Value", id: "lockedValue"},
				{title: "My Total Minted Nuon", id: "mintedNuon"},
				{title: "My Collateralization Ratio", id: "collateralizationRatio"},
				{title: "Collateralization Current Price", id: "currentPrice"}],
			chubData: [{lockedCollateral: "ETH", lockedValue: "$1245.00", mintedNuon: "$700.00", collateralizationRatio: "200%", currentPrice: "$100.00"},
				{lockedCollateral: "ETH", lockedValue: "$1245.00", mintedNuon: "$700.00", collateralizationRatio: "200%", currentPrice: "$100.00"},
				{lockedCollateral: "ETH", lockedValue: "$1245.00", mintedNuon: "$700.00", collateralizationRatio: "200%", currentPrice: "$100.00"}],
			miscConfig: {hasImage: {lockedCollateral: "ETH"}},
			mobileView: false,
		};
	},
	head () {
		return {
			title: "My Dashboard | Nuon"
		};
	},
	computed: {
		balancesValue() {
			return this.tokenBalances.HX * this.tokenPrices.HX + this.tokenBalances.NUON * this.tokenPrices.NUON;
		},
		stakedBalance() {
			const stakedBalance = this.$store.state.boardroomStore.stakedBalance;
			return fromWei(stakedBalance);
		},
		myCollateralLocked() {
			return fromWei(this.$store.state.collateralVaultStore.userCollateralAmount);
		},
		totalValue() {
			return Number(this.balancesValue) + Number(this.stakedBalance) + Number(this.myCollateralLocked);
		},
		balancesPercentage() {
			return Number(this.balancesValue) / this.totalValue * 100;
		},
		stakedBalancePercentage() {
			return Number(this.stakedBalance) / this.totalValue * 100;
		},
		myCollateralLockedPercentage() {
			return Number(this.myCollateralLocked) / this.totalValue * 100;
		}
	},
	mounted() {
		this.mobileView = this.isMobile();
	},
	methods: {
		handleMouseOverChart(e) {
			console.log(e);
		}
	}
};
</script>
