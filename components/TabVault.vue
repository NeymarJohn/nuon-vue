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
			<TheLoader component="table">
				<TransactionTable
					size="7"
					aria="Vault minted transactions"
					:data="users"
					:config="mintedConfig" />
			</TheLoader>
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
			<TheLoader component="table">
				<TransactionTable
					size="7"
					aria="Vault redeemed transactions"
					:data="users"
					:config="redeemedConfig" />
			</TheLoader>
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
		this.$store.commit("rootStore/setIsLoaded", true);
	}
};
</script>
