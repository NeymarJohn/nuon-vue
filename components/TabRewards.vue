<template>
	<TheTabs size="thin" color="dark">
		<template #filter>
			<div class="tabs__filter">
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="Token"
					@filter-select="onFilterChange" />
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
		<TheTab title="Stake HX">
			<TransactionTable
				size="6"
				aria="Staked HX reward transactions"
				:columns="['Reward Token', 'Reward Amount', 'Fees', 'Total Claimed', 'Date', 'TX Status']" />
		</TheTab>
		<TheTab title="Burn HX">
			<TransactionTable
				size="7"
				aria="Burned HX reward transactions"
				:columns="['Reward Token', 'Reward Amount', 'Claim Ratio', 'Fees', 'Total Claimed', 'Date', 'TX Status']" />
		</TheTab>
	</TheTabs>
</template>

<script>
export default {
	name: "TabRewards",
	data() {
		return {
			filterOption: "All",
		};
	},
};
</script>
