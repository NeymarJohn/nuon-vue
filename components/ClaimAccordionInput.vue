<template>
	<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
		<template #step-one>
			<div class="accordion accordion--claim" :class="{ active: isActive }">
				<LayoutFlex direction="row-center-space-between">
					<LayoutFlex
						direction="row-center"
						class="accordion__header"
						title="Click to open token list" @click="triggerAccordion">
						<img :src="require(`~/assets/images/tokens/${selected.name}.png`)" alt="Hydro logo">
						<div class="accordion__token">
							<h2>{{ selected.symbol }}</h2>
							<p>{{ selected.name }}</p>
						</div>
						<ChevronDownIcon v-if="!isActive" />
						<ChevronUpIcon v-else />
					</LayoutFlex>
					<DataCard align="end" class="u-half-width">
						<p v-if="token">Available {{token.symbol}} tokens: {{ numberWithCommas(token.balance.toFixed(2)) }}</p>
						<div class="input">
							<div class="input__container">
								<input
									v-model="inputValue"
									placeholder="0.0"
									type="number"
									min="0"
									max="79"
									autocomplete="off"
									autocorrect="off"
									spellcheck="false"
									inputmode="decimal" />
								<TheButton :disabled="isMaxInputDisabled(token.balance)" size="sm" title="Click to input your max balance" @click="inputMaxBalance">Max</TheButton>
							</div>
						</div>
						<h5 v-if="token">~ ${{ numberWithCommas(getDollarValue(inputValue, token.price).toFixed(2)) }}</h5>
					</DataCard>
				</LayoutFlex>
				<p v-if="isMoreThanBalance" class="u-is-warning u-mb-0 u-text-right">Insufficient balance.</p>
				<div class="accordion__body">
					<div class="accordion__filter">
						<input ref="searchtoken" v-model="search" type="text" placeholder="Search for your token" autocomplete="off">
					</div>
					<div class="accordion__tokens">
						<div v-for="(t, index) in filteredTokens" :key="index" class="token" title="Click to select token" @click="changeToken(t)">
							<div class="token__wrapper">
								<img :src="require(`~/assets/images/tokens/${t.name}.png`)" :alt="`${t.name} logo`">
								<div class="token__body">
									<h4>{{ t.symbol }}</h4>
									<h5>{{ t.name }}</h5>
								</div>
							</div>
							<h5>~ ${{ numberWithCommas(getDollarValue(inputValue, t.price).toFixed(2)) }}</h5>
						</div>
						<div v-if="filteredTokens.length <= 0" class="accordion__results">
							No results found.
						</div>
					</div>
				</div>
			</div>
			<TheButton
				v-if="stepper"
				class="u-full-width"
				size="lg"
				title="Click to go next"
				:disabled="!canClaimRewards"
				@click="activeStep = 2">
				Next
			</TheButton>
		</template>
		<template #step-two>
			<TransactionSummary :values="summary" />
			<div v-if="inputValue > 0" class="modal__info--lower">
				<h4>Days before unstake: {{ epoch }} Days</h4>
				<p>Withdrawing the staked token partially will reset the unstaked window to another 14 days.</p>
			</div>
			<div class="transaction-input__buttons">
				<TheButton
					class="btn btn--lg"
					size="lg"
					title="Click to go back"
					@click="activeStep = 1">Back</TheButton>
				<TheButton
					class="btn btn--lg"
					size="lg"
					title="Click to confirm"
					:disabled="!canClaimRewards || isPending"
					@click="submitTransaction">
					<span v-if="isPending">Pending...</span>
					<span v-else >Confirm</span>
				</TheButton>
			</div>
		</template>
	</TheStepper>
</template>

<script>
import ChevronDownIcon from "@/assets/images/svg/svg-chevron-down.svg";
import ChevronUpIcon from "@/assets/images/svg/svg-chevron-up.svg";
import TokenData from "@/assets/images/tokens/token-data.json";
import { fromWei } from "~/utils/bnTools";
import { HX } from "~/constants/tokens";

export default {
	name: "ClaimAccordionInput",
	components: {
		ChevronDownIcon,
		ChevronUpIcon,
	},
	props: {
		token: {
			type: Object,
			default: () => ({symbol: HX.symbol, price: 0, balance: 0})
		},
		stepper: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	data () {
		return {
			isActive: false,
			isPending: false,
			tokens: TokenData,
			inputValue: 0,
			search: "",
			selected: {
				name: "Hydro",
				symbol: "HX"
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
		canClaimRewards() {
			return this.$store.state.boardroomStore.canClaimRewards;
		},
		claimFee() {
			return this.$store.state.boardroomStore.claimFee;
		},
		claimFeeToken() {
			return this.claimFee * this.claimBalance / 100 || 0;
		},
		claimBalance() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.earned));
		},
		isMoreThanBalance() {
			return this.inputValue > this.token.balance;
		},
		summary() {
			return [
				{
					title: "Amount to Claim",
					val: this.claimBalance,
					currency: this.selected.symbol,
					dollar: this.claimBalance * this.hxPrice
				},
				{
					title: "Fee",
					val: `${this.claimFeeToken}`,
					currency: this.selected.symbol,
					dollar: this.numberWithCommas(this.getDollarValue(this.claimFeeToken , this.hxPrice).toFixed(2))
				},
				{
					title: "Total Received",
					val: this.claimBalance - this.claimFeeToken,
					currency: this.selected.symbol,
					dollar: this.numberWithCommas(this.getDollarValue(this.claimBalance - this.claimFeeToken , this.hxPrice).toFixed(2))
				},
			];
		},
	},
	async mounted() {
		this.hxPrice = parseFloat(await this.$store.getters["stabilityFlashStore/getHYDROPriceInUSDC"]);
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
			this.selected.name = token.name;
			this.selected.symbol = token.symbol;
			this.isActive = !this.isActive;
		},
		inputMaxBalance() {
			this.inputValue = parseFloat(this.token.balance);
		},
		submitTransaction() {
			this.activeStep = "loading";
			this.$store.dispatch("boardroomStore/claimReward", {
				onConfirm: () =>{
					this.isPending = true;
					this.activeStep = 1;
				},
				onReject: (err) =>{
					this.isPending = false;
					this.failureToast(() => {this.activeStep = 2;}, err);
				}
			}).then((txHash) => {
				this.isPending = false;
				this.successToast(() => {this.activeStep = 1;}, "Your transaction succeeded", txHash);
			});
		}
	}
};
</script>
