<template>
	<div class="accordion accordion--claim" :class="{ active: isActive }">
		<LayoutFlex direction="row-center-space-between">
			<LayoutFlex
				direction="row-center"
				class="accordion__header"
				title="Click to open token list" @click="triggerAccordion">
				<img :src="require(`~/assets/images/tokens/${selected.name}.png`)" alt="Hydro logo">
				<div class="accordion__token">
					<h4>{{ selected.symbol }}</h4>
					<p>{{ selected.name }}</p>
				</div>
				<ChevronDownIcon v-if="!isActive" />
				<ChevronUpIcon v-else />
			</LayoutFlex>
			<DataCard align="end" class="u-half-width">
				<p v-if="token" class="accordion__available">Available {{token.symbol}} tokens: {{ numberWithCommas(token.balance.toFixed(2)) }}</p>
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
						<TheButton :disabled="isMaxInputDisabled(token.balance)" size="sm" title="Click to input your max balance" @click="inputMaxBalance">Max</TheButton>
					</div>
				</div>
				<h5 v-if="token" class="u-mb-0">~ ${{ numberWithCommas(getDollarValue(inputValue, token.price).toFixed(2)) }}</h5>
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
						<img :src="require(`~/assets/images/tokens/${t.name}.png`)" :alt="`${t.name} logo`">
						<div class="token__body">
							<h3>{{ t.symbol }}</h3>
							<p>{{ t.name }}</p>
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
</template>

<script>
import ChevronDownIcon from "@/assets/images/svg/svg-chevron-down.svg";
import ChevronUpIcon from "@/assets/images/svg/svg-chevron-up.svg";
import TokenData from "@/assets/images/tokens/token-data.json";
import { fromWei } from "~/utils/bnTools";
import { HX } from "~/constants/tokens";

export default {
	name: "CollateralClaimAccordion",
	components: {
		ChevronDownIcon,
		ChevronUpIcon,
	},
	props: {
		token: {
			type: Object,
			default: () => ({ symbol: HX.symbol, price: 0, balance: 0 })
		},
	},
	data () {
		return {
			isActive: false,
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
		user() {
			return this.$store.state.stabilityFlashStore.user;
		},
		claimBalance() {
			return parseFloat(fromWei(this.user?.outstanding));
		},
		isMoreThanBalance() {
			return this.inputValue > this.token.balance;
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
		}
	},
	async mounted() {
		this.hxPrice = parseFloat(await this.$store.getters["stabilityFlashStore/getHydroPriceInDAI"]);
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
			console.log("Submit transaction");
		}
	}
};
</script>
