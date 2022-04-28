<template>
	<div class="votes-table">
		<LayoutFlex class="u-mb-16" direction="row-center-space-between">
			<h4>Votes</h4>
			<div>
				<ComponentLoader :loaded="!!votes" component="h4">
					<h4><SuccessIcon /> {{ numberOfVotes }}</h4>
				</ComponentLoader>
			</div>
		</LayoutFlex>
		<ComponentLoader :loaded="!!votes">
			<div class="votes-table__container" role="table" aria-label="Voters">
				<div class="votes-table__row" role="rowgroup">
					<div class="votes-table__cell" role="columnheader">
						<h5>Voter</h5>
					</div>
					<div class="votes-table__cell" role="columnheader">
						<h5>Vote Option</h5>
					</div>
					<div class="votes-table__cell" role="columnheader">
						<h5>Voting Power</h5>
					</div>
				</div>
				<div v-for="(voter, index) in votes" :key="index" class="votes-table__row" role="rowgroup">
					<div class="votes-table__cell" role="cell" :title="voter.voter">{{ shortAddress(voter.voter) }}</div>
					<div class="votes-table__cell" role="cell">{{ choices[voter.choice - 1] }}</div>
					<div class="votes-table__cell" role="cell">{{ votingPower(voter) }}</div>
				</div>
				<div class="votes-table__row" role="rowgroup">
					<div class="votes-table__cell votes-table__cell--full u-pb-0" role="cell">
						<ComponentLoader :loaded="!!votes" component="p" :slot-classes="'l-flex--row-justify-center'">
							<p v-if="numberOfVotes === 0">No votes submitted</p>
							<p v-else-if="reachedEnd">All votes loaded</p>
							<TheButton
								v-else
								size="link"
								title="Click to show all"
								@click="showMoreClicked">
								Show more
							</TheButton>
						</ComponentLoader>
					</div>
				</div>
			</div>
		</ComponentLoader>
	</div>
</template>

<script>
import axios from "axios";
import SuccessIcon from "@/assets/images/svg/svg-success.svg";

export default {
	name: "VotesTable",
	components: {
		SuccessIcon,
	},
	props: {
		proposalId: {
			type: String,
			required: true
		},
		choices: {
			type: Array,
			required: true
		},
		numberOfVotes: {
			type: Number,
			required: true,
		},
		proposalState: {
			type: String,
			required: true,
			default: ""
		}
	},
	data() {
		return {
			page: 0,
			reachedEnd: false,
			votes: null,
			requestFinished: false
		};
	},
	created() {
		this.getVotesDetails();
	},
	methods: {
		showMoreClicked() {
			if (!this.reachedEnd) this.getVotesDetails();
		},
		async getVotesDetails() {
			try {
				const voteDetails = await axios.post("https://hub.snapshot.org/graphql", {
					query: `
						query GetVotes($itemId: String!, $numberToSkip: Int!) {
							votes(
								first: 10
								skip: $numberToSkip
								where: {
									proposal: $itemId
								}
								orderBy: "created",
								orderDirection: desc
							) {
								id
								voter
								choice
								vp
							}
						}`,
					variables: {
						itemId: this.proposalId,
						numberToSkip: this.page * 10
					}
				});

				if (voteDetails.status === 200) {
					const data = voteDetails.data.data.votes;
					if (data.length === 0) {
						this.votes = [];
						this.reachedEnd = true;
						return;
					} else if (data.length < 10) {
						this.reachedEnd = true;
					};
					this.votes = [...(this.votes || []), ...data];
					this.page = this.page + 1;
				}
			} catch (e) {
				const err = e.message ? e.message : e.response.data;
				this.failureToast(null, err);
			} finally {
				this.requestFinished = true;
			}
		},
		votingPower(voter) {
			return this.proposalState === "active" ? "N/A" : `${this.abbreviateNumber(voter.vp.toFixed(3))} HX`;
		}
	}
};
</script>
