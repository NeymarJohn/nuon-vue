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
				v-if="users"
				size="7"
				aria="Vault minted transactions"
				:data="users"
				:config="mintedConfig" />
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
				v-if="users"
				size="7"
				aria="Vault redeemed transactions"
				:data="users"
				:config="redeemedConfig" />
		</TheTab>
	</TheTabs>
</template>

<script>
export default {
	name: "TabVault",
	computed: {
		mintedConfig() {
			return this.$store.state.transactionStore.mintedConfig;
		},
		redeemedConfig() {
			return this.$store.state.transactionStore.redeemedConfig;
		}
	},
	mounted() {
		this.$store.dispatch("transactionStore/loadUsers");
	}
};
</script>
