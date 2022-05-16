<template>
	<div>
		<div class="tabs__filter">
			<TheSelect
				:options="['All', 'Active', 'Pending', 'Closed']"
				:default="'All'"
				label="Date"
				@filter-select="onFilterChange" />
			<TheSelect
				:options="['All', 'Active', 'Pending', 'Closed']"
				:default="'All'"
				label="Status"
				@filter-select="onFilterChange" />
		</div>
		<TransactionTable
			size="8"
			aria="Swap transactions"
			:columns="['From', 'To', 'Max Slippage', 'Min. Received', 'Price Impace', 'Fees', 'Date', 'TX Status']" />
	</div>
</template>

<script>
export default {
	name: "TabSwap",
	data() {
		return {
			filterOption: "All",
		};
	},
};
</script>
