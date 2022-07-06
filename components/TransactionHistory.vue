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
			<TransactionSearch />
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
				aria="Vault redeemed transactions"
				:data="tableData"
				:config="transactionConfig" />
			<TransactionCard
				v-else
				:data="tableData"
				:config="transactionConfig" />
		</TheLoader>
	</div>
</template>
<script>
import { getUserTransactionHistory } from "~/services/theGraph";

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
				getUserTransactionHistory(filter).then(res => {
					this.tableData = res.data.data.userTransactions.map(item => ({...item, date: item.date * 1000}));
				});
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

