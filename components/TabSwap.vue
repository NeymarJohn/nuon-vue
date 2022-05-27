<template>
	<div>
		<div class="tabs__filter">
			<TheSelect
				:options="['All', 'Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
				:default="dateFilterComputed || 'All'"
				label="Date"
				@filter-select="onDateFilterChange" />
		</div>
		<TheLoader component="table">
			<TransactionTable
				size="4"
				aria="Swap transactions"
				:data="filteredData"
				:config="transactionConfig" />
		</TheLoader>
	</div>
</template>

<script>
export default {
	name: "TabSwap",
	mounted() {
		this.$store.dispatch("transactionStore/loadUsers");
		this.$store.commit("rootStore/setIsLoaded", true);
	},
};
</script>
