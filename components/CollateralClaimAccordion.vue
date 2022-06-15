<template>
	<div class="accordion accordion--claim" :class="{ active: isActive }">
		<LayoutFlex class="l-flex--column-start-sm" direction="row-center-space-between">
			<LayoutFlex
				direction="row-center"
				class="accordion__header"
				title="Click to open token list" @click="triggerAccordion">
				<template v-if="selectedToken">
					<img :src="require(`~/assets/images/tokens/${selectedToken.icon}`)" alt="Hydro logo">
					<div class="accordion__token">
						<h4>{{ selectedToken.symbol }}</h4>
						<p>{{ selectedToken.name }}</p>
					</div>
				</template>
				<template v-else>
					<h4>Select Token</h4>
				</template>
				<ChevronDownIcon v-if="!isActive" />
				<ChevronUpIcon v-else />
			</LayoutFlex>
			<DataCard align="end" class="u-half-width u-full-width-sm">
				<p v-if="selectedToken" class="accordion__available">Available {{selectedToken.symbol}} tokens: {{ (selectedToken.balance || 0) | formatLongNumber }}</p>
				<div class="input u-mb-12">
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
						<TheButton :disabled="isMaxInputDisabled(selectedToken ? selectedToken.balance : 0)" size="sm" title="Click to input your max balance" @click="inputMaxBalance">Max</TheButton>
					</div>
				</div>
				<h5 v-if="selectedToken" class="u-mb-0">~ ${{ numberWithCommas(getDollarValue(inputValue, selectedToken.price).toFixed(2)) }}</h5>
			</DataCard>
		</LayoutFlex>
		<p v-if="isMoreThanBalance" class="u-is-warning u-mb-0 u-text-right u-mt-12">Insufficient balance.</p>
		<div class="accordion__body">
			<div class="accordion__filter">
				<input ref="searchtoken" v-model="search" type="text" placeholder="Search for your token" autocomplete="off">
			</div>
			<div class="accordion__tokens">
				<div v-for="(t, index) in filteredTokens" :key="index" class="token" title="Click to select token" @click="changeToken(t)">
					<div class="token__wrapper">
						<img :src="require(`~/assets/images/tokens/${t.icon}`)" :alt="`${t.name} logo`">
						<div class="token__body">
							<h4>{{ t.symbol }}</h4>
							<h5>{{ t.name }}</h5>
						</div>
					</div>
					<h5>~ ${{ getDollarValue(t.balance, t.price || 0) | toFixed | numberWithCommas }}</h5>
				</div>
				<div v-if="filteredTokens.length <= 0" class="accordion__results">
					No results found.
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ChevronDownIcon from "@/assets/images/svg/svg-chevron-down.svg";
import ChevronUpIcon from "@/assets/images/svg/svg-chevron-up.svg";
import { HX, collateralTokens } from "~/constants/tokens";

export default {
	name: "CollateralClaimAccordion",
	components: {
		ChevronDownIcon,
		ChevronUpIcon,
	},
	props: {
		token: {
			type: Object,
			default: () => ({ symbol: HX.symbol, price: 0, balance: 0, icon:"HX.icon" })
		},
		defaultValue: {
			type: [Number, String],
			default: 0
		}
	},
	data () {
		return {
			isActive: false,
			inputValue: 0,
			search: "",
			selectedToken: null,
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
		isMoreThanBalance() {
			return this.inputValue > this.tokenBalance;
		},
		summary() {
			return [
				{
					title: "Amount to Claim",
					val: this.numberWithCommas(parseFloat(this.inputValue).toFixed(2)),
					currency: "HX",
					dollar: "2,000.08 = 10.00 TNODE"
				},
				{
					title: "Fee",
					val: "5%",
					dollar: this.numberWithCommas(this.getDollarValue(10, 1).toFixed(2))
				},
				{
					title: "Total Received",
					val: 12.34,
					currency: "HX",
					dollar: "1,900.00 = 9.84 TNODE"
				},
			];
		},
		tokenBalance() {
			if (!this.selectedToken) return 0;
			return parseFloat(this.selectedToken.balance);
		},
		tokens() {
			return collateralTokens.map(t => {
				return {...t, balance: this.tokenBalances[t.symbol] || 0, price: this.tokenPrices[t.symbol]};
			});
		}
	},
	watch: {
		inputValue(newValue) {
			this.$emit("change-input", newValue);
		}
	},
	mounted() {
		this.$store.commit("rootStore/setIsLoaded", true);
		window.addEventListener("click", (e) => {
			if (!this.$el.contains(e.target)){
				this.isActive = false;
			}
		});
		this.inputValue = this.defaultValue;
	},
	methods: {
		triggerAccordion() {
			this.isActive = !this.isActive;
			this.$nextTick(() => this.$refs.searchtoken.focus());
		},
		changeToken(token) {
			this.$emit("selected-token", token);
			this.selectedToken = { ...token};
			this.isActive = !this.isActive;
		},
		inputMaxBalance() {
			if (!this.selectedToken) return ;
			this.inputValue = this.selectedToken.balance;
		},
		submitTransaction() {}
	},
};
</script>
