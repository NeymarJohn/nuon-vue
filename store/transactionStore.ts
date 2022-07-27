import type { ActionTree, MutationTree } from "vuex";

const defaultState = {
	transactionConfig: [
		{ id: "transactionType", title: "Transaction Type" },
		{ id: "amount", title: "Amount" },
		{ id: "totalAmount", title: "Total Amount" },
		{ id: "date", title: "Date" },
	],
	dateFilter: "",
	search: ""
};

export const state = () => defaultState;

export type LocalState = ReturnType<typeof state>;

export const mutations: MutationTree<LocalState> = {
	setDateFilter(state, payload) {
		state.dateFilter = payload;
	},
	setSearch(state, payload) {
		state.search = payload.target.value;
	}
};

export const actions: ActionTree<LocalState, LocalState> = {};
