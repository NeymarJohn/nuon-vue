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
				<LayoutFlex direction="row-center-space-around">
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
			rewardsDollarValue: 0
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
};
</script>
