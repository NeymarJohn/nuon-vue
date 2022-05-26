<template>
	<TheTabs size="thin" color="dark" margin="0">
		<TheTab title="Above Peg" margin="-54">
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
					aria="Stability zone above peg transactions"
					:data="users"
					:config="stabilityZoneConfig" />
			</TheLoader>
		</TheTab>
		<TheTab title="Below Peg" margin="-54">
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
					aria="Stability zone below peg transactions"
					:data="users"
					:config="stabilityZoneConfig" />
			</TheLoader>
		</TheTab>
	</TheTabs>
</template>

<script>
export default {
	name: "TabStabilityZone",
	computed: {
		stabilityZoneConfig() {
			return this.$store.state.transactionStore.stabilityZoneConfig;
		},
	},
	mounted() {
		this.$store.dispatch("transactionStore/loadUsers");
		this.$store.commit("rootStore/setIsLoaded", true);
	},
};
</script>
