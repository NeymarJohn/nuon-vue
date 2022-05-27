<template>
	<div>
		<div class="tabs__filter">
			<div class="select">
				<label>Search</label>
				<input :value="transactionSearch" type="text" class="search__input" @change="setTransactionSearch" />
			</div>
			<TheSelect
				:options="['All', 'Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
				:default="dateFilterComputed || 'All'"
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
	mounted() {
		this.$store.dispatch("transactionStore/loadUsers");
		this.$store.commit("rootStore/setIsLoaded", true);
	},
};
</script>
