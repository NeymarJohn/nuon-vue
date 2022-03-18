import { GetterTree, MutationTree } from "vuex";

export const state = () => ({
	isLoaded: false,
	toast: {
		show: false,
		message: "",
		kind: "",
		txHash: "",
		title: ""
	},
	infuraId: ""
});

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
	setIsLoaded (state, payload) {
		state.isLoaded = payload;
	},
	setToast(state, payload) {
		state.toast = payload;
	},
	setInfuraId(state, payload) {
		state.infuraId = payload;
	}
};

export const getters: GetterTree<RootState, RootState> = {
	getIsLoaded: state => state.isLoaded,
	getToast: state => state.toast,
	getInfuraId: state => state.infuraId
};
