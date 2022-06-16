<template>
	<div class="tabs tabs--default tabs--image">
		<ul class="tabs__header">
			<li v-for="(tab, index) in tabs" :key="tab.index" :class="{'is-active': (index === selectedIndex)}" :title="`Click to view ${tab.toLowerCase()} hub`" @click="selectTab(index)">
				<img :src="require(`~/assets/images/borrow/${tab}.png`)" />
				<h5>{{ tab }}</h5>
			</li>
			<li title="Click to view hub overview" @click="setModalVisibility('hubOverviewModal', true)">
				<h5>Hub Overview</h5>
			</li>
		</ul>
		<TheModal
			v-show="isHubOverviewModalVisible"
			title="Hub Overview"
			@close-modal="setModalVisibility('hubOverviewModal', false)">
			<LayoutInfo size="row-space-between" class="u-mb-48">
				<DataCard>
					<label>My Total Collateral Locked</label>
					<TheLoader component="h1">
						<h3>${{ allMyTotalLockedCollateral | toFixed | numberWithCommas }}</h3>
					</TheLoader>
				</DataCard>
				<DataCard>
					<label>My Total Minted</label>
					<TheLoader component="h1">
						<h3>{{ allMyTotalMintedTokens | toFixed | numberWithCommas }}<sup>NUON</sup></h3>
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
		allMyTotalLockedCollateral: {
			type: String,
			required: true,
			default: "0"
		},
		allMyTotalMintedTokens: {
			type: String,
			required: true,
			default: "0"
		}
	},
	data() {
		return {
			selectedIndex: 0,
			tabs: ["ETH", "BTC", "AVAX", "USDC", "USDT"],
		};
	},
	computed: {
		isHubOverviewModalVisible() {
			return this.$store.state.modalStore.modalVisible.hubOverviewModal;
		}
	},
	mounted() {
		this.selectTab(0);
	},
	methods: {
		selectTab (i) {
			this.selectedIndex = i;
			this.$emit("tab-changed", i);
		}
	},
};
</script>
