<template>
	<TheTabs size="thin" color="dark" margin="0">
		<TheTab title="Staked HX" margin="-54">
			<div class="tabs__filter">
				<TheSelect
					:options="['Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
					:default="'Past 7 Days'"
					label="Date"
					@filter-select="onDateFilterChange" />
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="Status"
					@filter-select="onStatusFilterChange" />
			</div>
			<TheLoader component="table">
				<TransactionTable
					size="6"
					aria="Staked HX reward transactions"
					:data="filteredData"
					:config="stakedHxConfig" />
			</TheLoader>
		</TheTab>
		<TheTab title="Burnt HX" margin="-54">
			<div class="tabs__filter">
				<TheSelect
					:options="['Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
					:default="'Past 7 Days'"
					label="Date"
					@filter-select="onDateFilterChange" />
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="Status"
					@filter-select="onStatusFilterChange" />
			</div>
			<TheLoader component="table">
				<TransactionTable
					size="7"
					aria="Burnt HX reward transactions"
					:data="filteredData"
					:config="burntHxConfig" />
			</TheLoader>
		</TheTab>
	</TheTabs>
</template>

<script>
import dayjs from "dayjs";

export default {
	name: "TabRewards",
	data() {
		return {
			dateFilter: "",
			statusFilter: ""
		};
	},
	computed: {
		stakedHxConfig() {
			return this.$store.state.transactionStore.stakedHxConfig;
		},
		burntHxConfig() {
			return this.$store.state.transactionStore.burntHxConfig;
		},
		filteredData() {
			let data = this.users;

			if (this.dateFilter) {
				const days = parseInt(this.dateFilter.split(" ")[1]);
				data = data.filter(d => new Date(d.date) > new Date(dayjs().subtract(days, "day").$d));
			}

			if (this.statusFilter) {
				data = data.filter(d => d.txStatus === this.statusFilter);
			}

			return data;
		}
	},
	mounted() {
		this.$store.dispatch("transactionStore/loadUsers");
		this.$store.commit("rootStore/setIsLoaded", true);
	},
};
</script>
