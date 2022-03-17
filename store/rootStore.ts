import { GetterTree, MutationTree } from "vuex";

export const state = () => ({
	isLoaded: false,
	toast: {
		show: false,
		message: "",
		kind: "",
		txHash: "",
		title: ""
	}
});

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
	setIsLoaded (state, payload) {
		state.isLoaded = payload;
	},
	setToast(state, payload) {
		state.toast = payload;
	}
};

export const getters: GetterTree<RootState, RootState> = {
	getIsLoaded: state => state.isLoaded,
	getToast: state => state.toast
};
