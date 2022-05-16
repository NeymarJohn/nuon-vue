<template>
	<TheTabs size="thin" color="dark">
		<template #filter>
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
		</template>
		<TheTab title="Above Peg">
			<TransactionTable
				size="6"
				aria="Stability zone above peg transactions"
				:columns="['Token Type', 'Amount', 'Fees', 'Final Amount', 'Date', 'TX Status']" />
		</TheTab>
		<TheTab title="Below Peg">
			<TransactionTable
				size="6"
				aria="Stability zone below peg transactions"
				:columns="['Token Type', 'Amount', 'Fees', 'Final Amount', 'Date', 'TX Status']" />
		</TheTab>
	</TheTabs>
</template>

<script>
export default {
	name: "TabStabilityZone",
	data() {
		return {
			filterOption: "All",
		};
	},
};
</script>
