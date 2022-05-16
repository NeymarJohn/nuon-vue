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
		<TransactionTable
			size="8"
			aria="Swap transactions"
			:columns="['From', 'To', 'Max Slippage', 'Min. Received', 'Price Impace', 'Fees', 'Date', 'TX Status']"
			:rows="['200.00HX', '0.0439.00ETH', '0.5%', '0.0345.03ETH', '0.02%', '5%', '2022-04-05 22:34:50', 'Success']" />
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
