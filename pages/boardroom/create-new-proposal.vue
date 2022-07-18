<template>
	<div>
		<LayoutContainer>
			<PageTitle class="u-mb-48 u-mb-sm-32">
				<h4>Boardroom</h4>
				<h1>
					<TheButton
						size="icon"
						class="u-mr-24 u-mr-lg-16 u-no-transition u-p-0"
						title="Click to go back"
						@click="getPreviousPage"><ChevronLeftIcon /></TheButton>Create Proposal</h1>
			</PageTitle>
			<LayoutInfo size="2">
				<DataCard>
					<label>Minimum Stake Required</label>
					<TheLoader component="h1">
						<h3>{{ numberWithCommas(minimumStake.toFixed(2)) }}<sup>nuMINT</sup></h3>
					</TheLoader>
				</DataCard>
				<DataCard>
					<label>Voting Power<TooltipIcon v-tooltip="'Enter voting power tooltip content here.'" /></label>
					<TheLoader component="h1">
						<h3>{{ numberWithCommas(votingPower.toFixed(2)) }}<sup>%</sup></h3>
					</TheLoader>
				</DataCard>
			</LayoutInfo>
		</LayoutContainer>
		<LayoutContainer class="u-pt-48 u-pt-lg-24 u-pt-sm-12">
			<form class="form" method="post" @submit.prevent="handleSubmit">
				<div class="form__block form__block--one">
					<label for="question">Proposal Title <sup>*</sup></label>
					<input
						id="question"
						v-model="proposal.title"
						placeholder="Type your question here"
						type="text"
						autocomplete="off"
						autocorrect="off"
						spellcheck="true"
						title="Click to enter proposal title"
						@input="handleInputChange" />
					<p v-if="errors.title" class="u-is-warning u-mb-0 u-mt-4">{{ errors.title }}</p>
				</div>
				<div class="form__block form__block--two">
					<label for="proposal">Proposal Description</label>
					<textarea
						id="proposal"
						v-model="proposal.description"
						placeholder="Type your proposal here (optional)"
						type="text"
						autocomplete="off"
						autocorrect="off"
						spellcheck="true"
						rows="8"
						title="Click to enter proposal description" />
				</div>
				<div class="form__block form__block--three">
					<h4>Voting Period <sup>*</sup></h4>
					<date-picker
						v-model="proposal.startDate"
						confirm
						type="datetime"
						value-type="date"
						placeholder="Select start date"
						title="Click to select start date"></date-picker>
					<p v-if="errors.date" class="u-is-warning">{{ errors.date }}</p>
					<p>Voting will be closed 7 days after your chosen start date.</p>
				</div>
				<div class="form__button">
					<TheButton
						type="submit"
						size="md"
						title="Click to publish proposal"
						:disabled="!isConnectedWallet">Publish</TheButton>
				</div>
			</form>
		</LayoutContainer>
		<TheModal
			v-show="isPublishModalVisible"
			title="Confirm Publish"
			subtitle="Are you sure you want to publish the new proposal? This action cannot be undone."
			class="modal--boardroom-proposal"
			:class="modalStatus"
			@close-modal="setModalVisibility('proposalPublishModal', false)">
			<TheStepper :active-step="activeStep" :stepper="false">
				<template #step-one>
					<div class="modal__confirm">
						<h5>Transaction Summary</h5>
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
								<p>Amount</p>
								<p>{{ votingPower }} nuMINT</p>
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
import { fromWei } from "~/utils/bnTools";

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
			minimumStake: 100,
			errors: {
				date: "",
				title: ""
			},
			activeStep: 1
		};
	},
	head() {
		return {
			title: "Create New Proposal - Boardroom | NUON"
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
