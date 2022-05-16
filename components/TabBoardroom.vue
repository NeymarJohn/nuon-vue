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
		<TheTab title="Stake">
			<TransactionTable
				size="6"
				aria="Boardroom stake transactions"
				:columns="['Token Type', 'Amount', 'Fees', 'Final Amount', 'Date', 'TX Status']" />
		</TheTab>
		<TheTab title="Unstake">
			<TransactionTable
				size="8"
				aria="Boardroom unstake transactions"
				:columns="['Token Type', 'Amount', 'Reward Tokens', 'Reward Amount', 'Fees', 'Final Amount', 'Date', 'TX Status']" />
		</TheTab>
		<TheTab title="Proposal">
			<TransactionTable
				size="5"
				aria="Boardroom proposal transactions"
				:columns="['Proposal Name', 'Start Date', 'Amount', 'Status', 'TX Status']" />
		</TheTab>
		<TheTab title="Votes">
			<TransactionTable
				size="5"
				aria="Boardroom vote transactions"
				:columns="['Proposal Name', 'Choice', 'Block Number', 'Voting Power', 'TX Status']" />
		</TheTab>
	</TheTabs>
</template>

<script>
export default {
	name: "TabBoardroom",
	data() {
		return {
			filterOption: "All",
		};
	},
};
</script>
