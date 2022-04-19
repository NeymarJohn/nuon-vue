<template>
	<div>
		<LayoutContainer>
			<LayoutFlex class="u-mb-md u-m-mb-xs l-m-flex--column" direction="row-center-space-between">
				<PageTitle>
					<h4>Farms</h4>
				</PageTitle>
			</LayoutFlex>
			<LayoutFlex>
				<CardView :class="['icon-container', !isTable && 'selected-svg']" @click="viewType = 'card'" />
				<TableView :class="['icon-container', isTable && 'selected-svg']" @click="viewType = 'table'" />
			</LayoutFlex>
		</LayoutContainer>
		<component
			:is="isTable ? 'LayoutContainer' : 'LayoutFlex'"
			:direction="!isTable && 'row-wrap l-container l-container--md'"
			:class="[isTable && 'l-flex l-flex--column l-flex--column-center']">
			<component
				:is="isTable ? 'FarmRow' : 'FarmCard'"
				v-for="(item, idx) in farms"
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
			farms: [{name: "CAKE-BNB", earned: "0", apr: "37.57%", liquidity: 250000000, multiplier: "40x", viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "BUSD-BNB", earned: "0", apr: "37.57%", liquidity: 250000000, multiplier: "40x", viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "TINC-BNB", earned: "0", apr: "37.57%", liquidity: 250000000, multiplier: "40x", viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "HOTCROSS-BNB", earned: "0", apr: "37.57%", liquidity: 250000000, multiplier: "40x", viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "CAKE-BNB", earned: "0", apr: "37.57%", liquidity: 250000000, multiplier: "40x", viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "BUSD-BNB", earned: "0", apr: "37.57%", liquidity: 250000000, multiplier: "40x", viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "TINC-BNB", earned: "0", apr: "37.57%", liquidity: 250000000, multiplier: "40x", viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "HOTCROSS-BNB", earned: "0", apr: "37.57%", liquidity: 250000000, multiplier: "40x", viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "CAKE-BNB", earned: "0", apr: "37.57%", liquidity: 250000000, multiplier: "40x", viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "BUSD-BNB", earned: "0", apr: "37.57%", liquidity: 250000000, multiplier: "40x", viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "TINC-BNB", earned: "0", apr: "37.57%", liquidity: 250000000, multiplier: "40x", viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"},
				{name: "HOTCROSS-BNB", earned: "0", apr: "37.57%", liquidity: 250000000, multiplier: "40x", viewMore: false, addLPLink: "https://pancakeswap.finance/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", contractAddress: "https://bscscan.com/address/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", poolInfo: "https://pancakeswap.finance/info/pool/0x0eD7e52944161450477ee417DE9Cd3a859b14fD0"}]
		};
	},
	head () {
		return {
			title: "Farms | Nuon"
		};
	},
	computed: {
		isTable() {
			return this.viewType === "table";
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
		}
	}
};
</script>
