<template>
	<div class="accordion accordion--swap" :class="{ active: isActive }">
		<LayoutFlex class="l-flex--column-sm" direction="row-start-space-between">
			<LayoutFlex
				v-if="selected.symbol"
				direction="row-center"
				class="accordion__header"
				title="Click to open token list"
				@click="triggerAccordion">
				<img v-if="selected.icon" :src="require(`~/assets/images/tokens/${selected.icon}`)" alt="token logo">
				<div class="accordion__token">
					<h4>{{ selected.symbol }}</h4>
					<p>{{ selected.name }}</p>
				</div>
				<ChevronDownIcon v-if="!isActive" />
				<ChevronUpIcon v-else />
			</LayoutFlex>
			<LayoutFlex
				v-else
				direction="row-center"
				class="accordion__header"
				title="Click to open token list" @click="triggerAccordion">
				<div class="accordion__token">
					<h4>Select Token</h4>
					<p>{{ selected.name }}</p>
				</div>
				<ChevronDownIcon v-if="!isActive" />
				<ChevronUpIcon v-else />
			</LayoutFlex>
			<DataCard align="end">
				<slot />
			</DataCard>
		</LayoutFlex>
		<div class="accordion__body">
			<div class="accordion__filter">
				<input ref="searchtoken" v-model="search" type="text" placeholder="Search for your token" autocomplete="off">
			</div>
			<div class="accordion__tokens">
				<div v-for="(token, index) in filteredTokens" :key="index" class="token" title="Click to select token" @click="changeToken(token)">
					<div class="token__wrapper" :class="isDisabled(token.symbol)?'disabled':''">
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
</template>

<script>
import ChevronDownIcon from "@/assets/images/svg/svg-chevron-down.svg";
import ChevronUpIcon from "@/assets/images/svg/svg-chevron-up.svg";
import { mainTokens } from "~/constants/tokens";

export default {
	name: "SwapAccordion",
	components: {
		ChevronDownIcon,
		ChevronUpIcon,
	},
	props: {
		defaultToken: {
			type: String,
			default: ""
		},
		disabledTokens: {
			type: Array,
			// eslint-disable-next-line vue/require-valid-default-prop
			default: []
		}
	},
	data () {
		return {
			isActive: false,
			search: "",
			selected: {
				name: "",
				symbol: "",
				icon: ""
			}
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
		tokens() {
			return mainTokens;
		}
	},
	watch: {
		defaultToken(newValue) {
			if (newValue) {
				this.setSelectedToken(newValue);
			}
		}
	},
	mounted() {
		if (this.defaultToken) {
			this.setSelectedToken(this.defaultToken);
		}
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
			if (this.isDisabled(token.symbol)) return;
			this.$emit("selected-token", token);
			this.selected = {...token};
			this.isActive = !this.isActive;
		},
		setSelectedToken(tokenSymbol) {
			const defaultToken = this.tokens.find(item => item.symbol === tokenSymbol);
			this.selected = {...defaultToken};
		},
		isDisabled(token) {
			return this.disabledTokens.includes(token);
		}
	},
};
</script>
