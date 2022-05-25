<template>
	<TheTabs size="thin" color="dark" margin="0">
		<TheTab title="Staked" margin="-54">
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
				v-if="users"
				size="6"
				aria="Boardroom staked transactions"
				:data="users"
				:config="boardroomStakedConfig" />
		</TheTab>
		<TheTab title="Unstaked" margin="-54">
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
				v-if="users"
				size="8"
				aria="Boardroom unstaked transactions"
				:data="users"
				:config="boardroomUnstakedConfig" />
		</TheTab>
		<TheTab title="Proposals" margin="-54">
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
				v-if="users"
				size="5"
				aria="Boardroom proposals transactions"
				:data="users"
				:config="boardroomProposalsConfig" />
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
				v-if="users"
				size="5"
				aria="Boardroom votes transactions"
				:data="users"
				:config="boardroomVotesConfig" />
		</TheTab>
	</TheTabs>
</template>

<script>
export default {
	name: "TabBoardroom",
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
	},
	mounted() {
		this.$store.dispatch("transactionStore/loadUsers");
	},
};
</script>
