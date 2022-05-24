<template>
	<TheTabs size="thin" color="dark" margin="0">
		<TheTab title="Mint" margin="-54">
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
			<TransactionTable
				v-if="tableData"
				size="7"
				aria="Vault minted transactions"
				:data="tableData"
				:config="config" />
		</TheTab>
		<TheTab title="Redeem" margin="-54">
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
			<TransactionTable
				v-if="tableData"
				size="7"
				aria="Vault redeemed transactions"
				:data="tableData"
				:config="config" />
		</TheTab>
	</TheTabs>
</template>

<script>
export default {
	name: "TabVault",
	data() {
		return {
			filterOption: "All",
			tableData: [],
			config: [
				{
					id: "tokenType",
					title: "Token Type"
				},
				{
					id: "amount",
					title: "Amount"
				},
				{
					id: "minted",
					title: "Minted"
				},
				{
					id: "fees",
					title: "Fees"
				},
				{
					id: "finalAmount",
					title: "Final Amount"
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
