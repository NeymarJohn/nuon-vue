<template>
	<TheTabs size="thin" color="dark" margin="0">
		<TheTab title="Staked" margin="-54">
			<div class="tabs__filter">
				<TheSelect
					:options="['Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
					:default="'Past 7 Days'"
					label="Date"
					@filter-select="onDateFilterChange" />
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="TX Status"
					@filter-select="onStatusFilterChange" />
			</div>
			<TheLoader component="table">
				<TransactionTable
					size="6"
					aria="Boardroom staked transactions"
					:data="filteredData"
					:config="boardroomStakedConfig" />
			</TheLoader>
		</TheTab>
		<TheTab title="Unstaked" margin="-54">
			<div class="tabs__filter">
				<TheSelect
					:options="['Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
					:default="'Past 7 Days'"
					label="Date"
					@filter-select="onDateFilterChange" />
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="TX Status"
					@filter-select="onStatusFilterChange" />
			</div>
			<TheLoader component="table">
				<TransactionTable
					size="8"
					aria="Boardroom unstaked transactions"
					:data="filteredData"
					:config="boardroomUnstakedConfig" />
			</TheLoader>
		</TheTab>
		<TheTab title="Proposals" margin="-54">
			<div class="tabs__filter">
				<TheSelect
					:options="['Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
					:default="'Past 7 Days'"
					label="Date"
					@filter-select="onDateFilterChange" />
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="TX Status"
					@filter-select="onStatusFilterChange" />
			</div>
			<TheLoader component="table">
				<TransactionTable
					size="5"
					aria="Boardroom proposals transactions"
					:data="filteredData"
					:config="boardroomProposalsConfig" />
			</TheLoader>
		</TheTab>
		<TheTab title="Votes" margin="-54">
			<div class="tabs__filter">
				<TheSelect
					:options="['Past 7 Days', 'Past 30 Days', 'Past 90 Days']"
					:default="'Past 7 Days'"
					label="Date"
					@filter-select="onDateFilterChange" />
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="TX Status"
					@filter-select="onStatusFilterChange" />
			</div>
			<TheLoader component="table">
				<TransactionTable
					size="5"
					aria="Boardroom votes transactions"
					:data="filteredData"
					:config="boardroomVotesConfig" />
			</TheLoader>
		</TheTab>
	</TheTabs>
</template>

<script>
import dayjs from "dayjs";

export default {
	name: "TabBoardroom",
	data() {
		return {
			dateFilter: "",
			statusFilter: ""
		};
	},
	computed: {
		boardroomStakedConfig() {
			return this.$store.state.transactionStore.boardroomStakedConfig;
		},
		boardroomUnstakedConfig() {
			return this.$store.state.transactionStore.boardroomUnstakedConfig;
		},
		boardroomProposalsConfig() {
			return this.$store.state.transactionStore.boardroomProposalsConfig;
		},
		boardroomVotesConfig() {
			return this.$store.state.transactionStore.boardroomVotesConfig;
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
