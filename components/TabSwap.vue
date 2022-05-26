<template>
	<div>
		<div class="tabs__filter">
			<TheSelect
				:options="['All', 'Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
				:default="'All'"
				label="Date"
				@filter-select="onDateFilterChange" />
		</div>
		<TheLoader component="table">
			<TransactionTable
				size="4"
				aria="Swap transactions"
				:data="filteredData"
				:config="transactionConfig" />
		</TheLoader>
	</div>
</template>

<script>
import dayjs from "dayjs";

export default {
	name: "TabSwap",
	data() {
		return {
			dateFilter: "",
			statusFilter: ""
		};
	},
	computed: {
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
