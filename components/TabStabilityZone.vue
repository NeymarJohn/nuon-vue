<template>
	<div>
		<div class="tabs__filter">
			<TheSelect
				:options="['All', 'Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
				:default="'All'"
				label="Date"
				@filter-select="onDateFilterChange" />
		</div>
		<TheLoader component="table">
			<TransactionTable
				size="4"
				aria="Stability zone above peg transactions"
				:data="filteredData"
				:config="transactionConfig" />
		</TheLoader>
	</div>
</template>

<script>
export default {
	name: "TabStabilityZone",
	data() {
		return {
			dateFilter: "",
		};
	},
	mounted() {
		this.$store.dispatch("transactionStore/loadUsers");
		this.$store.commit("rootStore/setIsLoaded", true);
	},
};
</script>
