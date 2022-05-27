import type { ActionTree, MutationTree } from "vuex";
import Users from "~/services/users";

const defaultState = {
	users: [],
	transactionConfig: [
		{ id: "txType", title: "TX Type" },
		{ id: "amount", title: "Amount" },
		{ id: "totalAmount", title: "Total Amount" },
		{ id: "date", title: "Date" },
	],
	dateFilter: ""
};

export const state = () => defaultState;

export type LocalState = ReturnType<typeof state>;

export const mutations: MutationTree<LocalState> = {
	setUsers(state, payload) {
		state.users = payload;
	},
	setDateFilter(state, payload) {
		state.dateFilter = payload;
	}
};

export const actions: ActionTree<LocalState, LocalState> = {
	async loadUsers({ commit }) {
		const response = await Users().get("/users");
		commit("setUsers", response.data);
	}
};
