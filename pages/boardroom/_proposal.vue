<template>
	<div>
		<LayoutContainer>
			<PageTitle class="u-mb-48" data-v-step="1">
				<h4>Boardroom</h4>
				<LayoutFlex direction="row-center">
					<TheButton
						size="icon"
						class="u-mr-24 u-no-transition u-p-0"
						title="Click to go back"
						@click="getPreviousPage"><ChevronLeftIcon /></TheButton>
					<ComponentLoader :loaded="!!details.snapshot" component="h1">
						<h1>Proposal #{{ details.snapshot }}</h1>
					</ComponentLoader>
				</LayoutFlex>
			</PageTitle>
			<LayoutInfo size="1" data-v-step="2">
				<DataCard>
					<ComponentLoader :loaded="!!details.title" component="h2"><h2 class="u-mb-24">{{ details.title }}</h2></ComponentLoader>
					<LayoutFlex direction="row-center">
						<ComponentLoader :loaded="!!details.state" component="badge">
							<TheBadge :color="proposalStatesToColor[details.state]">{{ capitalize(details.state) }}</TheBadge>
						</ComponentLoader>
						<ShareNetwork
							network="twitter"
							:url="`https://app.nuon.fi/${socialUrl}`"
							:title="socialTitle || ''"
							hashtags="nuon,vote">
							<TwitterIcon />
						</ShareNetwork>
					</LayoutFlex>
				</DataCard>
			</LayoutInfo>
		</LayoutContainer>
		<LayoutGridSidePanel>
			<div class="proposal-details">
				<div class="proposal-description" data-v-step="3">
					<h4>Description<TooltipIcon v-tooltip="'Full details of the proposal.'" /></h4>
					<ComponentLoader
						:loaded="!!details.snapshot"
						width="u-full-width"
						slot-classes="l-flex--column">
						<div class="u-white-space-pre" v-html="compiledMarkdown"></div>
						<TheButton
							v-if="details.body && details.body.length > 400"
							:title="`Click to show ${isVisible ? 'less' : 'more'}`"
							size="link"
							@click="isVisible = !isVisible">
							Show {{ isVisible ? "less" : "more" }}
						</TheButton>
					</ComponentLoader>
				</div>
				<VotesTable
					:proposal-id="$route.params.proposal"
					:choices="details.choices || []"
					:number-of-votes="numberOfVotes || 0"
					:proposal-state="details.state"
					data-v-step="7" />
			</div>
			<ThePanel data-v-step="4">
				<h4>Information<TooltipIcon v-tooltip="'The author, start and end date of the proposal, along with the block number that the proposal was stored on the blockchain.'" /></h4>
				<ComponentLoader
					:loaded="!!details.author && !!details.start && !!details.end && !!details.snapshot"
					slot-classes="l-flex--column u-full-width">
					<div class="panel__row">
						<p>Author</p>
						<span>{{ shortAddress(details.author) }} <ClipboardIcon @click="copyText" /></span>
						<input id="text-to-copy" type="hidden" :value="details.author">
						<div class="tooltip" :class="{ visible: isCopySuccess }">Address Copied!</div>
					</div>
					<div class="panel__row">
						<p>Start Date</p>
						<span>{{ formatDate(new Date(details.start * 1000)) }}</span>
					</div>
					<div class="panel__row">
						<p>End date</p>
						<span>{{ formatDate(new Date(details.end * 1000)) }}</span>
					</div>
					<div class="panel__row">
						<p>Block number</p>
						<span><a :href="`https://etherscan.io/block/${details.snapshot}`" title="Click to view the latest block" target="_blank" rel="noopener noreferrer">{{ details.snapshot }} <ExternalLinkIcon /></a></span>
					</div>
				</ComponentLoader>
			</ThePanel>
			<ThePanel data-v-step="5">
				<h4>Current Results<TooltipIcon v-tooltip="'% of current votes for and against the proposal.'" /></h4>
				<ComponentLoader
					:loaded="!!voteScores && !!details.choices"
					slot-classes="l-flex--column u-full-width">
					<VotesChart
						:scores="voteScores"
						:choices="details.choices"
						:proposal-state="details.state" />
				</ComponentLoader>
			</ThePanel>
			<ThePanel class="u-mb-48" data-v-step="6">
				<h4>Cast Your Vote<TooltipIcon v-tooltip="'Choose yes or no and click ‘Vote’ to register your vote on the blockchain. You can change your vote before the end date if you wish.'" /></h4>
				<ComponentLoader
					:loaded="!!details.choices"
					width="u-full-width"
					slot-classes="l-flex--column">
					<label v-for="(choice, choiceIdx) in details.choices" :key="choiceIdx" class="radio-button" :disabled="details.state !== 'active'">
						<input v-model="vote" type="radio" name="radio" :value="choiceIdx" :disabled="details.state !== 'active'" />
						{{ choice }}
					</label>
					<p v-if="!votingPower && details.state === 'active'" class="u-is-warning">Please stake for voting power.</p>
					<TheButton
						v-if="details.state !== 'active'"
						disabled
						size="md"
						title="Voting has closed"
						class="l-flex--align-self-start">Voting Closed</TheButton>
					<TheButton
						v-else
						:disabled="!isConnectedWallet || vote === null"
						size="md"
						title="Click to vote"
						class="l-flex--align-self-start"
						@click="setModalVisibility('voteModal', true)">Vote</TheButton>
				</ComponentLoader>
				<TheModal
					v-show="isVoteModalVisible"
					title="Confirm Vote"
					subtitle="Are you sure you want to cast this vote? This action cannot be undone."
					:class="modalStatus"
					@close-modal="setModalVisibility('voteModal', false)">
					<TheStepper :active-step="activeStep" :stepper="false">
						<template #step-one>
							<div class="modal__confirm">
								<div class="modal__confirm--panel">
									<div class="modal__confirm--row">
										<p>Choice</p>
										<p>{{ details.choices && details.choices[vote] }}</p>
									</div>
									<div class="modal__confirm--row">
										<p>Block number</p>
										<p>{{ details.snapshot }}</p>
									</div>
									<div class="modal__confirm--row">
										<p>Your voting power</p>
										<p>{{ numberWithCommas(votingPower.toFixed(2)) }}%</p>
									</div>
								</div>
								<div class="modal__confirm--buttons">
									<TheButton
										size="lg"
										title="Click to cancel"
										@click="setModalVisibility('voteModal', false)">Cancel</TheButton>
									<TheButton
										size="lg"
										title="Click to submit vote"
										@click="submitVote">Submit Vote</TheButton>
								</div>
							</div>
						</template>
					</TheStepper>
				</TheModal>
			</ThePanel>
		</LayoutGridSidePanel>
		<v-tour name="proposalDetailsTour" :steps="steps" :callbacks="tourCallbacks"></v-tour>
	</div>
</template>

<script>
import axios from "axios";
import snapshot from "@snapshot-labs/snapshot.js";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import { Web3Provider } from "@ethersproject/providers";
import { fromWei } from "~/utils/bnTools";
import ChevronLeftIcon from "@/assets/images/svg/svg-chevron-left.svg";
import ClipboardIcon from "@/assets/images/svg/svg-clipboard.svg";
import ExternalLinkIcon from "@/assets/images/svg/svg-external-link.svg";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";
import TwitterIcon from "@/assets/images/svg/svg-twitter.svg";

export default {
	name: "TheProposal",
	components: {
		ChevronLeftIcon,
		ClipboardIcon,
		ExternalLinkIcon,
		TooltipIcon,
		TwitterIcon
	},
	data() {
		return {
			slug: this.$route.params,
			socialUrl: this.$nuxt.$route.fullPath,
			isVisible: false,
			vote: null,
			isCopySuccess: false,
			details: {},
			totalVotesForActive: null,
			proposalStatesToColor: {
				active: "green",
				closed: "grey",
				pending: "yellow",
			},
			activeStep: 1,
			steps: [
				{
					target: "[data-v-step=\"1\"]",
					header: {
						title: "Welcome to a Proposal",
					},
					content: "This is where you can view proposals to improve the ecosystem.",
				},
				{
					target: "[data-v-step=\"2\"]",
					content: "View the status of the proposal and share on Twitter.",
				},
				{
					target: "[data-v-step=\"3\"]",
					content: "Read the proposal in detail.",
				},
				{
					target: "[data-v-step=\"4\"]",
					content: "View information about the proposal.",
				},
				{
					target: "[data-v-step=\"5\"]",
					content: "View the most up-to-date vote results on the proposal.",
				},
				{
					target: "[data-v-step=\"6\"]",
					content: "Vote on the proposal.",
				},
				{
					target: "[data-v-step=\"7\"]",
					content: "View voting history for the proposal.",
				},
			],
			tourCallbacks: {
				onSkip: this.hideTourCallback,
				onStop: this.hideTourCallback,
				onFinish: this.hideTourCallback
			},
		};
	},
	head() {
		return {
			title: `${this.pageTitle} - Boardroom | NUON`
		};
	},
	computed: {
		voteScores() {
			if (this.details && this.details.state === "active") {
				if (!this.totalVotesForActive) return null;
				const allChoices = this.totalVotesForActive.map(v => v.choice);
				const uniqueAnswers = new Set(allChoices);
				const calculatedVotes = {};
				// gives {1: 8} for 8 yes and 0 no with key 1 denoting yes
				// gives {2: 3} for 0 yes and 3 no
				// gives {1: 8, 2: 3} for 8 yes and 3 no with key 1 denoting yes, 2 denoting no
				uniqueAnswers.forEach((ans) => {
					calculatedVotes[ans] = allChoices.filter(c => c === ans).length;
				});
				return this.details.choices.map((_, i) => calculatedVotes[i + 1]);
			} else {
				return this.details.scores;
			}
		},
		numberOfVotes() {
			if (this.details.state === "active") {
				return this.totalVotesForActive !== null ? this.totalVotesForActive.length : 0;
			} else {
				return this.details.votes;
			}
		},
		compiledMarkdown() {
			return DOMPurify.sanitize(marked(this.description));
		},
		description() {
			if (!this.details.body) return "";
			if (this.details.body.length < 400) {
				return this.details.body;
			}
			return this.isVisible ? this.details.body : this.details.body.substring(0,400) + "...";
		},
		socialTitle() {
			return this.details.title;
		},
		isVoteModalVisible() {
			return this.$store.state.modalStore.modalVisible.voteModal;
		},
		pageTitle() {
			const str = this.$route.params.proposal;
			const str2 = this.capitalize(str);
			const str3 = str2.replace(/-/g, " ");
			return str3 || "Proposal";
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
	created() {
		this.getProposalDetails();
	},
	mounted() {
		if (!$cookies.get("skip_tour")) this.$tours.proposalDetailsTour.start();
	},
	methods: {
		async submitVote() {
			this.activeStep = "loading";
			const provider = new Web3Provider(window.ethereum);
			const [account] = await provider.listAccounts();
			const client = new snapshot.Client712("https://hub.snapshot.org");

			try {
				await client.vote(provider, account, {
					space: "calon.eth",
					proposal: this.$route.params.proposal,
					type: "single-choice",
					choice: this.vote + 1,
					metadata: JSON.stringify({})
				});

				this.successToast(null, "Voted Successfully.");
			} catch (e) {
				this.failureToast(null, e);
			} finally {
				this.setModalVisibility("voteModal", false);
				this.activeStep = 1;
			}
		},
		copyText() {
			const textToCopy = document.querySelector("#text-to-copy");
			textToCopy.setAttribute("type", "text");
			textToCopy.select();
			try {
				document.execCommand("copy");
				this.isCopySuccess = true;
				setTimeout(() => {
					this.isCopySuccess = false;
				}, 3000);
			} catch (err) {
				this.failureToast(null, err, "Failed to copy.");
			}
			textToCopy.setAttribute("type", "hidden");
			window.getSelection().removeAllRanges();
		},
		async getProposalDetails() {
			try {
				const details = await axios.post("https://hub.snapshot.org/graphql", {
					query: `
						query GetProposal($itemId: String!) {
							proposals(
								where: {
									id: $itemId
								}
							) {
								id
								title
								body
								choices
								start
								end
								snapshot
								state
								author
								votes
								scores
								scores_total
								space {
									id
									name
								}
							}
						}`,
					variables: {
						itemId: this.$route.params.proposal,
					}
				});

				if (details.status === 200) {
					this.details = details.data.data.proposals[0];
					/* for currently active proposals, have to calculate vote distribution and count ourselves
					   for the time being as some features in their api aren't supported for active proposals  */
					if (this.details.state === "active") {
						this.getVotes();
					}
				}
			} catch (e) {
				const err = e.message ? e.message : e.response.data;
				this.failureToast(null, err, "Failed to load proposal details.");
			}
		},
		async getVotes() {
			let allVotes = null;
			let page = 0;
			let totalVotes = [];

			try {
				do {
					allVotes = await axios.post("https://hub.snapshot.org/graphql", {
						query: `
							query Votes($numberToSkip: Int!, $itemId: String!) {
								votes(
									first: 20000,
									skip: $numberToSkip,
									where: {
										proposal: $itemId
									}
								) {
									id
									voter
									choice
								}
							}`,
						variables: {
							numberToSkip: page * 20000,
							itemId: this.$route.params.proposal,
						}
					});

					if (allVotes.status === 200) {
						const voterData = allVotes.data.data.votes;
						totalVotes = [...totalVotes, ...voterData];
					}

					page += 1;
				} while (allVotes.data.data.votes.length === 20000);

				this.totalVotesForActive = totalVotes;
			} catch (e) {
				const err = e.message ? e.message : e.response.data;
				this.failureToast(null, err, "Failed to vote.");
			}
		}
	},
};
</script>
