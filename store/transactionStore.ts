import type { ActionTree, MutationTree } from "vuex";
import Users from "~/services/users";

const defaultState = {
	users: [],
	mintedConfig: [
		{ id: "tokenType", title: "Token Type" },
		{ id: "amount", title: "Amount" },
		{ id: "minted", title: "Minted" },
		{ id: "fees", title: "Fees" },
		{ id: "finalAmount", title: "Final Amount" },
		{ id: "date", title: "Date" },
		{ id: "txStatus", title: "TX Status" }
	],
	redeemedConfig: [
		{ id: "tokenType", title: "Token Type" },
		{ id: "amount", title: "Amount" },
		{ id: "minted", title: "Redeemed" },
		{ id: "fees", title: "Fees" },
		{ id: "finalAmount", title: "Final Amount" },
		{ id: "date", title: "Date" },
		{ id: "txStatus", title: "TX Status" }
	],
	swapConfig: [
		{ id: "from", title: "From" },
		{ id: "to", title: "To" },
		{ id: "slippage", title: "Max Slippage" },
		{ id: "received", title: "Min. Received" },
		{ id: "price", title: "Price Impact" },
		{ id: "fees", title: "Fees" },
		{ id: "date", title: "Date" },
		{ id: "txStatus", title: "TX Status" }
	],
	stabilityZoneConfig: [
		{ id: "tokenType", title: "Token Type" },
		{ id: "amount", title: "Amount" },
		{ id: "fees", title: "Fees" },
		{ id: "finalAmount", title: "Final Amount" },
		{ id: "date", title: "Date" },
		{ id: "txStatus", title: "TX Status" }
	],
	stakedHxConfig: [
		{ id: "rewardTokens", title: "Reward Tokens" },
		{ id: "rewardAmount", title: "Reward Amount" },
		{ id: "fees", title: "Fees" },
		{ id: "totalClaimed", title: "Total Claimed" },
		{ id: "date", title: "Date" },
		{ id: "txStatus", title: "TX Status" }
	],
	burntHxConfig: [
		{ id: "rewardTokens", title: "Reward Tokens" },
		{ id: "rewardAmount", title: "Reward Amount" },
		{ id: "claimRatio", title: "Claim Ratio" },
		{ id: "fees", title: "Fees" },
		{ id: "totalClaimed", title: "Total Claimed" },
		{ id: "date", title: "Date" },
		{ id: "txStatus", title: "TX Status" }
	],
	boardroomStakedConfig: [
		{ id: "tokenType", title: "Token Type" },
		{ id: "amount", title: "Amount" },
		{ id: "fees", title: "Fees" },
		{ id: "finalAmount", title: "Final Amount" },
		{ id: "date", title: "Date" },
		{ id: "txStatus", title: "TX Status" }
	],
	boardroomUnstakedConfig: [
		{ id: "tokenType", title: "Token Type" },
		{ id: "amount", title: "Amount" },
		{ id: "rewardTokens", title: "Reward Tokens" },
		{ id: "rewardAmount", title: "Reward Amount" },
		{ id: "fees", title: "Fees" },
		{ id: "finalAmount", title: "Final Amount" },
		{ id: "date", title: "Date" },
		{ id: "txStatus", title: "TX Status" }
	],
	boardroomProposalsConfig: [
		{ id: "proposalName", title: "Proposal Name" },
		{ id: "startDate", title: "Start Date" },
		{ id: "amount", title: "Amount" },
		{ id: "status", title: "Status" },
		{ id: "txStatus", title: "TX Status" }
	],
	boardroomVotesConfig: [
		{ id: "proposalName", title: "Proposal Name" },
		{ id: "choice", title: "Choice" },
		{ id: "blockNumber", title: "Block Number" },
		{ id: "votingPower", title: "Voting Power" },
		{ id: "txStatus", title: "TX Status" }
	],
};

export const state = () => defaultState;

export type LocalState = ReturnType<typeof state>;

export const mutations: MutationTree<LocalState> = {
	setUsers(state, payload) {
		state.users = payload;
	}
};

export const actions: ActionTree<LocalState, LocalState> = {
	async loadUsers({ commit }) {
		const response = await Users().get("/users");
		commit("setUsers", response.data);
	}
};
