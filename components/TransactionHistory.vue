<template>
	<div class="u-mb-72">
		<h2 class="u-mb-24">Transaction History</h2>
		<div class="tabs__filter">
			<TransactionSearch class="u-half-width-md"/>
			<LayoutFlex direction="row-justify-end">
				<TheSelect
					class="u-mr-64"
					:options="filterOptions"
					inline
					label="Filter"
					@filter-select="onChangeFilter" />
				<TheSelect
					:options="selectOptions"
					:default="dateFilterComputed || 'All'"
					inline
					label="Date"
					@filter-select="onDateFilterChange" />
			</LayoutFlex>
		</div>
		<TheLoader component="table">
			<TransactionTable
				v-if="!mobileView"
				size="history"
				aria="Collateral hub redeemed transactions"
				:data="tableData"
				:config="transactionConfig"
				:loading="isLoading"
				:table-data="selectedFilter" />
		</TheLoader>
	</div>
</template>
<script>
import { BUSD, nuMINT, NUON } from "~/constants/tokens";
import { 
	setTheGraphUrl,  
	getCollateralTransactionHistory, 
	getSwapTransactionHistory, 
	getStakingTransactionHistory, 
	getRewardTransactionHistory 
} from "~/services/theGraph";
import { LAST_CHAIN_ID } from "~/store/web3Store";

export default {
	name: "TransactionHistory",
	data() {
		return {
			tableData: [],
			selectedTab: 0,
			selectedFilter: "collateral",
			filterLastDays: 0,
			locations: ["collateral", "swap", "boardroom", "reward"],
			selectOptions: [
				{label: "All", value: 0},
				{label: "Past 7 Days", value: 7},
				{label: "Past 30 Days", value: 30},
				{label: "Past 90 Days", value:90},
			],
			filterOptions: [
				{label: "Collateral", value: "collateral"},
				{label: "Swap", value: "swap"},
				{label: "Boardroom", value: "boardroom"},
				{label: "Reward", value: "reward"},
			],
			mobileView: false,
			isLoading: false,
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
		setTheGraphUrl(localStorage.getItem(LAST_CHAIN_ID));
		this.searchTransactions();
		this.mobileView = this.isMobile();
	},
	methods: {
		searchTransactions() {
			if (this.connectedAccount) {
				const filter = {
					user: this.connectedAccount,
					location: this.selectedFilter,
					lastDays: this.filterLastDays,
					query: this.searchQuery
				};
				this.tableData = [];
				this.isLoading = true;
				if (this.selectedFilter === "collateral") {
					getCollateralTransactionHistory(filter).then(res => {
						this.isLoading = false;
						this.tableData = res.data.data.collateralHubTransactions.map(item => (
							{
								...item,
								amount: item.input,
								totalAmount: item.output,
								inputToken: item.depositToken.symbol,
								outputToken: NUON.symbol,
								date: item.date * 1000,
								selectedTab: this.selectedFilter,
								txHash: item.id
							}));
					});
				} else if (this.selectedFilter === "swap") {
					getSwapTransactionHistory(filter).then(res => {
						this.isLoading = false;
						this.tableData = res.data.data.swaps.map(item => (
							{
								...item,
								amount: Number(item.amount0In) || Number(item.amount1In),
								totalAmount: Number(item.amount0Out) || Number(item.amount1Out),
								inputToken: item.amount0In>0?item.pair.token0.symbol:item.pair.token1.symbol,
								outputToken: item.amount0Out>0?item.pair.token0.symbol:item.pair.token1.symbol,
								date: item.timestamp * 1000,
								selectedTab: this.selectedFilter,
								txHash: item.transaction.id
							}));
					});
				} else if (this.selectedFilter === "boardroom") {
					getStakingTransactionHistory(filter).then(res => {
						this.isLoading = false;
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
						this.isLoading = false;
						this.tableData = res.data.data.rewardTransactions.map(item => (
							{
								...item,
								amount: item.amount,
								totalAmount: item.amount,
								date: item.dateTime * 1000,
								txHash: item.id,
								inputToken: BUSD.symbol,
								outputToken: BUSD.symbol,
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
		},
		onChangeFilter(option) {
			this.selectedFilter = option.value;
			this.searchTransactions();
		}
	},
};
</script>

