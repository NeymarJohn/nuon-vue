<template>
	<div class="farms-table">
		<div class="farms-table__row" @click="clicked(idx)">
			<h4 class="u-width-20 u-full-width-sm u-mb-sm-8">{{ item.lpSymbol }}</h4>
			<div class="farms-table__cell">
				<p>Earned</p>
				<h4>{{ item.earnings }}</h4>
			</div>
			<div class="farms-table__cell">
				<p>APR</p>
				<h4>{{ item.apr }}%</h4>
			</div>
			<div class="farms-table__cell">
				<p>Liquidity</p>
				<h4>${{ fromWei(noExponents(item.lpTotalSupply)) }}</h4>
			</div>
			<div class="farms-table__cell">
				<p>Multiplier</p>
				<h4>{{ item.multiplier }}</h4>
			</div>
			<ChevronDown v-if="!viewMore" class="chevron-down" />
			<ChevronUp v-else />
		</div>
		<div v-if="viewMore" class="farms-table__details">
			<div class="farms-table__earned">
				<div>
					<p>Cake earned</p>
					<h3>{{ item.earned }}</h3>
				</div>
				<TheButton title="Click to harvest earnings">
					<HarvestIcon />
					Harvest
				</TheButton>
			</div>
			<LayoutFlex class="u-flex-1 u-full-width-sm u-mb-sm-24" direction="column-start">
				<a title="Click to get LP token" :href="item.addLPLink">
					Get {{ item.lpSymbol }} <ExternalLinkIcon />
				</a>
				<a title="Click to view contract" :href="item.lpAddressLink">
					View Contract <ExternalLinkIcon />
				</a>
				<a title="Click to see pair information" :href="item.poolInfo">
					See Pair Info <ExternalLinkIcon />
				</a>
			</LayoutFlex>
			<TheButton class="u-full-width-sm" title="Click to enable farm">Enable Farm</TheButton>
		</div>
	</div>
</template>

<script>
import ChevronDown from "~/assets/images/svg/svg-chevron-down.svg";
import ChevronUp from "~/assets/images/svg/svg-chevron-up.svg";
import ExternalLinkIcon from "@/assets/images/svg/svg-external-link.svg";
import HarvestIcon from "~/assets/images/svg/svg-harvest.svg";

export default {
	name: "FarmTable",
	components: {
		ChevronDown,
		ChevronUp,
		ExternalLinkIcon,
		HarvestIcon
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
		idx: {
			type: Number,
			required: true
		},
		viewMore: {
			type: Boolean,
			required: true
		}
	},
	methods: {
		clicked(idx) {
			this.$emit("viewMoreClicked", idx);
		}
	}
};
</script>
