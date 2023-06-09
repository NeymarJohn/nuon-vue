<template>
	<LayoutContainer v-if="connectedAccount">
		<LayoutHeader>
			<PageTitle>
				<h1>Govern</h1>
			</PageTitle>
			<PriceIndicator />
		</LayoutHeader>
		<TheTabs margin="24" size="govern" color="transparent">
			<TheTab title="Stake">
				<LayoutAction type="tabs">
					<template #left>
						<TheTabs margin="0" size="full" @tab-changed="handleTabChanged">
							<TheTab title="Stake">
								<InputStake :maximum="nuMintBalance" action="stake"  @change="handleStakeInput"/>
							</TheTab>
							<TheTab title="Withdraw">
								<InputStake :maximum="myStake" action="withdraw" @change="handleWithdrawInput"/>
							</TheTab>
						</TheTabs>
					</template>
					<template #right>
						<CurrencyCard
							class="u-mb-32"
							label="My Stake"
							:value="myStake"
							currency="nuMINT"
							:badge="myStateAfter"
							:badge-color="calcBadgeColor(myStake,myStateAfter) "
						/>
						<CurrencyCard
							label="My Voting Power"
							:value="votingPower"
							currency="%"
							:badge="votingPowerAfter"
							:badge-color="calcBadgeColor(votingPower,votingPowerAfter) "
						/>
						<CurrencyCard
							label="nuMINT Price"
							:value="tokenPrices.nuMINT"
							symbol="$"
							:badge="currentValue?tokenPrices.nuMINT:0"
							:badge-currency="'USD'"
							:badge-color="calcBadgeColor(tokenPrices.nuMINT,tokenPrices.nuMINT) "/>
						<CurrencyCard
							label="Total Staked"
							:value="totalStaked"
							currency="nuMINT"
							:badge="totalStakedAfter"
							:badge-color="calcBadgeColor(totalStaked,totalStakedAfter) "/>
					</template>
				</LayoutAction>
			</TheTab>
			<TheTab title="Claim">
				<LayoutAction>
					<template #left>
						<InputStake :maximum="myRewards" action="claim" />
					</template>
					<template #right>
						<CurrencyCard class="u-mb-32" label="My Rewards" :value="myRewards" :change="getDollarValue(myRewards, tokenPrices.nuMINT)" currency="BUSD" />
						<TheCountdown label="Next Reward Distribution" :visible="isConnectedWallet" :next-claim-date="nextEpochPoint" :is-loop="true" />
						<CurrencyCard label="APR" :percent="apr" />
						<CurrencyCard label="TVL" :value="tvl" symbol="$" />
					</template>
				</LayoutAction>
			</TheTab>
			<TheTab title="Vote">
				<LayoutFlex direction="row-center-space-between u-mb-24">
					<ul class="icon-list">
						<li>
							Proposals
							<ComponentLoader :loaded="totalProposals !== null" component="inline-list">
								<TheBadge>{{ totalProposals }}</TheBadge>
							</ComponentLoader>
						</li>
						<li>
							Votes
							<ComponentLoader :loaded="totalVotes !== null" component="inline-list">
								<TheBadge>{{ totalVotes }}</TheBadge>
							</ComponentLoader>
						</li>
						<li>
							Voters
							<ComponentLoader :loaded="numberOfUniqueVoters !== null" component="inline-list">
								<TheBadge>{{ numberOfUniqueVoters }}</TheBadge>
							</ComponentLoader>
						</li>
					</ul>
					<TheSelect
						:options="['All', 'Active', 'Pending', 'Closed']"
						:default="'All'"
						label="Filter Proposals"
						inline
						@filter-select="onFilterChange" />
				</LayoutFlex>
				<InfiniteScroll :items="filteredProposals" class-name="proposal" @fetch="getProposalsFromSnapshot">
					<template #item="{ item }">
						<NuxtLink
							:to="{ name: 'govern-proposal', params: { proposal: item.id } }"
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
			</TheTab>
			<TheTab title="Add Proposal">
				<LayoutAction type="form">
					<template #left>
						<ProposalForm />
					</template>
					<template #right>
						<CurrencyCard label="Minimum Stake Required" :value="minimumStake" currency="nuMINT" />
						<CurrencyCard label="Voting Power" :value="votingPower" currency="%" />
					</template>
				</LayoutAction>
			</TheTab>
		</TheTabs>
	</LayoutContainer>
	<Welcome v-else />
</template>

<script>
import axios from "axios";
import { fromWei } from "~/utils/bnTools";
import { nuMINT } from "~/constants/tokens";

export default {
	name: "TheGovern",
	data() {
		return {
			currentValue: 0,
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
				symbol: nuMINT.symbol,
				price: 0,
				balance: 0
			},
			currentSection: 0,
			minimumStake: 100,
			// To be implemented after govern is finished.
			// tourCallbacks: {
			// 	onSkip: () => this.setCookie("skip_boardroom_tour"),
			// 	onStop: () => this.setCookie("skip_boardroom_tour"),
			// 	onFinish: () => this.setCookie("skip_boardroom_tour")
			// },
		};
	},
	head() {
		return {
			title: "Govern | NUON",
			meta: [
				{ hid: "govern", name: "description", content: "Participate in governance of the Nuon Protocol, home of the inflation-shielded Nuon flatcoin, by staking nuMINT and voting on proposals." },
				{ hid: "og-type", property: "og:type", content: "website" },
				{ hid: "og-title", property: "og:title", content: "Govern | NUON" },
				{ hid: "og-desc", property: "og:description", content: "Participate in governance of the Nuon Protocol, home of the inflation-shielded Nuon flatcoin, by staking nuMINT and voting on proposals." },
				{ hid: "og-image", property: "og:image", content: "https://nuon.fi/assets/img/opengraph-default.jpg" },
				{ hid: "og-url", property: "og:url", content: "https://app.nuon.fi/govern" },
				{ hid: "twitter", property: "twitter:card", content: "summary_large_image" },
			]
		};
	},
	computed: {
		myStake() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.stakedBalance));
		},
		myStateAfter() {
			if (!this.currentValue) return 0;
			return parseFloat(fromWei(this.$store.state.boardroomStore.stakedBalance)) + Number(this.currentValue);
		},
		myRewards() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.earned));
		},
		totalStaked() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.totalSupply));
		},
		totalStakedAfter() {
			if (!this.currentValue) return 0;
			return parseFloat(fromWei(this.$store.state.boardroomStore.totalSupply)) + Number(this.currentValue);
		},
		votingPower() {
			if (!this.totalStaked) return 0;
			return this.myStake / this.totalStaked * 100;
		},
		votingPowerAfter() {
			if (!this.currentValue) return 0;
			if (!this.totalStakedAfter) return 0;
			return this.myStateAfter / this.totalStakedAfter * 100;
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
			return this.totalStaked * this.tokenPrices.nuMINT;
		},
		epoch() {
			return this.$store.state.boardroomStore.epoch;
		},
		nuMintBalance() {
			return this.$store.getters["erc20Store/nuMintBalance"] || 0;
		},
	},
	watch: {
		connectedAddress() {
			this.updateStatus();
		}
	},
	mounted() {
		this.updateStatus();
		this.claimRewardsToken = {symbol: nuMINT.symbol, price: this.tokenPrices.nuMINT, balance: this.myRewards};
		// if (!$cookies.get("skip_boardroom_tour")) this.$tours.boardroomTour.start();
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
									space_in: ["testnuon.eth"]
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
					if (page === 0) {
						this.proposals = proposalData;
					} else {
						this.proposals.push(...proposalData);
					}
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
										space_in: ["testnuon.eth"]
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
										space_in: ["testnuon.eth"]
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
		handleStakeInput(e) {
			this.currentValue = e.value;
		},
		handleWithdrawInput(e) {
			this.currentValue = - e.value;
		},
		handleTabChanged() {
			this.currentValue = 0;
		},
		calcBadgeColor(current, estimation) {
			if (current !== estimation) return "green";
			return "grey";
		}
	}
};
</script>
