<template>
	<TheTabs size="thin" color="dark">
		<template #filter>
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
		</template>
		<TheTab title="Above Peg">
			<TransactionTable
				size="6"
				aria="Stability zone above peg transactions"
				:columns="['Token Type', 'Amount', 'Fees', 'Final Amount', 'Date', 'TX Status']"
				:rows="['HX', '200.00HX', '5%', '1,900.95HX', '2022-04-05 22:34:50', 'Success']" />
		</TheTab>
		<TheTab title="Below Peg">
			<TransactionTable
				size="6"
				aria="Stability zone below peg transactions"
				:columns="['Token Type', 'Amount', 'Fees', 'Final Amount', 'Date', 'TX Status']"
				:rows="['USX', '200.00USX', '5%', '1,900.95USX', '2022-04-05 22:34:50', 'Success']" />
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
