import type { GetterTree, ActionTree, MutationTree } from "vuex";

const defaultState = {
	isActive: false
};

export const state = () => defaultState;

export type LocalState = ReturnType<typeof state>;

export const getters: GetterTree<LocalState, LocalState> = {
	isActive: state => {
		return state.isActive;
	}
};

export const mutations: MutationTree<LocalState> = {
	toggle(state) {
		state.isActive = !state.isActive;
		document.body.classList.toggle("is-active");
	}
};

export const actions: ActionTree<LocalState, LocalState> = {};
