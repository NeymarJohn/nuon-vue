<template>
	<div>
		<LayoutContainer>
			<LayoutFlex class="l-m-flex--column" direction="row-center-space-between">
				<PageTitle>
					<h4>Farms</h4>
				</PageTitle>
			</LayoutFlex>
			<LayoutFlex direction="row-center-space-between">
				<LayoutFlex>
					<CardView :class="['icon-container', !isTable && 'selected-svg']" @click="viewType = 'card'" />
					<TableView :class="['icon-container', isTable && 'selected-svg']" @click="viewType = 'table'" />
				</LayoutFlex>
				<LayoutFlex>
					<TheSelect :options="['Hot', 'APR', 'Multiplier', 'Earned', 'Liquidity', 'Latest']" :default="'Hot'" label="Sort by" @filter-select="onFilterChange" />
					<LayoutFlex direction="column" class="select u-ml-xs">
						<label>Search</label>
						<input type="text" title="Search for a farm" class="farm-search" placeholder="Search Farms" />
					</LayoutFlex>
				</LayoutFlex>
			</LayoutFlex>
		</LayoutContainer>
		<component
			:is="isTable ? 'LayoutContainer' : 'LayoutFlex'"
			:direction="!isTable && 'row-wrap l-container l-container--md'"
			:class="[isTable && 'l-flex l-flex--column l-flex--column-center']">
			<component
				:is="isTable ? 'FarmRow' : 'FarmCard'"
				v-for="(item, idx) in sortedFarms"
				:key="idx"
				:item="item"
				:idx="idx"
				@viewMoreClicked="viewMoreFn"
			/>
			<div v-observe-visibility="handleScroll"></div>
		</component>
	</div>
</template>

<script>
import { ObserveVisibility } from "vue-observe-visibility";
import CardView from "~/assets/images/svg/svg-card-view.svg";
import TableView from "~/assets/images/svg/svg-table-view.svg";

export default {
	name: "TheFarms",
	directives: {
		ObserveVisibility
	},
	components: {
		CardView,
		TableView,
	},
	data() {
		return {
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
		isTable() {
			return this.viewType === "table";
		},
		sortedFarms() {
			return this.sortFarms();
		}
	},
	methods: {
		getFarms() {
			this.farms.push(...this.farms);
		},
		handleScroll(isVisible) {
			if(!isVisible) return true;
			this.page++;
			this.farms.push(...this.farms);
		},
		viewMoreFn(idx) {
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
