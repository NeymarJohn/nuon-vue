import Vue from "vue";
import { GetterTree, MutationTree } from "vuex";

export const state = () => ({
	modalStatus: "is-active",
	modalError: "",
	modalVisible: {
		burnModal: false,
		collateralModal: false,
		depositCollateralModal: false,
		settingsModal: false,
		stakeModal: false,
		claimModal: false,
		claimRewardsModal: false,
		voteModal: false,
		proposalPublishModal: false,
		withdrawModal: false,
		withdrawCollateralModal: false,
		claimResultModal: false,
		alertModal: false,
		connectWalletModal: false,
		hubOverviewModal: false,
		mintModal: false,
		redeemModal: false,
		adjustPositionModal: false
	},
	modalInfo: {
		claimResultModal: "",
		alertModal: {
			title: "",
			message: "",
			htmlContent: "",
			cta: ""
		}
	}
});

export type ModalState = ReturnType<typeof state>

export const mutations: MutationTree<ModalState> = {
	setModalStatus (state, payload) {
		state.modalStatus = payload;
	},
	setModalError (state, payload) {
		state.modalError = payload;
	},
	setModalVisibility (state, payload) {
		Vue.set(state.modalVisible, payload.name, payload.visibility);
	},
	setModalInfo (state, payload) {
		Vue.set(state.modalInfo, payload.name, payload.info);
	}
};

export const getters: GetterTree<ModalState, ModalState> = {
	getModalStatus: state => state.modalStatus,
	getModalError: state => state.modalError,
};
