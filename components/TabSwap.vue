<template>
	<div>
		<div class="tabs__filter">
			<TheSelect
				:options="['Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
				:default="'Past 7 Days'"
				label="Date"
				@filter-select="onFilterChange" />
			<TheSelect
				:options="['All', 'Active', 'Pending', 'Closed']"
				:default="'All'"
				label="Status"
				@filter-select="onFilterChange" />
		</div>
		<TheLoader component="table">
			<TransactionTable
				size="8"
				aria="Swap transactions"
				:data="users"
				:config="swapConfig" />
		</TheLoader>
	</div>
</template>

<script>
export default {
	name: "TabSwap",
	computed: {
		swapConfig() {
			return this.$store.state.transactionStore.swapConfig;
		},
	},
	mounted() {
		this.$store.dispatch("transactionStore/loadUsers");
		this.$store.commit("rootStore/setIsLoaded", true);
	},
};
</script>
