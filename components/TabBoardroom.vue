<template>
	<TheTabs size="thin" color="dark" margin="0">
		<TheTab title="Stake" margin="-54">
			<div class="tabs__filter">
				<TheSelect
					:options="['Partially', 'Exit']"
					:default="'Partially'"
					label="Withdraw Type"
					@filter-select="onFilterChange" />
				<TheSelect
					:options="['Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
					:default="'Past 7 Days'"
					label="Date"
					@filter-select="onFilterChange" />
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="TX Status"
					@filter-select="onFilterChange" />
			</div>
			<TransactionTable
				size="6"
				aria="Boardroom stake transactions"
				:columns="['Token Type', 'Amount', 'Fees', 'Final Amount', 'Date', 'TX Status']"
				:rows="['HX', '200.00USX', '5%', '1,900.95HX', '2022-04-05 22:34:50', 'Success']" />
		</TheTab>
		<TheTab title="Unstake" margin="-54">
			<div class="tabs__filter">
				<TheSelect
					:options="['Partially', 'Exit']"
					:default="'Partially'"
					label="Withdraw Type"
					@filter-select="onFilterChange" />
				<TheSelect
					:options="['Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
					:default="'Past 7 Days'"
					label="Date"
					@filter-select="onFilterChange" />
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="TX Status"
					@filter-select="onFilterChange" />
			</div>
			<TransactionTable
				size="8"
				aria="Boardroom unstake transactions"
				:columns="['Token Type', 'Amount', 'Reward Tokens', 'Reward Amount', 'Fees', 'Final Amount', 'Date', 'TX Status']"
				:rows="['HX', '200.00USX', 'TNODE', '23.00 TNODE', '5%', '$130.45', '2022-04-05 22:34:50', 'Success']" />
		</TheTab>
		<TheTab title="Proposal" margin="-54">
			<div class="tabs__filter">
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="Status"
					@filter-select="onFilterChange" />
				<TheSelect
					:options="['Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
					:default="'Past 7 Days'"
					label="Date"
					@filter-select="onFilterChange" />
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="TX Status"
					@filter-select="onFilterChange" />
			</div>
			<TransactionTable
				size="5"
				aria="Boardroom proposal transactions"
				:columns="['Proposal Name', 'Start Date', 'Amount', 'Status', 'TX Status']"
				:rows="['Should the Treasury Management and Diversification', '2022-04-05 22:34:50', '10.00HX', 'Pending', 'Success']" />
		</TheTab>
		<TheTab title="Votes" margin="-54">
			<div class="tabs__filter">
				<TheSelect
					:options="['Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
					:default="'Past 7 Days'"
					label="Date"
					@filter-select="onFilterChange" />
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="TX Status"
					@filter-select="onFilterChange" />
			</div>
			<TransactionTable
				size="5"
				aria="Boardroom vote transactions"
				:columns="['Proposal Name', 'Choice', 'Block Number', 'Voting Power', 'TX Status']"
				:rows="['Should the Treasury Management and Diversification', 'Yes', '15,343,345', '23.5%', 'Success']" />
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
