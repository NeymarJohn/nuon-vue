<template>
	<TheTabs size="thin" color="dark" margin="0">
		<TheTab title="Staked HX" margin="-54">
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
			<TheLoader component="table">
				<TransactionTable
					size="6"
					aria="Staked HX reward transactions"
					:data="users"
					:config="stakedHxConfig" />
			</TheLoader>
		</TheTab>
		<TheTab title="Burnt HX" margin="-54">
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
			<TheLoader component="table">
				<TransactionTable
					size="7"
					aria="Burnt HX reward transactions"
					:data="users"
					:config="burntHxConfig" />
			</TheLoader>
		</TheTab>
	</TheTabs>
</template>

<script>
export default {
	name: "TabRewards",
	computed: {
		stakedHxConfig() {
			return this.$store.state.transactionStore.stakedHxConfig;
		},
		burntHxConfig() {
			return this.$store.state.transactionStore.burntHxConfig;
		},
	},
	mounted() {
		this.$store.dispatch("transactionStore/loadUsers");
		this.$store.commit("rootStore/setIsLoaded", true);
	},
};
</script>
