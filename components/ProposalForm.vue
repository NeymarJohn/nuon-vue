<template>
	<form class="form" method="post" @submit.prevent="handleSubmit">
		<div class="form__block">
			<label for="question">Proposal Title <sup>*</sup></label>
			<input
				id="question"
				v-model="proposal.title"
				placeholder="Type your proposal title here"
				type="text"
				autocomplete="off"
				autocorrect="off"
				spellcheck="true"
				title="Click to enter proposal title"
				@input="handleInputChange" />
			<p v-if="errors.title" class="u-is-warning u-mb-0 u-mt-8">{{ errors.title }}</p>
		</div>
		<div class="form__block">
			<label for="proposal">Proposal Description</label>
			<textarea
				id="proposal"
				v-model="proposal.description"
				placeholder="Type your proposal here (optional)"
				type="text"
				autocomplete="off"
				autocorrect="off"
				spellcheck="true"
				rows="5"
				title="Click to enter proposal description" />
		</div>
		<div class="form__block">
			<label for="voting-period">Voting Period <sup>*</sup></label>
			<date-picker
				id="voting-period"
				v-model="proposal.startDate"
				confirm
				type="datetime"
				value-type="date"
				placeholder="Select start date"
				title="Click to select start date"></date-picker>
			<p v-if="errors.date" class="u-is-warning">{{ errors.date }}</p>
			<p class="u-mb-0">Voting will be closed 7 days after your chosen start date.</p>
		</div>
		<LayoutFlex direction="row-justify-end">
			<TheButton
				type="submit"
				class="u-min-width-200"
				size="md"
				title="Click to publish proposal"
				:disabled="!isConnectedWallet || !proposal.title || !proposal.startDate">Publish</TheButton>
		</LayoutFlex>
	</form>
</template>

<script>
import Web3 from "web3";
import { Web3Provider } from "@ethersproject/providers";
import snapshot from "@snapshot-labs/snapshot.js";
import DatePicker from "vue2-datepicker";
import { fromWei } from "~/utils/bnTools";
import "vue2-datepicker/index.css";

export default {
	name: "ProposalForm",
	components: {
		DatePicker,
	},
	data() {
		return {
			proposal: {
				title: "",
				description: "",
				startDate: null,
			},
			errors: {
				date: "",
				title: ""
			},
		};
	},
	computed: {
		isPublishModalVisible() {
			return this.$store.state.modalStore.modalVisible.proposalPublishModal;
		},
		titleLength() {
			return this.proposal.title.length;
		},
		myStake() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.stakedBalance));
		},
		totalStaked() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.totalSupply));
		},
		votingPower() {
			if (!this.totalStaked) return 0;
			return this.myStake / this.totalStaked * 100;
		},
	},
	methods: {
		handleInputChange() {
			this.$set(this.errors, "title", "");
			if (this.titleLength === 0) {
				this.$set(this.errors, "title", "Title is required.");
				return;
			}
			if (this.titleLength > 250) {
				this.$set(this.errors, "title", `Title is longer than 250 characters. Please use 250 characters or less. Current: ${this.titleLength}`);
			}
		},
		handleSubmit() {
			if (!this.validInputs()) return;
			this.setModalVisibility("proposalPublishModal", true);
		},
		async publishProposal() {
			this.activeStep = "loading";
			const web3 = new Web3(new Web3.providers.HttpProvider("https://eth-rinkeby.alchemyapi.io/v2/tNNOqUaCiby8YE9se1dFThx5rjgh13V_"));
			const provider = new Web3Provider(window.ethereum);
			const [account] = await provider.listAccounts();
			const client = new snapshot.Client712("https://hub.snapshot.org");
			const latestBlockNumber = await web3.eth.getBlockNumber();

			try {
				await client.proposal(provider, account, {
					space: "calon.eth",
					type: "single-choice",
					title: this.proposal.title,
					body: this.proposal.description,
					choices: ["Yes", "No"],
					start: Math.floor((this.proposal.startDate.getTime()) / 1000),
					end: Math.floor((this.proposal.startDate.getTime() + (3600000 * 24 * 7)) / 1000),
					snapshot: latestBlockNumber,
					network: "4",
					strategies: JSON.stringify({}),
					plugins: JSON.stringify({}),
					metadata: JSON.stringify({})
				});

				this.successToast(null, "Your Proposal has been created");
				this.$router.push({path: "/boardroom"});
			} catch (e) {
				this.failureToast(null, e);
			} finally {
				this.setModalVisibility("proposalPublishModal", false);
				this.activeStep = 1;
			}
		},
		validInputs() {
			this.resetErrors();
			let hasError = false;
			this.handleInputChange();

			if (!this.titleLength) {
				hasError = true;
			}
			if (this.titleLength > 250) {
				hasError = true;
			}
			if (!this.proposal.startDate) {
				this.$set(this.errors, "date", "Please select a starting date");
				hasError = true;
			}
			// if start date of proposal is in the past.
			if (this.proposal.startDate < new Date()) {
				this.$set(this.errors, "date", "Please make sure the starting date is in the future.");
				hasError = true;
			}

			return !hasError;
		},
		resetErrors() {
			this.errors = {date: "", title: ""};
		}
	}
};
</script>
