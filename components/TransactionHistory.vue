<template>
	<div>
		<h2 class="u-mb-24">Transaction History</h2>
		<TheTabs size="full-width" color="mobile-scroll tabs--dark" margin="sm-24" @tab-changed="changeTab">
			<TheTab title="Collateral Hub" />
			<TheTab title="Swap" />
			<TheTab title="Boardroom" />
			<TheTab title="Rewards" />
		</TheTabs>
		<div class="tabs__filter">
			<TransactionSearch class="u-half-width-md"/>
			<TheSelect
				:options="selectOptions"
				:default="dateFilterComputed || 'All'"
				label="Filter by date"
				@filter-select="onDateFilterChange" />
		</div>
		<TheLoader component="table">
			<TransactionTable
				v-if="!mobileView"
				size="4"
				aria="Collateral hub redeemed transactions"
				:data="tableData"
				:config="transactionConfig"
				:table-data="locations[selectedTab]" />
			<TransactionCard
				v-else
				:data="tableData"
				:config="transactionConfig" />
		</TheLoader>
	</div>
</template>
<script>
import { nuMINT, NUON } from "~/constants/tokens";
import { getCollateralTransactionHistory, getSwapTransactionHistory, getStakingTransactionHistory, getRewardTransactionHistory } from "~/services/theGraph";

export default {
	name: "TransactionHistory",
	data() {
		return {
			tableData: [],
			selectedTab: 0,
			filterLastDays: 0,
			locations: ["collateral", "swap", "boardroom", "rewoard"],
			selectOptions: [
				{label: "All", value: 0},
				{label: "Past 7 Days", value: 7},
				{label: "Past 30 Days", value: 30},
				{label: "Past 90 Days", value:90},
			],
			mobileView: false,
		};
	},
	computed: {
		searchQuery() {
			return this.$store.state.transactionStore.search;
		},
	},
	watch: {
		searchQuery() {
			this.searchTransactions();
		},
		connectedAccount() {
			this.searchTransactions();
		}
	},
	mounted () {
		this.searchTransactions();
		this.mobileView = this.isMobile();
	},
	methods: {
		searchTransactions() {
			if (this.connectedAccount) {
				const filter = {
					user: this.connectedAccount,
					location: this.locations[this.selectedTab],
					lastDays: this.filterLastDays,
					query: this.searchQuery
				};
				this.tableData = [];
				if (this.locations[this.selectedTab] === "collateral") {
					getCollateralTransactionHistory(filter).then(res => {
						this.tableData = res.data.data.collateralHubTransactions.map(item => (
							{
								...item,
								amount: item.input,
								totalAmount: item.output,
								inputToken: item.depositToken.symbol,
								outputToken: NUON.symbol,
								date: item.date * 1000,
								selectedTab: this.locations[this.selectedTab],
								txHash: item.id
							}));
					});
				} else if (this.locations[this.selectedTab] === "swap") {
					getSwapTransactionHistory(filter).then(res => {
						this.tableData = res.data.data.swaps.map(item => (
							{
								...item,
								amount: Number(item.amount0In) || Number(item.amount1In),
								totalAmount: Number(item.amount0Out) || Number(item.amount1Out),
								inputToken: item.amount0In>0?item.pair.token0.symbol:item.pair.token1.symbol,
								outputToken: item.amount0Out>0?item.pair.token0.symbol:item.pair.token1.symbol,
								date: item.timestamp * 1000,
								selectedTab: this.locations[this.selectedTab],
								txHash: item.transaction.id
							}));
					});
				} else if (this.locations[this.selectedTab] === "boardroom") {
					getStakingTransactionHistory(filter).then(res => {
						this.tableData = res.data.data.boardroomTransactions.map(item => (
							{
								...item,
								date: item.date * 1000,
								inputToken: nuMINT.symbol,
								outputToken: nuMINT.symbol,
								txHash: item.id
							}));
					});
				} else {
					getRewardTransactionHistory(filter).then(res => {
						this.tableData = res.data.data.getRewardTransactionHistory.map(item => (
							{
								...item,
								amount: item.amount,
								date: item.datetime * 1000,
								txHash: item.id,
								inputToken: nuMINT.symbol,
								outputToken: nuMINT.symbol,
							}));
					});
				}
			}
		},
		changeTab(tabIndex) {
			this.selectedTab = tabIndex;
			this.searchTransactions();
		},
		onDateFilterChange(option) {
			this.filterLastDays = option.value;
			this.searchTransactions();
		}
	},
};
</script>

