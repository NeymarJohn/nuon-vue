<template>
	<TheTabs size="thin" color="dark">
		<template #filter>
			<div class="tabs__filter">
				<TheSelect
					:options="['All', 'USX', 'HX', 'USDC']"
					:default="'All'"
					label="Token"
					@filter-select="onFilterChange" />
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
		<TheTab title="Stake HX">
			<TransactionTable
				size="6"
				aria="Staked HX reward transactions"
				:columns="['Reward Token', 'Reward Amount', 'Fees', 'Total Claimed', 'Date', 'TX Status']"
				:rows="['TNODE', '200.00TNode', '5%', '1,900.95TNode', '2022-04-05 22:34:50', 'Success']" />
		</TheTab>
		<TheTab title="Burn HX">
			<TransactionTable
				size="7"
				aria="Burned HX reward transactions"
				:columns="['Reward Token', 'Reward Amount', 'Claim Ratio', 'Fees', 'Total Claimed', 'Date', 'TX Status']"
				:rows="['TNODE', '200.00TNode', '20%', '5%', '1,900.95TNode', '2022-04-05 22:34:50', 'Success']" />
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
