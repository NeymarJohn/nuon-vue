<template>
	<div>
		<LayoutContainer color="grey">
			<LayoutFlex
				class="u-mb-md u-m-mb-xs l-m-flex--column"
				direction="row-center-space-between">
				<h2 class="u-m-mb-xs">Stability Zone</h2>
				<LayoutFlex>
					<NuxtLink
						class="btn btn--md u-mr-sm u-m-mr-xs"
						to="/swap?outputToken=USX"
						title="Click to buy USX">Buy USX</NuxtLink>
					<NuxtLink
						class="btn btn--md"
						to="/swap?outputToken=HX"
						title="Click to buy HX">Buy HX</NuxtLink>
				</LayoutFlex>
			</LayoutFlex>
			<LayoutFlex class="l-m-flex--column u-mb-md">
				<DataCard class="u-mr-lg u-m-mb-xs u-m-mr-none">
					<p>My USX Balance</p>
					<TheLoader component="h3">
						<h3>{{ numberWithCommas(usxBalance.toFixed(2)) }}<sup>USX</sup></h3>
					</TheLoader>
					<TheLoader component="p">
						<p>${{ numberWithCommas(getDollarValue(usxBalance, price.usx).toFixed(2)) }}</p>
					</TheLoader>
				</DataCard>
				<DataCard class="u-mr-lg u-m-mr-none">
					<p>My HX Balance</p>
					<TheLoader component="h3">
						<h3>{{ numberWithCommas(hxBalance.toFixed(2)) }}<sup>HX</sup></h3>
					</TheLoader>
					<TheLoader component="p">
						<p>${{ numberWithCommas(getDollarValue(hxBalance, price.hx).toFixed(2)) }}</p>
					</TheLoader>
				</DataCard>
				<DataCard v-if="price.usx < tolerance.low && connectedAccount !== ''">
					<p>Staked in vesting</p>
					<TheLoader component="h3">
						<h3>{{ numberWithCommas(stakedBalance.toFixed(2)) }}<sup>HX</sup></h3>
					</TheLoader>
					<TheLoader component="p">
						<p>${{ numberWithCommas(getDollarValue(stakedBalance, price.hx).toFixed(2)) }}</p>
					</TheLoader>
				</DataCard>
			</LayoutFlex>
		</LayoutContainer>
		<LayoutContainer>
			<h2 class="u-mb-xs u-m-mb-xs">Token State</h2>
			<LayoutGrid
				class="u-mb-md u-m-mb-xs l-m-grid--column-1"
				:size="price.usx < tolerance.low ? '3' : '4'">
				<StatCard>
					<LayoutFlex direction="row-center-space-between">
						<h3>USX Price</h3>
						<TheLoader v-if="price.usx > tolerance.high" component="badge">
							<TheBadge v-if="price.usx" color="green">Above</TheBadge>
						</TheLoader>
						<TheLoader v-else-if="price.usx < tolerance.low" component="badge">
							<TheBadge v-if="price.usx" color="red">Below</TheBadge>
						</TheLoader>
						<TheLoader v-else component="badge">
							<TheBadge v-if="price.usx" color="grey">In Range</TheBadge>
						</TheLoader>
					</LayoutFlex>
					<TheLoader component="h4">
						<h4 v-if="price.usx">{{ numberWithCommas(price.usx.toFixed(2)) }}</h4>
					</TheLoader>
				</StatCard>
				<StatCard>
					<h3>HX Price</h3>
					<TheLoader component="h4">
						<h4 v-if="price.hx">{{ numberWithCommas(price.hx.toFixed(2)) }}</h4>
					</TheLoader>
				</StatCard>
				<StatCard>
					<h3>Rebalance Fee</h3>
					<TheLoader component="h4">
						<h4 v-if="rebalanceFee">{{ rebalanceFee }}%</h4>
					</TheLoader>
				</StatCard>
				<StatCard v-if="price.usx > tolerance.high || price.usx <= tolerance.high && price.usx >= tolerance.low">
					<h3>Claim Ratio</h3>
					<TheLoader component="h4">
						<h4 v-if="connectedAccount !== ''">{{ claimRatio }}%</h4>
						<h4 v-else>-%</h4>
					</TheLoader>
				</StatCard>
			</LayoutGrid>
			<TheLoader component="burn">
				<LayoutFlex v-if="price.usx > tolerance.high" direction="column">
					<LayoutFlex direction="row-space-between" class="u-mb-lg u-m-mb-sm l-m-flex--column">
						<LayoutFlex direction="column" class="u-m-mb-xs">
							<h2 class="u-mb-xs">Peg Zone: Is Above Range</h2>
							<p>Burn your HX to get the Peg Zone back in range and earn treasury fees.</p>
						</LayoutFlex>
						<DataCard align="end">
							<p>Available HX Balance</p>
							<h3>{{ numberWithCommas(hxBalance.toFixed(2)) }}<sup>HX</sup></h3>
							<TheButton
								:disabled="connectedAccount === ''"
								title="Click to start burning"
								@click="setModalVisibility('burnModal', true)">Start Burning</TheButton>
							<TransactionModal
								v-show="isBurnModalVisible"
								title="Burn HX token"
								subtitle="Submit HX amount, burn and bring peg zone back in range."
								:class="modalStatus"
								@close-modal="setModalVisibility('burnModal', false)">
								<BurnInput token-burn="HX" token-receive="USX" :token-balance="numberWithCommas(hxBalance.toFixed(2))" />
							</TransactionModal>
						</DataCard>
					</LayoutFlex>
					<LayoutFlex direction="row-space-between" class="l-m-flex--column">
						<LayoutFlex direction="column" class="u-m-mb-xs">
							<h2 class="u-mb-xs">Rewards</h2>
							<p>Claim statement and description (make audience aware of the claim info)</p>
							<LayoutFlex v-if="connectedAccount !== ''">
								<DataCard>
									<p>Claim rewards in:</p>
									<TheCountdown :visible="isConnectedWallet" :next-claim-date="nextClaimDate" />
								</DataCard>
							</LayoutFlex>
						</LayoutFlex>
						<DataCard align="end">
							<h3>{{ numberWithCommas(claimBalance.toFixed(2)) }}<sup>HX</sup></h3>
							<h5 class="u-mb-xs">${{ numberWithCommas(getDollarValue(claimBalance, price.hx).toFixed(2)) }}</h5>
							<TheButton
								:disabled="!canClaim"
								title="Click to start claiming"
								@click="setModalVisibility('claimModal', true)">Start Claiming</TheButton>
						</DataCard>
						<TransactionModal
							v-show="isClaimModalVisible"
							title="Claim Reward Tokens"
							subtitle="Time to claim your rewards!"
							@close-modal="setModalVisibility('claimModal', false)"
							@claim="claim">
							<ClaimAccordion from="stabilityZone"/>
						</TransactionModal>
					</LayoutFlex>
				</LayoutFlex>
				<LayoutFlex v-else-if="price.usx < tolerance.low" direction="column">
					<LayoutFlex direction="row-space-between" class="u-mb-lg">
						<LayoutFlex direction="column">
							<h2 class="u-mb-xs">Peg Zone: Is Below Range</h2>
							<p>Burn your USX to get the Peg Zone back in range and earn treasury fees.</p>
						</LayoutFlex>
						<DataCard align="end">
							<p>Available USX Balance</p>
							<h3>{{ numberWithCommas(usxBalance.toFixed(2)) }}<sup>USX</sup></h3>
							<TheButton
								title="Click to start burning"
								@click="setModalVisibility('burnModal', true)">Start Burning</TheButton>
							<TransactionModal
								v-show="isBurnModalVisible"
								title="Burn USX token"
								subtitle="Submit USX amount, burn and bring peg zone back in range."
								@close-modal="setModalVisibility('burnModal', false)">
								<BurnInput
									token-burn="USX"
									token-receive="HX"
									:token-balance="numberWithCommas(usxBalance.toFixed(2))" />
							</TransactionModal>
						</DataCard>
					</LayoutFlex>
				</LayoutFlex>
				<LayoutFlex v-else>
					<LayoutFlex direction="column">
						<h2 v-if="price.usx">Peg Zone: Is In Range</h2>
						<p v-if="price.usx">There is nothing to do.</p>
					</LayoutFlex>
				</LayoutFlex>
			</TheLoader>
		</LayoutContainer>
		<DefaultModal
			v-show="isClaimResultModalVisible"
			title="Success"
			@close-modal="setModalVisibility('claimResultModal', false)">
			{{ claimResultModalInfo }}
		</DefaultModal>
	</div>
</template>

<script>
import { fromWei } from "~/utils/bnTools";

export default {
	name: "TheStabilityZone",
	data () {
		return {
			price: {
				usx: 0,
				hx: 0
			},
			stakedBalance: 0,
			claimRatio: 0,
			rebalanceFee: 0,
			tolerance: {
				high: 0,
				low: 0
			},
			trackId: 0
		};
	},
	head() {
		return {
			title: "Stability Zone | Nuon"
		};
	},
	computed: {
		claimResultModalInfo() {
			return this.$store.state.modalStore.modalInfo.claimResultModal;
		},
		isClaimResultModalVisible() {
			return this.$store.state.modalStore.modalVisible.claimResultModal;
		},
		isBurnModalVisible() {
			return this.$store.state.modalStore.modalVisible.burnModal;
		},
		isClaimModalVisible() {
			return this.$store.state.modalStore.modalVisible.claimModal;
		},
		readyToClaim() {
			return this.$store.getters["stabilityFlashStore/getReadyToClaim"];
		},
		user() {
			return this.$store.state.stabilityFlashStore.user;
		},
		claimBalance() {
			return parseFloat(fromWei(this.user?.outstanding));
		},
		nextClaimDate() {
			return parseInt(this.user?.nextClaim || 0);
		},
		hxBalance() {
			return this.$store.getters["erc20Store/hxBalance"] || 0;
		},
		usxBalance() {
			return this.$store.getters["erc20Store/usxBalance"] || 0;
		},
		userClaimRatio() {
			return this.$store.getters["stabilityFlashStore/userClaimRatio"];
		},
		canClaim() {
			if (!this.isConnectedWallet || !this.claimBalance || this.nextClaimDate * 1000 > new Date().getTime()) return false;
			if (this.pendingTransactions.claim) return false;
			return true;
		},
		pendingTransactions() {
			return this.$store.state.stabilityFlashStore.pendingTransactions;
		}
	},
	watch: {
		connectedAccount() {
			this.getUser();
		}
	},
	async mounted() {
		this.rebalanceFee = await this.$store.getters["stabilityFlashStore/getRebalanceFees"];
		this.price.usx = parseFloat(await this.$store.getters["stabilityFlashStore/getUSXPriceInDAI"]);
		this.price.hx = parseFloat(await this.$store.getters["stabilityFlashStore/getHydroPriceInDAI"]);
		this.claimRatio = await this.$store.getters["stabilityFlashStore/userClaimRatio"];
		this.tolerance.high = await this.$store.getters["stabilityFlashStore/getToleranceHigh"];
		this.stakedBalance = parseFloat(await this.$store.getters["stabilityFlashStore/getStakedBalance"]);
		this.tolerance.low = await this.$store.getters["stabilityFlashStore/getToleranceLow"];
		this.$store.commit("rootStore/setIsLoaded", true);
		this.startTrackingTransactions();
	},
	methods: {
		getUser() {
			this.$store.dispatch("stabilityFlashStore/getUser", { address: this.connectedAccount });
		},
		startTrackingTransactions() {
			this.$store.dispatch("stabilityFlashStore/startTrackingTransactions", "claim");
			this.$store.dispatch("stabilityFlashStore/startTrackingTransactions", "approve");
		},
		claim() {
			this.$store.dispatch("stabilityFlashStore/claimHydroProfits", {
				_claimInHYDRO: true,
				_paidIn: "0x000000000000000000000000000000000000dEaD",
				_HYDROToChosenRoute: ["0x000000000000000000000000000000000000dEaD", "0x000000000000000000000000000000000000dEaD"],
				_callback: () => {
					this.setModalVisibility("claimModal", false);
				}
			});
		}
	}
};
</script>
