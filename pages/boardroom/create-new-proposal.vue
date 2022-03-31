<template>
	<div>
		<LayoutContainer color="grey" class="u-pb-xl">
			<LayoutFlex class="u-mb-md u-m-mb-xs l-m-flex--column">
				<TheButton
					size="icon"
					class="u-mr-xxs u-no-transition u-p-0"
					title="Click to go back"
					@click="getPreviousPage"><ChevronLeftIcon /></TheButton>
				<h2 class="u-m-mb-xs">Create New Proposal</h2>
			</LayoutFlex>
			<LayoutFlex
				class="l-m-flex--column"
				direction="row-start-space-between">
				<DataCard class="u-m-mb-xs u-m-mr-none">
					<p>Minimum Stake Required</p>
					<h3>{{ numberWithCommas(minimumStake.toFixed(2)) }}<sup>HX</sup></h3>
					<p>For proposal submission</p>
				</DataCard>
				<DataCard>
					<p class="u-flex-row-center">Voting Power <TooltipIcon v-tooltip="'Enter voting power tooltip content here.'" /></p>
					<h3>{{ numberWithCommas(votingPower.toFixed(2)) }}<sup>%</sup></h3>
				</DataCard>
			</LayoutFlex>
		</LayoutContainer>
		<form class="form form--proposal" method="post" @submit.prevent="handleSubmit">
			<div class="form__block">
				<label for="question">Proposal Title <sup>*</sup></label>
				<input id="question" v-model="proposal.title" placeholder="Type your question here" type="text" autocomplete="off" autocorrect="off" spellcheck="true" title="Click to enter proposal title" @input="handleInputChange" />
				<p v-if="errors.title" class="u-is-warning u-mt-xxs u-mb-0">{{ errors.title }}</p>
			</div>
			<div class="form__block">
				<label for="proposal">Proposal Description</label>
				<textarea id="proposal" v-model="proposal.description" placeholder="Type your proposal here (optional)" type="text" autocomplete="off" autocorrect="off" spellcheck="true" rows="8" title="Click to enter proposal description" />
			</div>
			<div class="form__block">
				<h4>Voting Start Date <sup>*</sup></h4>
				<date-picker v-model="proposal.startDate" confirm type="datetime" value-type="date" placeholder="Select voting start date" class="datepicker" title="Click to select voting start date"></date-picker>
				<p v-if="errors.date" class="u-is-warning">{{ errors.date }}</p>
				<p class="u-mb-0">Voting will be closed 7 days after your chosen start date.</p>
			</div>
			<TheButton
				type="submit"
				size="lg"
				title="Click to publish proposal"
				:disabled="!isConnectedWallet">Publish</TheButton>
		</form>
		<TheModal
			v-show="isPublishModalVisible"
			title="Confirm Publish"
			subtitle="Are you sure you want to publish the new proposal? This action cannot be undone."
			:class="modalStatus"
			@close-modal="setModalVisibility('proposalPublishModal', false)">
			<TheStepper :active-step="activeStep" :stepper="false">
				<template #step-one>
					<div class="modal__confirm">
						<div class="modal__confirm--panel">
							<div class="modal__confirm--row">
								<p>Author</p>
								<p>{{ shortAddress(connectedAccount) }}</p>
							</div>
							<div class="modal__confirm--row">
								<p>Start Date</p>
								<p>{{ proposal.startDate && formatDate(proposal.startDate) }}</p>
							</div>
							<div class="modal__confirm--row">
								<p>Voting power for publishing</p>
								<p>{{ votingPower }} HX</p>
							</div>
						</div>
						<div class="modal__confirm--buttons">
							<TheButton
								size="lg"
								title="Click to cancel"
								@click="setModalVisibility('proposalPublishModal', false)">Cancel</TheButton>
							<TheButton
								size="lg"
								title="Click to submit vote"
								@click="publishProposal">Publish</TheButton>
						</div>
					</div>
				</template>
			</TheStepper>
		</TheModal>
	</div>
</template>

<script>
import snapshot from "@snapshot-labs/snapshot.js";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import Web3 from "web3";
import { Web3Provider } from "@ethersproject/providers";
import ChevronLeftIcon from "@/assets/images/svg/svg-chevron-left.svg";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "CreateNewProposal",
	components: {
		DatePicker,
		ChevronLeftIcon,
		TooltipIcon
	},
	data() {
		return {
			proposal: {
				title: "",
				description: "",
				startDate: null,
			},
			minimumStake: 10,
			votingPower: 23.4,
			errors: {
				date: "",
				title: ""
			},
			activeStep: 1
		};
	},
	head() {
		return {
			title: "Create New Proposal - Boardroom | Nuon"
		};
	},
	computed: {
		isPublishModalVisible() {
			return this.$store.state.modalStore.modalVisible.proposalPublishModal;
		},
		titleLength() {
			return this.proposal.title.length;
		}
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
					space: "caldron.eth",
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
