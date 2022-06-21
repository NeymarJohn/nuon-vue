<template>
	<LayoutContainer>
		<PageTitle class="u-mb-48">
			<h4>My Dashboard</h4>
			<h1>Portfolio Details</h1>
		</PageTitle>
		<h2 class="u-mb-24">Account Balance</h2>
		<div class="l-chart l-chart--account-balance u-mb-80">
			<LayoutFlex class="l-flex--column-sm">
				<div class="chart">
					<p>Total Value</p>
					<h1 class="u-mb-24">${{totalValue | toFixed | numberWithCommas}}</h1>
					<p>Balance</p>
					<h3>${{balancesValue | toFixed | numberWithCommas}}</h3>
					<div class="progress u-mb-10">
						<div class="progress__bar progress__bar--balance" :style="`width: ${balancesPercentage}%`"></div>
						<h5>{{balancesPercentage | toFixed}}%</h5>
					</div>
					<LayoutFlex class="u-mb-20">
						<TheBadge class="u-mr-8" color="balance">{{tokenBalances.HX | toFixed | numberWithCommas}} HX</TheBadge>
						<TheBadge color="balance">{{tokenBalances.NUON | toFixed | numberWithCommas}} Nuon</TheBadge>
					</LayoutFlex>
					<p>Collateral locked</p>
					<h3>${{myCollateralLocked | toFixed | numberWithCommas}}</h3>
					<div class="progress u-mb-20">
						<div class="progress__bar progress__bar--locked" :style="`width: ${myCollateralLockedPercentage}%`"></div>
						<h5>{{myCollateralLockedPercentage | toFixed}}%</h5>
					</div>
					<p>Staked</p>
					<h3>${{stakedBalance | toFixed | numberWithCommas}}</h3>
					<div class="progress">
						<div class="progress__bar progress__bar--staked" :style="`width: ${stakedBalancePercentage}%`"></div>
						<h5>{{stakedBalancePercentage | toFixed}}%</h5>
					</div>
				</div>
				<div class="chart chart--donut">
					<LayoutFlex class="u-mb-16" direction="column">
						<p class="u-mb-4">Total claimable rewards</p>
						<h1 class="u-mb-4">1,233.00<sup>HX</sup></h1>
						<h5>$12,343.34</h5>
					</LayoutFlex>
					<LayoutFlex direction="row-start-space-between" class="l-flex--column-sm">
						<TheLoader component="donut-claimable" class="u-mb-24 u-full-width u-mr-24 u-mr-sm-0">
							<DonutChartRewards />
						</TheLoader>
						<LayoutFlex direction="column">
							<LayoutFlex class="u-mb-8 l-flex--column-start-sm" direction="column-end">
								<p class="u-mb-8"><TheBadge class="u-mr-4" color="key badge--light-green" /> Staked Rewards</p>
								<h1 class="u-mb-8">234.00<sup>HX</sup></h1>
								<TheButton title="Click to start claiming">Start Claiming</TheButton>
							</LayoutFlex>
							<LayoutFlex class="l-flex--column-start-sm" direction="column-end">
								<p class="u-mb-8"><TheBadge class="u-mr-4" color="key badge--orange" /> Burned Token Rewards</p>
								<h1 class="u-mb-8">999.00<sup>HX</sup></h1>
								<TheButton title="Click to start claiming">Start Claiming</TheButton>
							</LayoutFlex>
						</LayoutFlex>
					</LayoutFlex>
				</div>
			</LayoutFlex>
		</div>
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
