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
		<TheTab title="Mint">
			<TransactionTable
				size="7"
				aria="Vault minted transactions"
				:columns="['Token Type', 'Amount', 'Minted', 'Fees', 'Final Amount', 'Date', 'TX Status']" />
		</TheTab>
		<TheTab title="Redeem">
			<TransactionTable
				size="7"
				aria="Vault redeemed transactions"
				:columns="['Token Type', 'Amount', 'Minted', 'Fees', 'Final Amount', 'Date', 'TX Status']" />
		</TheTab>
	</TheTabs>
</template>

<script>
export default {
	name: "TabVault",
	data() {
		return {
			filterOption: "All",
		};
	},
};
</script>
