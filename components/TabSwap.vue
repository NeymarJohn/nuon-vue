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
			v-if="tableData"
			size="8"
			aria="Swap transactions"
			:data="tableData"
			:config="config" />
	</div>
</template>

<script>
export default {
	name: "TabSwap",
	data() {
		return {
			filterOption: "All",
			tableData: [],
			config: [
				{
					id: "from",
					title: "From"
				},
				{
					id: "to",
					title: "To"
				},
				{
					id: "slippage",
					title: "Max Slippage"
				},
				{
					id: "received",
					title: "Min. Received"
				},
				{
					id: "priceImpact",
					title: "Price Impact"
				},
				{
					id: "fees",
					title: "Fees",
				},
				{
					id: "date",
					title: "Date",
				},
				{
					id: "status",
					title: "TX Status"
				}
			]
		};
	},
	mounted() {
		this.$axios.get("https://628c722ba3fd714fd0322bbd.mockapi.io/users")
			.then(({data}) => {
				this.tableData = data;
			});
	}
};
</script>
