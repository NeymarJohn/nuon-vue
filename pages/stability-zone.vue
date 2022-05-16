<template>
	<div>
		<LayoutContainer>
			<LayoutFlex class="u-mb-48 l-flex-column-start-sm" direction="row-center-space-between">
				<PageTitle>
					<h4>Stability Zone</h4>
					<h1>My Token</h1>
				</PageTitle>
				<LayoutFlex>
					<NuxtLink
						class="btn btn--md u-mr-30"
						to="/swap?outputToken=USX"
						title="Click to buy USX">Buy USX</NuxtLink>
					<NuxtLink
						class="btn btn--md"
						to="/swap?outputToken=HX"
						title="Click to buy HX">Buy HX</NuxtLink>
				</LayoutFlex>
			</LayoutFlex>
			<LayoutInfo size="3">
				<DataCard>
					<label>My USX Balance</label>
					<TheLoader component="h1">
						<h3>{{ numberWithCommas(usxBalance.toFixed(2)) }}<sup>USX</sup></h3>
					</TheLoader>
					<TheLoader component="h5">
						<h5>${{ numberWithCommas(getDollarValue(usxBalance, tokenPrices.USX).toFixed(2)) }}</h5>
					</TheLoader>
				</DataCard>
				<DataCard>
					<label>My HX Balance</label>
					<TheLoader component="h1">
						<h3>{{ numberWithCommas(hxBalance.toFixed(2)) }}<sup>HX</sup></h3>
					</TheLoader>
					<TheLoader component="h5">
						<h5>${{ numberWithCommas(getDollarValue(hxBalance, tokenPrices.HX).toFixed(2)) }}</h5>
					</TheLoader>
				</DataCard>
				<DataCard v-if="tokenPrices.USX < tolerance.low && connectedAccount !== ''">
					<label>Staked in vesting</label>
					<TheLoader component="h1">
						<h3>{{ numberWithCommas(stakedBalance.toFixed(2)) }}<sup>HX</sup></h3>
					</TheLoader>
					<TheLoader component="h5">
						<h5>${{ numberWithCommas(getDollarValue(stakedBalance, tokenPrices.HX).toFixed(2)) }}</h5>
					</TheLoader>
				</DataCard>
			</LayoutInfo>
		</LayoutContainer>
		<LayoutContainer class="u-pt-48">
			<h2 class="u-mb-20">Token State</h2>
			<LayoutGrid class="u-mb-56 u-mb-sm-48 u-display-grid-md u-display-flex-sm" size="3">
				<StatCard class="u-mb-sm-12">
					<label>USX Price<TooltipIcon v-tooltip="'Enter usx price tooltip content here.'" /></label>
					<TheLoader component="h3">
						<LayoutFlex direction="row-center-space-between">
							<h3 v-if="tokenPrices.USX">{{ tokenPrices.USX | toFixed | numberWithCommas }}</h3>
							<TheBadge v-if="tokenPrices.USX > tolerance.high">Above</TheBadge>
							<TheBadge v-else-if="tokenPrices.USX < tolerance.low">Below</TheBadge>
						</LayoutFlex>
					</TheLoader>
				</StatCard>
				<StatCard class="u-mb-sm-12">
					<label>HX Price<TooltipIcon v-tooltip="'Enter hx price tooltip content here.'" /></label>
					<TheLoader component="h3">
						<h3 v-if="tokenPrices.HX">{{ tokenPrices.HX | toFixed | numberWithCommas }}</h3>
					</TheLoader>
				</StatCard>
				<StatCard class="u-mb-sm-12">
					<label>Rebalance Fee<TooltipIcon v-tooltip="'Enter rebalance fee tooltip content here.'" /></label>
					<TheLoader component="h3">
						<h3 v-if="rebalanceFee">{{ rebalanceFee }}%</h3>
					</TheLoader>
				</StatCard>
			</LayoutGrid>
			<TheLoader component="content-block">
				<LayoutPegZone v-if="tokenPrices.USX > tolerance.high">
					<LayoutFlex class="l-flex-column-md" direction="row-space-between">
						<PageTitle>
							<h2>Peg Zone: Is Above Range<TooltipIcon v-tooltip="'Enter above range tooltip content here.'" /></h2>
							<p>Burn your HX to get the Peg Zone back in range and earn treasury fees.</p>
						</PageTitle>
						<DataCard align="end">
							<p>Available HX Balance</p>
							<h3 class="u-mb-18">{{ numberWithCommas(hxBalance.toFixed(2)) }}<sup>HX</sup></h3>
							<TheButton
								:disabled="connectedAccount === ''"
								title="Click to start burning"
								@click="setModalVisibility('burnModal', true)">Start Burning</TheButton>
							<TheModal
								v-show="isBurnModalVisible"
								title="Burn HX token"
								subtitle="Submit HX amount, burn and bring peg zone back in range."
								:class="modalStatus"
								@close-modal="setModalVisibility('burnModal', false)">
								<BurnInput token-burn="HX" token-receive="USX" :token-balance="numberWithCommas(hxBalance.toFixed(2))" />
							</TheModal>
						</DataCard>
					</LayoutFlex>
					<hr>
					<LayoutFlex class="l-flex-column-md u-mb-sm-24" direction="row-space-between">
						<PageTitle>
							<h2>Rewards<TooltipIcon v-tooltip="'Enter rewards tooltip content here.'" /></h2>
							<p>Claim statement and description (make audience aware of the claim info)</p>
						</PageTitle>
						<DataCard align="end">
							<p>Pending to Claim</p>
							<h3 class="u-mb-18">{{ numberWithCommas(claimBalance.toFixed(2)) }}<sup>HX</sup></h3>
							<TheButton
								:disabled="!canClaim"
								title="Click to start claiming"
								@click="setModalVisibility('claimModal', true)">Start Claiming</TheButton>
						</DataCard>
						<TheModal
							v-show="isClaimModalVisible"
							title="Claim Reward Tokens"
							subtitle="Time to claim your rewards!"
							@close-modal="setModalVisibility('claimModal', false)"
							@claim="claim">
							<ClaimAccordion from="stabilityZone"/>
						</TheModal>
					</LayoutFlex>
					<LayoutFlex v-if="connectedAccount !== ''" class="l-flex-column-sm">
						<DataCard v-if="tokenPrices.USX > tolerance.high || tokenPrices.USX <= tolerance.high && tokenPrices.USX >= tolerance.low" class="u-mr-80 u-mb-sm-24 u-mr-sm-0">
							<label>Claim Ratio<TooltipIcon v-tooltip="'Enter claim ratio tooltip content here.'" /></label>
							<TheLoader component="h3">
								<h3 v-if="connectedAccount !== ''">{{ claimRatio }}%</h3>
								<h3 v-else>-%</h3>
							</TheLoader>
						</DataCard>
						<DataCard>
							<label>Claim rewards in <TooltipIcon v-tooltip="'Enter claim rewards in tooltip content here.'" /></label>
							<TheCountdown :visible="isConnectedWallet" :next-claim-date="nextClaimDate" />
						</DataCard>
					</LayoutFlex>
				</LayoutPegZone>
				<LayoutPegZone v-else-if="tokenPrices.USX < tolerance.low">
					<LayoutFlex direction="row-space-between">
						<PageTitle>
							<h2>Peg Zone: Is Below Range<TooltipIcon v-tooltip="'Enter below range tooltip content here.'" /></h2>
							<p>Burn your USX to get the Peg Zone back in range and earn treasury fees.</p>
						</PageTitle>
						<DataCard align="end">
							<p>Available USX Balance</p>
							<h3>{{ numberWithCommas(usxBalance.toFixed(2)) }}<sup>USX</sup></h3>
							<TheButton
								title="Click to start burning"
								@click="setModalVisibility('burnModal', true)">Start Burning</TheButton>
							<TheModal
								v-show="isBurnModalVisible"
								title="Burn USX token"
								subtitle="Submit USX amount, burn and bring peg zone back in range."
								@close-modal="setModalVisibility('burnModal', false)">
								<BurnInput
									token-burn="USX"
									token-receive="HX"
									:token-balance="numberWithCommas(usxBalance.toFixed(2))" />
							</TheModal>
						</DataCard>
					</LayoutFlex>
				</LayoutPegZone>
				<LayoutPegZone v-else>
					<LayoutFlex direction="column">
						<h2 v-if="tokenPrices.USX">Peg Zone: Is In Range</h2>
						<p v-if="tokenPrices.USX">There is nothing to do.</p>
					</LayoutFlex>
				</LayoutPegZone>
			</TheLoader>
		</LayoutContainer>
		<TheModal
			v-show="isClaimResultModalVisible"
			title="Success"
			@close-modal="setModalVisibility('claimResultModal', false)">
			{{ claimResultModalInfo }}
		</TheModal>
	</div>
</template>

<script>
import { fromWei } from "~/utils/bnTools";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "TheStabilityZone",
	components: {
		TooltipIcon
	},
	data () {
		return {
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
