<template>
	<div>
		<LayoutContainer>
			<LayoutFlex class="u-mb-48 u-mb-md-36 l-flex-column-sm" direction="row-center-space-between">
				<PageTitle>
					<h4>Boardroom</h4>
					<h1>Stake - Vote - Earn Rewards</h1>
				</PageTitle>
				<LayoutFlex>
					<TheButton
						:disabled="!isConnectedWallet"
						title="Click to stake"
						class="u-mr-30 u-mr-lg-24 u-mr-md-12"
						@click="setModalVisibility('stakeModal', true)">Stake</TheButton>
					<TheButton
						:disabled="disabledWithdraw"
						title="Click to withdraw"
						class="u-mr-30 u-mr-lg-24 u-mr-md-12"
						@click="setModalVisibility('withdrawModal', true)">Withdraw</TheButton>
					<TheButton
						:disabled="disabledClaimRewards"
						title="Click to claim rewards"
						@click="setModalVisibility('claimRewardsModal', true)">Claim Rewards</TheButton>
					<TheModal
						v-show="isStakeModalVisible"
						title="Stake HX Token"
						subtitle="Stake your HX to gain voting power."
						@close-modal="setModalVisibility('stakeModal', false)">
						<InputTransaction
							:maximum="hxBalance"
							title="Enter amount to stake"
							subtitle="Available HX tokens"
							action-plural="staking"
							action="stake" />
					</TheModal>
					<TheModal
						v-show="isWithdrawModalVisible"
						title="Withdraw HX Token"
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
			<LayoutInfo size="4">
				<DataCard class="u-mb-md-36">
					<label>My Stake</label>
					<TheLoader component="h1">
						<h3>{{ numberWithCommas(myStake.toFixed(2)) }}<sup>HX</sup></h3>
					</TheLoader>
					<TheLoader component="h5">
						<h5>${{ numberWithCommas(getDollarValue(myStake, hxPrice).toFixed(2)) }}</h5>
					</TheLoader>
				</DataCard>
				<DataCard class="u-mb-md-36">
					<label>My Rewards</label>
					<TheLoader component="h1">
						<h3>{{ numberWithCommas(myRewards.toFixed(2)) }}<sup>HX</sup></h3>
					</TheLoader>
					<TheLoader component="h5">
						<h5>${{ numberWithCommas(getDollarValue(myRewards, hxPrice).toFixed(2)) }}</h5>
					</TheLoader>
				</DataCard>
				<DataCard>
					<label>My Next Reward Distribution</label>
					<TheLoader component="h1">
						<TheCountdown :visible="isConnectedWallet" :next-claim-date="nextEpochPoint" />
					</TheLoader>
				</DataCard>
				<DataCard>
					<label>My Voting Power<TooltipIcon v-tooltip="'Calculation: My Stake / Total Staked'" /></label>
					<TheLoader component="h1">
						<h3>{{ numberWithCommas(votingPower.toFixed(2)) }}<sup>%</sup></h3>
					</TheLoader>
				</DataCard>
			</LayoutInfo>
		</LayoutContainer>
		<LayoutContainer class="u-pt-48">
			<h2 class="u-mb-20 u-mb-lg-14">Hydro Stake Status</h2>
			<LayoutGrid class="u-mb-56 u-mb-lg-48" :size="'3-stretch'">
				<StatCard>
					<label>Total Staked<TooltipIcon v-tooltip="'Enter Total Staked tooltip content here'" /></label>
					<TheLoader component="h3">
						<h3>{{ numberWithCommas(totalStaked.toFixed(2)) }}</h3>
					</TheLoader>
				</StatCard>
				<StatCard>
					<label>HX Price<TooltipIcon v-tooltip="'Enter HX Price tooltip content here'" /></label>
					<TheLoader component="h3">
						<h3>{{ numberWithCommas(hxPrice.toFixed(2)) }}</h3>
					</TheLoader>
				</StatCard>
				<StatCard>
					<label>Reward Information<TooltipIcon v-tooltip="'Enter Reward Info tooltip content here'" /></label>
					<LayoutFlex>
						<TheLoader component="h3">
							<h3 class="u-mr-32">APR {{ numberWithCommas(apr.toFixed(2)) }}%</h3>
						</TheLoader>
						<TheLoader component="h3">
							<h3 class="u-mr-32">TVL ${{ numberWithCommas(tvl.toFixed(2)) }}</h3>
						</TheLoader>
						<TheLoader component="h3">
							<h3>Day {{ daysFromEpoch }}</h3>
						</TheLoader>
					</LayoutFlex>
				</StatCard>
			</LayoutGrid>
			<LayoutFlex class="u-mb-36" direction="row-space-between">
				<PageTitle>
					<h2>Proposals<TooltipIcon v-tooltip="'Enter proposals tooltip content here.'" /></h2>
					<h5>Create proposals and vote to improve the Nuon protocol.</h5>
				</PageTitle>
				<DataCard align="end">
					<NuxtLink :disabled="!isConnectedWallet" :event="!isConnectedWallet ? '' : 'click'" class="btn btn--ghost" to="/boardroom/create-new-proposal" title="Click to create a new proposal">Create New Proposal</NuxtLink>
				</DataCard>
			</LayoutFlex>
			<LayoutFlex class="u-mb-36" direction="row-center-space-between">
				<LayoutFlex>
					<ul class="icon-list">
						<li v-if="totalProposals !== null">Total Proposals <TheBadge>{{ totalProposals }}</TheBadge></li>
						<li v-if="totalProposals === null"><TheLoader component="list" /></li>
						<li v-if="totalVotes !== null">Total Votes <TheBadge>{{ totalVotes }}</TheBadge></li>
						<li v-if="totalVotes === null"><TheLoader component="list" /></li>
						<li v-if="numberOfUniqueVoters !== null">Total Voters <TheBadge>{{ numberOfUniqueVoters }}</TheBadge></li>
						<li v-if="numberOfUniqueVoters === null"><TheLoader component="list" /></li>
					</ul>
				</LayoutFlex>
				<TheSelect :options="['All', 'Active', 'Pending', 'Closed']" :default="'All'" @filter-select="onFilterChange" />
			</LayoutFlex>
			<InfiniteScroll :items="filteredProposals" class-name="proposal" @fetch="getProposalsFromSnapshot">
				<template #item="{ item }">
					<NuxtLink :to="{name: 'boardroom-proposal', params: { proposal: item.id }}">
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
			<TheLoader v-if="isLoading" component="proposals" />
			<p v-if="!isLoading && filteredProposals !== null && filteredProposals.length === 0" class="u-text-center u-mb-56">No proposals to show.</p>
		</LayoutContainer>
	</div>
</template>

<script>
import axios from "axios";
import { fromWei } from "~/utils/bnTools";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";
import { HX, USX } from "~/constants/tokens";
import { EPOCH_PERIOD } from "~/constants/addresses";

export default {
	name: "TheBoardroom",
	components: {
		TooltipIcon
	},
	data() {
		return {
			proposals: [],
			apr: 134,
			hxPrice: 0,
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
			}
		};
	},
	head() {
		return {
			title: "Boardroom | Nuon"
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
			return Number(this.$store.state.boardroomStore.nextEpochPoint) + 3600 * 24 * 50;
		},
		tvl() {
			return this.totalStaked * this.hxPrice;
		},
		epoch() {
			return this.$store.state.boardroomStore.epoch;
		},
		daysFromEpoch() {
			return Math.floor(EPOCH_PERIOD * this.epoch / 24);
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
	async mounted() {
		this.hxPrice = parseFloat(await this.$store.getters["stabilityFlashStore/getHydroPriceInDAI"]);
		this.updateStatus();
		this.claimRewardsToken = {symbol: HX.symbol, price: this.hxPrice, balance: this.myRewards};
	},
	created() {
		this.getData();
	},
	methods: {
		shortAddress(address) {
			return `${address.slice(0, 6)}...${address.slice(36, 42)}`;
		},
		onFilterChange(o) {
			this.filterOption = o;
		},
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
									space_in: ["caldron.eth"]
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
										space_in: ["caldron.eth"]
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
										space_in: ["caldron.eth"]
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
		async selectClaimToken(token) {
			if (token.symbol === HX.symbol) {
				const price = parseFloat(await this.$store.getters["stabilityFlashStore/getHydroPriceInDAI"]);
				this.claimRewardsToken = {...token, price, balance: this.myRewards};
			} else if (token.symbol === USX.symbol) {
				const price = parseFloat(await this.$store.getters["stabilityFlashStore/getUSXPriceInDAI"]);
				this.claimRewardsToken = {...token, price, balance: this.myRewards};
			} else {
				this.claimRewardsToken = {...token, price: 0, balance: 0};
			}
		},
		claimReward() {
			// TODO reward
			this.setModalVisibility("claimRewardsModal", false);
		}
	}
};
</script>
