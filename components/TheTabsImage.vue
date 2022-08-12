<template>
	<div class="tabs tabs--default tabs--image tabs--mobile-scroll">
		<ul class="tabs__header">
			<li v-for="(tab, index) in tabs" :key="tab.index" :class="{'is-active': (index === selectedIndex), 'link-disabled': index > 1}" :title="index <= 1 ? `Click to view ${tab.toLowerCase()} hub` : 'Coming Soon'" @click="selectTab(index)">
				<img :src="require(`~/assets/images/borrow/${tab}.png`)" height="24" width="24" />
				<h5>{{ tab }}</h5>
			</li>
			<li v-if="!mobileView" title="Click to view hub overview" @click="setModalVisibility('hubOverviewModal', true)">
				<h5 class="u-color-white u-bb-white">Hub Overview</h5>
			</li>
		</ul>
		<TheModal
			v-show="isHubOverviewModalVisible"
			title="Hub Overview"
			class="modal--hub-overview"
			@close-modal="setModalVisibility('hubOverviewModal', false)">
			<LayoutInfo size="row-space-between">
				<DataCard>
					<label>My Total Locked Collateral</label>
					<TheLoader component="h1">
						<h1>${{ userTotalCollateralAmount | toFixed | numberWithCommas }}</h1>
					</TheLoader>
				</DataCard>
				<DataCard>
					<label>My Total Minted NUON</label>
					<TheLoader component="h1">
						<h1>{{ userTotalMintedNuon | toFixed | numberWithCommas }}<sup>NUON</sup></h1>
					</TheLoader>
				</DataCard>
			</LayoutInfo>
		</TheModal>
	</div>
</template>

<script>
export default {
	name: "TheTabsImage",
	props: {
		userTotalCollateralAmount: {
			type: Number,
			required: true,
			default: 0
		},
		userTotalMintedNuon: {
			type: Number,
			required: true,
			default: 0
		}
	},
	data() {
		return {
			selectedIndex: 0,
			tabs: ["WETH", "USDT", "BTC", "BUSD", "AVAX"],
			mobileView: false,
		};
	},
	computed: {
		isHubOverviewModalVisible() {
			return this.$store.state.modalStore.modalVisible.hubOverviewModal;
		},
	},
	mounted() {
		this.selectTab(0);
		this.mobileView = this.isMobile();
	},
	methods: {
		selectTab(i) {
			if (i > 1) return;
			this.selectedIndex = i;
			this.$emit("tab-changed", {index: i, selectedValue: this.tabs[i]});
		}
	},
};
</script>
