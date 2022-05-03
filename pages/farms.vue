<template>
	<div>
		<LayoutContainer>
			<PageTitle>
				<h4>Farms</h4>
				<h1>Stake LP Tokens to Earn</h1>
			</PageTitle>
		</LayoutContainer>
		<LayoutContainer>
			<LayoutFlex class="u-mb-32" direction="row-end-space-between">
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
						<input type="text" placeholder="Search Farms" autocomplete="off">
					</div>
				</div>
			</LayoutFlex>
			<component
				:is="isTableView ? 'LayoutFlex' : 'LayoutFlex'"
				:direction="!isTableView && 'row-wrap-start'"
				:class="[isTableView && 'l-flex l-flex--column l-flex--column-center']">
				<component
					:is="isTableView ? 'FarmRow' : 'FarmCard'"
					v-for="(item, idx) in sortedFarms"
					:key="idx"
					:item="item"
					:idx="idx"
					@viewMoreClicked="handleViewMore"
				/>
				<div v-observe-visibility="handleScroll"></div>
			</component>
		</LayoutContainer>
	</div>
</template>

<script>
import { ObserveVisibility } from "vue-observe-visibility";
import CardViewIcon from "~/assets/images/svg/svg-card-view.svg";
import TableViewIcon from "~/assets/images/svg/svg-table-view.svg";

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
			isCardView: true,
			isTableView: false,
			page: 0,
			viewType: "table",
			filterOption: "Hot",
			farms: [{name: "CAKE-BNB", earned: 0.25, apr: 1, liquidity: 250000000, multiplier: 2, viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "BUSD-BNB", earned: 0.37, apr: 2, liquidity: 250000000, multiplier: 5, viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "TINC-BNB", earned: 0.23, apr: 3, liquidity: 250000000, multiplier: 8, viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "HOTCROSS-BNB", earned: 0.45, apr: 4, liquidity: 250000000, multiplier: 1, viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "CAKE-BNB", earned: 0, apr: 5, liquidity: 250000000, multiplier: 3, viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "BUSD-BNB", earned: 0, apr: 6, liquidity: 250000000, multiplier: 7, viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "TINC-BNB", earned: 0.39, apr: 7, liquidity: 250000000, multiplier: 6, viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "HOTCROSS-BNB", earned: 0.12, apr: 8, liquidity: 250000000, multiplier: 2, viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "CAKE-BNB", earned: 0.67, apr: 9, liquidity: 250000000, multiplier: 9, viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "BUSD-BNB", earned: 0.69, apr: 10, liquidity: 250000000, multiplier: 5, viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "TINC-BNB", earned: 0.85, apr: 11, liquidity: 250000000, multiplier: 20, viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "HOTCROSS-BNB", earned: 0.14, apr: 12, liquidity: 250000000, multiplier: 10, viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"}]
		};
	},
	head () {
		return {
			title: "Farms | Caldron"
		};
	},
	computed: {
		sortedFarms() {
			return this.sortFarms();
		}
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
		getFarms() {
			this.farms.push(...this.farms);
		},
		handleScroll(isVisible) {
			if(!isVisible) return true;
			this.page++;
			this.farms.push(...this.farms);
		},
		handleViewMore(idx) {
			this.farms[idx].viewMore = !this.farms[idx].viewMore;
		},
		sortFarms() {
			if (this.filterOption === "APR") {
				return this.farms.sort((a, b) => b.apr - a.apr);
			} else if (this.filterOption === "Multiplier") {
				return this.farms.sort((a, b) => b.multiplier - a.multiplier);
			} else if (this.filterOption === "Earned") {
				return this.farms.sort((a, b) => b.earned - a.earned);
			} else if (this.filterOption === "Liquidity") {
				return this.farms.sort((a, b) => b.liquidity - a.liquidity);
			}
			return this.farms;
		},
		onFilterChange(o) {
			this.filterOption = o;
		}
	}
};
</script>
