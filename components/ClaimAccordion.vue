<template>
	<div>
		<div class="accordion u-mb-24" :class="{ active: isActive }">
			<div class="accordion__container">
				<label>Select Your Reward Token</label>
				<LayoutFlex direction="row-start-space-between">
					<LayoutFlex
						direction="row-center accordion__header"
						title="Click to open token list"
						@click="triggerAccordion">
						<img v-if="selected.icon" :src="require(`~/assets/images/tokens/${selected.icon}`)" :alt="`${selected.name} logo`">
						<div class="accordion__token">
							<h5>{{ selected.symbol }}</h5>
						</div>
						<ChevronDownIcon v-if="!isActive" />
						<ChevronUpIcon v-else />
					</LayoutFlex>
					<DataCard align="end">
						<h3>{{ numberWithCommas(claimBalance.toFixed(2)) }}<sup>{{ selected.symbol }}</sup></h3>
						<label>~ ${{ numberWithCommas(getDollarValue(claimBalance, tokenPrice).toFixed(2)) }}</label>
					</DataCard>
				</LayoutFlex>
			</div>
			<div class="accordion__body">
				<div class="accordion__filter">
					<input ref="searchtoken" v-model="search" type="text" placeholder="Search for your token" autocomplete="off">
				</div>
				<div class="accordion__tokens">
					<div
						v-for="(token, index) in filteredTokens"
						:key="index"
						class="token"
						title="Click to select token"
						@click="changeToken(token)">
						<div class="token__wrapper">
							<img :src="require(`~/assets/images/tokens/${token.icon}`)" :alt="`${token.name} logo`">
							<div class="token__body">
								<h4>{{ token.symbol }}</h4>
								<h5>{{ token.name }}</h5>
							</div>
						</div>
					</div>
					<div v-if="filteredTokens.length <= 0" class="accordion__results">
						No results found.
					</div>
				</div>
			</div>
		</div>
		<TransactionSummary :values="summary" />
		<TheButton
			size="md"
			title="Click to withdraw"
			@click="submitTransaction">Withdraw</TheButton>
	</div>
</template>

<script>
import ChevronDownIcon from "@/assets/images/svg/svg-chevron-down.svg";
import ChevronUpIcon from "@/assets/images/svg/svg-chevron-up.svg";
import { fromWei } from "~/utils/bnTools";
import { mainTokens, nuMINT } from "~/constants/tokens";

export default {
	name: "ClaimAccordion",
	components: {
		ChevronDownIcon,
		ChevronUpIcon,
	},
	data () {
		return {
			tokenPrice: 0,
			isActive: false,
			search: "",
			selected: {
				name: "nuMINT Token",
				symbol: "nuMINT",
				icon: "nuMINT.png"
			},
			activeStep: 1
		};
	},
	computed: {
		filteredTokens () {
			return this.tokens.filter((token) => {
				const filterTokenByName = token.name.toLowerCase().includes(this.search.toLowerCase());
				const filterTokenBySymbol = token.symbol.toLowerCase().includes(this.search.toLowerCase());
				return filterTokenByName || filterTokenBySymbol;
			});
		},
		claimFee() {
			return this.$store.state.boardroomStore.claimFee;
		},
		claimFeeToken() {
			return this.claimFee * this.claimBalance / 100 || 0;
		},
		claimBalance() {
			return this.rewardFromBoardroom;
		},
		rewardFromBoardroom() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.earned));
		},
		summary() {
			return [
				{
					title: "Amount to Claim",
					val: this.claimBalance,
					currency: this.selected.symbol,
					dollar: this.claimBalance * this.tokenPrice
				},
				{
					title: "Claim Ratio",
					val: `${this.claimFee || 0}%`,
				},
				{
					title: "Fee",
					val: `${this.claimFeeToken}`,
					currency: this.selected.symbol,
					dollar: this.numberWithCommas(this.getDollarValue(this.claimFeeToken , this.tokenPrice).toFixed(2))
				},
				{
					title: "Total Received",
					val: this.claimBalance - this.claimFeeToken,
					currency: this.selected.symbol,
					dollar: this.numberWithCommas(this.getDollarValue(this.claimBalance - this.claimFeeToken , this.tokenPrice).toFixed(2))
				},
			];
		},
		tokens() {
			return mainTokens;
		}
	},
	async mounted() {
		await this.getTokenPrice(nuMINT.symbol); // Get nuMINT token price
		this.$store.commit("rootStore/setIsLoaded", true);
		window.addEventListener("click", (e) => {
			if (!this.$el.contains(e.target)){
				this.isActive = false;
			}
		});
	},
	methods: {
		triggerAccordion() {
			this.isActive = !this.isActive;
			this.$nextTick(() => this.$refs.searchtoken.focus());
		},
		changeToken(token) {
			this.$emit("selected-token", token);
			this.selected = { ...token };
			this.isActive = !this.isActive;
			this.getTokenPrice(token.symbol);
		},
	  getTokenPrice(tokenSymbol) {
			this.tokenPrice = this.tokenPrices[tokenSymbol] || 0;
		},
		submitTransaction() {
			this.$store.dispatch("boardroomStore/claimReward", {
				onConfirm: () =>{
					this.isPending = true;
				},
				onReject: () =>{
					this.isPending = false;
					this.failureToast(() => {}, "Transaction is failed!");
				}
			}).then((txHash) => {
				this.isPending = false;
				this.successToast(() => {this.activeStep = 1;}, "Your transaction succeeded", txHash);
			});
		}
	}
};
</script>
