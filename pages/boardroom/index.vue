<template>
	<div>
		<LayoutContainer>
			<LayoutFlex class="u-mb-48 u-mb-md-36 l-flex--column-sm l-flex--column-start-md" direction="row-center-space-between">
				<PageTitle class="u-mb-md-36" data-v-step="1">
					<h4>Boardroom</h4>
					<h1>Stake - Vote - Earn Rewards</h1>
				</PageTitle>
				<LayoutFlex class="u-full-width-sm">
					<TheButton
						:disabled="!isConnectedWallet"
						title="Click to stake"
						class="u-mr-30 u-mr-lg-24 u-mr-md-12 u-full-width-sm u-min-width-150"
						@click="setModalVisibility('stakeModal', true)">Stake</TheButton>
					<TheButton
						:disabled="disabledWithdraw"
						title="Click to withdraw"
						class="u-mr-30 u-mr-lg-24 u-mr-md-12 u-full-width-sm u-min-width-150"
						@click="setModalVisibility('withdrawModal', true)">Withdraw</TheButton>
					<TheButton
						:disabled="disabledClaimRewards"
						title="Click to claim rewards"
						class="u-full-width-sm u-min-width-150"
						@click="setModalVisibility('claimRewardsModal', true)">Claim Rewards</TheButton>
					<TheModal
						v-show="isStakeModalVisible"
						title="Stake nuMINT Token"
						subtitle="Stake your nuMINT to gain voting power."
						@close-modal="setModalVisibility('stakeModal', false)">
						<InputTransaction
							:maximum="hxBalance"
							title="Enter amount to stake"
							subtitle="Available nuMINT tokens"
							action-plural="staking"
							action="stake"
							@close-modal="setModalVisibility('stakeModal', false)" />
					</TheModal>
					<TheModal
						v-show="isWithdrawModalVisible"
						title="Withdraw nuMINT Token"
						:subtitle="`Days before unstake: ${epoch} Days`"
						@close-modal="setModalVisibility('withdrawModal', false)">
						<InputWithdraw
							action="withdraw"
							:maximum="myStake" />
					</TheModal>
					<TheModal
						v-show="isClaimRewardsModalVisible"
						class="modal--boardroom"
						title="Claim Reward Tokens"
						:subtitle="`Days before you can claim rewards: ${epoch} Days`"
						@close-modal="setModalVisibility('claimRewardsModal', false)"
						@claim="claimReward">
						<ClaimAccordionInput
							:token="claimRewardsToken"
							@selected-token="selectClaimToken" />
					</TheModal>
				</LayoutFlex>
			</LayoutFlex>
			<LayoutInfo size="boardroom" data-v-step="2">
				<DataCard class="u-mb-md-36 u-mb-sm-24">
					<label>My Stake</label>
					<TheLoader component="h1">
						<h3>{{ myStake | toFixed | numberWithCommas }}<sup>nuMINT</sup></h3>
					</TheLoader>
					<TheLoader component="h5">
						<h5>${{ getDollarValue(myStake, tokenPrices.HX) | toFixed | numberWithCommas }}</h5>
					</TheLoader>
				</DataCard>
				<DataCard class="u-mb-md-36 u-mb-sm-24">
					<label>My Rewards</label>
					<TheLoader component="h1">
						<h3>{{ myRewards | toFixed | numberWithCommas }}<sup>nuMINT</sup></h3>
					</TheLoader>
					<TheLoader component="h5">
						<h5>${{ getDollarValue(myRewards, tokenPrices.HX) | toFixed | numberWithCommas }}</h5>
					</TheLoader>
				</DataCard>
				<DataCard class="u-mb-sm-24">
					<label>My Next Reward Distribution</label>
					<TheLoader component="h1">
						<TheCountdown :visible="isConnectedWallet" :next-claim-date="nextEpochPoint" :is-loop="true" />
					</TheLoader>
				</DataCard>
				<DataCard>
					<label>My Voting Power<TooltipIcon v-tooltip="'1 nuMINT = 1 vote. The more nuMINT you stake compared to other voters, the higher your voting power will rise.'" /></label>
					<TheLoader component="h1">
						<h3>{{ votingPower | toFixed | numberWithCommas }}<sup>%</sup></h3>
					</TheLoader>
				</DataCard>
			</LayoutInfo>
		</LayoutContainer>
		<LayoutContainer class="u-pt-48">
			<h2 class="u-mb-20 u-mb-lg-14">nuMINT Stake Status</h2>
			<LayoutGrid class="u-mb-56 u-mb-lg-48" :size="'3-stretch'" data-v-step="3">
				<StatCard class="u-mb-md-12">
					<label>Total Staked<TooltipIcon v-tooltip="'Total nuMINT staked on the protocol.'" /></label>
					<TheLoader component="h3">
						<h3>{{ totalStaked | toFixed | numberWithCommas }}<sup>nuMINT</sup></h3>
					</TheLoader>
				</StatCard>
				<StatCard class="u-mb-md-12">
					<label>nuMINT Price<TooltipIcon v-tooltip="'USD Value of total staked nuMINT.'" /></label>
					<TheLoader component="h3">
						<h3>${{ tokenPrices.HX | toFixed | numberWithCommas }}</h3>
					</TheLoader>
				</StatCard>
				<StatCard>
					<label class="u-mb-sm-12">Reward Information<TooltipIcon v-tooltip="'The annual percentage rate and total value locked of all staked nuMINT.'" /></label>
					<LayoutFlex class="l-flex--column-sm" direction="row-space-between">
						<TheLoader component="h3">
							<h3 class="u-mr-32 u-mb-sm-12">APR {{ apr | toFixed | numberWithCommas }}%</h3>
						</TheLoader>
						<TheLoader component="h3">
							<h3 class="u-mr-32 u-mb-sm-12">TVL ${{ tvl | toFixed | numberWithCommas }}</h3>
						</TheLoader>
					</LayoutFlex>
				</StatCard>
			</LayoutGrid>
			<LayoutFlex class="u-mb-36 u-mb-md-24 l-flex--column-start-sm" direction="row-space-between">
				<PageTitle data-v-step="4">
					<h2>Proposals<TooltipIcon v-tooltip="'nuMINT stakers have the right to make and vote on proposals that affect the future direction of the protocol. All proposals can be accessed and managed here.'" /></h2>
					<h5>Create proposals and vote to improve the NUON protocol.</h5>
				</PageTitle>
				<DataCard align="end" class="u-full-width-sm">
					<NuxtLink :disabled="!isConnectedWallet" :event="!isConnectedWallet ? '' : 'click'" class="btn btn--md u-full-width-sm u-text-center-sm" to="/boardroom/create-new-proposal" title="Click to create a new proposal">Create New Proposal</NuxtLink>
				</DataCard>
			</LayoutFlex>
			<LayoutFlex class="u-mb-36 u-mb-md-24 l-flex--column-start-sm" direction="row-center-space-between">
				<LayoutFlex class="u-full-width-sm">
					<ul class="icon-list">
						<li v-if="totalProposals !== null">Total Proposals <TheBadge>{{ totalProposals }}</TheBadge></li>
						<li v-if="totalProposals === null"><ComponentLoader component="inline-list" /></li>
						<li v-if="totalVotes !== null">Total Votes <TheBadge>{{ totalVotes }}</TheBadge></li>
						<li v-if="totalVotes === null"><ComponentLoader component="inline-list" /></li>
						<li v-if="numberOfUniqueVoters !== null">Total Voters <TheBadge>{{ numberOfUniqueVoters }}</TheBadge></li>
						<li v-if="numberOfUniqueVoters === null"><ComponentLoader component="inline-list" /></li>
					</ul>
				</LayoutFlex>
				<TheSelect
					:options="['All', 'Active', 'Pending', 'Closed']"
					:default="'All'"
					label="Filter Proposals"
					@filter-select="onFilterChange" />
			</LayoutFlex>
			<InfiniteScroll :items="filteredProposals" class-name="proposal" @fetch="getProposalsFromSnapshot">
				<template #item="{ item }">
					<NuxtLink
						:to="{name: 'boardroom-proposal', params: { proposal: item.id }}"
						title="Click to view proposal">
						<div class="proposal__left">
							<h4># {{ item.snapshot }} {{ item.title }}</h4>
							<p>{{ shortAddress(item.id) }}</p>
						</div>
						<div class="proposal__right">
							<time :datetime="formatDate(new Date(item.end * 1000))">{{ formatDate(new Date(item.end * 1000)) }}</time>
							<TheBadge :color="proposalStatesToColor[item.state]">{{ capitalize(item.state) }}</TheBadge>
						</div>
					</NuxtLink>
				</template>
			</InfiniteScroll>
			<ComponentLoader :loaded="!isLoading" component="content-block" />
			<p v-if="!isLoading && filteredProposals !== null && filteredProposals.length === 0" class="u-text-center u-mt-xs">No proposals to show.</p>
			<v-tour name="boardroomTour" :steps="steps" :callbacks="tourCallbacks"></v-tour>
		</LayoutContainer>
	</div>
</template>

<script>
import axios from "axios";
import { fromWei } from "~/utils/bnTools";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";
import { HX } from "~/constants/tokens";

export default {
	name: "TheBoardroom",
	components: {
		TooltipIcon
	},
	data() {
		return {
			proposals: [],
			apr: 134,
			filterOption: "All",
			proposalStatesToColor: {
				active: "green",
				closed: "grey",
				pending: "yellow",
			},
			isLoading: true,
			totalProposals: null,
			totalVotes: null,
			numberOfUniqueVoters: null,
			reachedEnd: false,
			claimRewardsToken: {
				symbol: HX.symbol,
				price: 0,
				balance: 0
			},
			steps: [
				{
					target: "[data-v-step=\"1\"]",
					header: {
						title: "Welcome to the Boardroom",
					},
					content: "The boardroom is where the Nuon protocol's governance takes place using the nuMINT governance token.",
				},
				{
					target: "[data-v-step=\"2\"]",
					content: "The top information panel at the top tells you how much nuMINT you staked, your pending rewards, the epoch timing (defining voting and rewards cycles) as well as your corresponding voting power.",
				},
				{
					target: "[data-v-step=\"3\"]",
					content: "Next on the page is the global stats for nuMINT where you can see the price, TVL and staking APR.",
				},
				{
					target: "[data-v-step=\"4\"]",
					content: "Finally this is the proposal space where you can open a new proposal or vote on active ones. This is using our nuMINT staking contracts to determine your voting power and coupled with Snapshot.org to keep track of proposals.",
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
			title: "Boardroom | NUON"
		};
	},
	computed: {
		myStake() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.stakedBalance));
		},
		myRewards() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.earned));
		},
		totalStaked() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.totalSupply));
		},
		votingPower() {
			if (!this.totalStaked) return 0;
			return this.myStake / this.totalStaked * 100;
		},
		isStakeModalVisible() {
			return this.$store.state.modalStore.modalVisible.stakeModal;
		},
		isWithdrawModalVisible() {
			return this.$store.state.modalStore.modalVisible.withdrawModal;
		},
		isClaimRewardsModalVisible() {
			return this.$store.state.modalStore.modalVisible.claimRewardsModal;
		},
		filteredProposals() {
			if (this.filterOption === "All") return this.proposals;
			return this.proposals.filter(p => p.state === this.firstLetterLowercase(this.filterOption));
		},
		disabledWithdraw() {
			return !this.isConnectedWallet || !(this.myStake > 0);
		},
		disabledClaimRewards() {
			return !this.isConnectedWallet || !(this.myStake > 0);
		},
		nextEpochPoint() {
			return Number(this.$store.state.boardroomStore.nextEpochPoint);
		},
		tvl() {
			return this.totalStaked * this.tokenPrices.HX;
		},
		epoch() {
			return this.$store.state.boardroomStore.epoch;
		},
		hxBalance() {
			return this.$store.getters["erc20Store/hxBalance"] || 0;
		},
	},
	watch: {
		connectedAddress() {
			this.updateStatus();
		}
	},
	mounted() {
		this.updateStatus();
		this.claimRewardsToken = {symbol: HX.symbol, price: this.tokenPrices.HX, balance: this.myRewards};
		if (!$cookies.get("skip_tour")) this.$tours.boardroomTour.start();
	},
	created() {
		this.getData();
	},
	methods: {
		async getProposalsFromSnapshot(page) {
			if (this.reachedEnd) return;
			try {
				this.isLoading = true;
				const proposals = await axios.post("https://hub.snapshot.org/graphql", {
					query: `
						query Proposals($numberToSkip: Int!) {
							proposals(
								first: 10,
								skip: $numberToSkip,
								where: {
									space_in: ["calon.eth"]
								},
								orderBy: "created",
								orderDirection: desc
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
								created
								space {
									id
									name
								}
							}
						}`,
					variables: {
						numberToSkip: (page - 1) * 10,
					}
				});

				if (proposals.status === 200) {
					const proposalData = proposals.data.data.proposals;
					if (proposalData.length === 0) this.reachedEnd = true;
					this.proposals.push(...proposalData);
				}
			} catch (e) {
				const err = e.message ? e.message : e.response.data;
				this.failureToast(null, err, "Failed to get votes.");
			} finally {
				this.isLoading = false;
			}
		},
		async getTotalProposals() {
			let allProposals = null;
			let page = 0;
			let totalProposals = 0;

			try {
				do {
					allProposals = await axios.post("https://hub.snapshot.org/graphql", {
						query: `
							query Proposals($numberToSkip: Int!) {
								proposals(
									first: 20000,
									skip: $numberToSkip,
									where: {
										space_in: ["calon.eth"]
									}
								) {
									id
								}
							}`,
						variables: {
							numberToSkip: page * 20000
						}
					});

					if (allProposals.status === 200) {
						totalProposals += allProposals.data.data.proposals.length;
					}

					page += 1;
				} while (allProposals.data.data.proposals.length === 20000);

				this.totalProposals = totalProposals;
			} catch (e) {
				const err = e.message ? e.message : e.response.data;
				this.failureToast(null, err, "Failed to get proposals.");
			}
		},
		async getTotalVotes() {
			let allVotes = null;
			let page = 0;
			let totalVotes = 0;
			let uniqueVoters = new Set();

			try {
				do {
					allVotes = await axios.post("https://hub.snapshot.org/graphql", {
						query: `
							query Votes($numberToSkip: Int!) {
								votes(
									first: 20000,
									skip: $numberToSkip,
									where: {
										space_in: ["calon.eth"]
									}
								) {
									id
									voter
								}
							}`,
						variables: {
							numberToSkip: page * 20000,
						}
					});

					if (allVotes.status === 200) {
						const voterData = allVotes.data.data.votes;
						totalVotes += voterData.length;
						uniqueVoters = new Set([...uniqueVoters, ...voterData.map(d => d.voter)]);
					}

					page += 1;
				} while (allVotes.data.data.votes.length === 20000);

				this.totalVotes = totalVotes;
				this.numberOfUniqueVoters = uniqueVoters.size;
			} catch (e) {
				const err = e.message ? e.message : e.response.data;
				this.failureToast(null, err, "Failed to get votes.");
			}
		},
		getData() {
			this.getTotalVotes();
			this.getTotalProposals();
		},
		updateStatus() {
			return this.$store.dispatch("boardroomStore/updateStatus");
		},
		selectClaimToken(token) {
			this.claimRewardsToken = {...token, price: this.tokenPrices[token.symbol], balance: this.myRewards};
		},
		claimReward() {
			// TODO reward
			this.setModalVisibility("claimRewardsModal", false);
		}
	}
};
</script>
