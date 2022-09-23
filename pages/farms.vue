<template>
	<LayoutContainer>
		<LayoutHeader>
			<PageTitle>
				<h4>Farms</h4>
				<h1>Stake LP Tokens to Earn</h1>
			</PageTitle>
			<PriceIndicator />
		</LayoutHeader>
		<LayoutFlex class="u-mb-32 u-mb-lg-24 l-flex--column-start-sm" direction="row-end-space-between">
			<div class="farms-toggle">
				<TheButton
					title="Click to view card view"
					size="icon"
					:class="{ active: isCardView }"
					@click="toggleCardView">
					<CardViewIcon />
				</TheButton>
				<TheButton
					title="Click to view table view"
					size="icon"
					:class="{ active: isTableView }"
					@click="toggleTableView">
					<TableViewIcon />
				</TheButton>
			</div>
			<div class="farms-filter">
				<TheSelect
					:options="['Hot', 'APR', 'Multiplier', 'Earned', 'Liquidity', 'Latest']"
					:default="'Hot'"
					label="Sort by"
					@filter-select="onFilterChange" />
				<div class="farms-search">
					<input v-model="search" type="text" placeholder="Search Farms" autocomplete="off">
				</div>
			</div>
		</LayoutFlex>
		<LayoutFlex
			:direction="!isTableView && 'row-wrap-start'"
			:class="[isTableView && 'l-flex--column-wrap']">
			<component
				:is="isTableView ? 'FarmTable' : 'FarmCard'"
				v-for="(item, idx) in searchedFarms.slice(0, 10 * page)"
				:key="idx"
				:item="item"
				:idx="idx"
				:view-more="viewMoreArray[idx]"
				@viewMoreClicked="handleViewMore"
			/>
			<div v-observe-visibility="handleScroll"></div>
		</LayoutFlex>
	</LayoutContainer>
</template>

<script>
import { ObserveVisibility } from "vue-observe-visibility";
import CardViewIcon from "~/assets/images/svg/svg-card-view.svg";
import TableViewIcon from "~/assets/images/svg/svg-table-view.svg";
import { BSC_CHAIN_ID } from "~/constants/pancakeswap/networks.ts";

export default {
	name: "TheFarms",
	directives: {
		ObserveVisibility
	},
	components: {
		CardViewIcon,
		TableViewIcon,
	},
	data() {
		return {
			search: "",
			isCardView: true,
			isTableView: false,
			page: 0,
			filterOption: "Hot",
			viewMoreArray: new Array(200).fill(false)
		};
	},
	head () {
		return {
			title: "Farms | NUON",
			meta: [
				{ hid: "farms", name: "description", content: "NUON Farms" },
				{ hid: "og-type", property: "og:type", content: "website" },
				{ hid: "og-title", property: "og:title", content: "Farms | NUON" },
				{ hid: "og-desc", property: "og:description", content: "NUON Farms" },
				{ hid: "og-image", property: "og:image", content: "https://nuon.fi/assets/img/opengraph-default.jpg" },
				{ hid: "og-url", property: "og:url", content: "https://app.nuon.fi/farms" },
				{ hid: "twitter", property: "twitter:card", content: "summary_large_image" },
			]
		};
	},
	computed: {
		searchedFarms() {
			const trimmedSearch = this.search.trim();
			if (trimmedSearch === "") return this.farmsAggData;
			return this.farmsAggData.filter(f => f.lpSymbol.toLowerCase().includes(trimmedSearch.toLowerCase()));
		},
		farms() {
			return this.$store.state.pancakeswapStore.farmsPublicData;
		},
		farmsUserData() {
			return this.$store.state.pancakeswapStore.farmsUserData;
		},
		farmsAggData() {
			if (this.farms.length === 0) return [];
			// combining the farm and user data
			const pidToUserData = this.farmsUserData.reduce((acc, val) => {acc[val.pid] = val; return acc;}, {});
			const aggData = this.farms[0].map(f => {
				const lpAddress = f.lpAddresses[BSC_CHAIN_ID];
				const lpAddressLink = `${this.$config[this.$config.NODE_ENV].bscscanUrl}/address/${f.lpAddress}`;
				const addLPLink = `${this.$config[this.$config.NODE_ENV].pancakeswapUrl}/add/${f.token.address}/${f.quoteToken.address}`;
				const poolInfo = `${this.$config[this.$config.NODE_ENV].pancakeswapUrl}/info/pool/${lpAddress}`;
				return { type: "pancakeswap", ...f, ...pidToUserData[f.pid], lpAddress, lpAddressLink, addLPLink, poolInfo};
			});
			return aggData;
		}
	},
	watch: {
		searchedFarms(newValue) {
			if (newValue) this.viewMoreArray = new Array(newValue.length).fill(false);
		},
		filterOption(newValue) {
			if (newValue === "APR") {
				this.searchedFarms.sort((a, b) => b.apr - a.apr);
			} else if (newValue === "Multiplier") {
				this.searchedFarms.sort((a, b) => b.multiplier - a.multiplier);
			} else if (newValue === "Earned") {
				this.searchedFarms.sort((a, b) => b.earned - a.earned);
			} else if (newValue === "Liquidity") {
				this.searchedFarms.sort((a, b) => b.liquidity - a.liquidity);
			}
		},
	},
	methods: {
		toggleCardView() {
			this.isCardView = true;
			this.isTableView = false;
		},
		toggleTableView() {
			this.isCardView = false;
			this.isTableView = true;
		},
		handleScroll(isVisible) {
			if(!isVisible) return true;
			this.page++;
		},
		handleViewMore(idx) {
			this.$set(this.viewMoreArray, idx, !this.viewMoreArray[idx]);
		},
	}
};
</script>
