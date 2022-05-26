<template>
	<TheTabs size="thin" color="dark" margin="0">
		<TheTab title="Above Peg" margin="-54">
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
					aria="Stability zone above peg transactions"
					:data="filteredData"
					:config="stabilityZoneConfig" />
			</TheLoader>
		</TheTab>
		<TheTab title="Below Peg" margin="-54">
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
					aria="Stability zone below peg transactions"
					:data="filteredData"
					:config="stabilityZoneConfig" />
			</TheLoader>
		</TheTab>
	</TheTabs>
</template>

<script>
import dayjs from "dayjs";

export default {
	name: "TabStabilityZone",
	data() {
		return {
			dateFilter: "",
			statusFilter: ""
		};
	},
	computed: {
		stabilityZoneConfig() {
			return this.$store.state.transactionStore.stabilityZoneConfig;
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
