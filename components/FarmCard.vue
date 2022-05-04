<template>
	<div class="farms-card">
		<h4 class="u-mb-24 u-mb-md-20">{{ item.name }}</h4>
		<LayoutFlex direction="row-center-space-between">
			<p class="u-mb-0 u-colour-light-grey">APR:</p>
			<h4>{{ item.apr }}%</h4>
		</LayoutFlex>
		<LayoutFlex class="u-mb-16" direction="row-center-space-between">
			<p class="u-mb-0 u-colour-light-grey">Earn:</p>
			<h4>{{ item.earned }}</h4>
		</LayoutFlex>
		<div class="farms-card__earned">
			<div class="farms-card__text">
				<h5>Cake Earned</h5>
				<h3>{{ item.earned }}</h3>
			</div>
			<TheButton title="Click to harvest earnings">
				<HarvestIcon />
				Harvest
			</TheButton>
		</div>
		<TheButton class="u-mb-24" title="Click to enable farm">Enable Farm</TheButton>
		<LayoutFlex
			class="u-cursor-pointer"
			direction="row-center-space-between"
			@click="viewMoreClicked(idx)">
			<h5 class="u-colour-light-grey">Details</h5>
			<ChevronDown v-if="!item.viewMore" class="chevron-down" />
			<ChevronUp v-else />
		</LayoutFlex>
		<div v-if="item.viewMore" class="farm-card__details">
			<LayoutFlex class="u-bb-light-grey u-mb-16 u-pb-16" direction="row-center-space-between">
				<p class="u-mb-0 u-colour-light-grey">Total Liquidity:</p>
				<h4>${{ numberWithCommas(item.liquidity) }}</h4>
			</LayoutFlex>
			<LayoutFlex direction="column-start">
				<a title="Click to get LP token" :href="item.addLPLink">
					Get {{ item.name }} LP <ExternalLinkIcon />
				</a>
				<a title="Click to view contract" :href="item.contractAddress">
					View Contract <ExternalLinkIcon />
				</a>
				<a title="Click to see pair information" :href="item.poolInfo">
					See Pair Info <ExternalLinkIcon />
				</a>
			</LayoutFlex>
		</div>
	</div>
</template>

<script>
import ChevronDown from "~/assets/images/svg/svg-chevron-down.svg";
import ChevronUp from "~/assets/images/svg/svg-chevron-up.svg";
import ExternalLinkIcon from "@/assets/images/svg/svg-external-link.svg";
import HarvestIcon from "~/assets/images/svg/svg-harvest.svg";

export default {
	name: "FarmCard",
	components: {
		ChevronDown,
		ChevronUp,
		ExternalLinkIcon,
		HarvestIcon
	},
	props: {
		item: {
			type: Object,
			required: true
		},
		idx: {
			type: Number,
			required: true
		}
	},
	methods: {
		viewMoreClicked(idx) {
			this.$emit("viewMoreClicked", idx);
		}
	}
};
</script>
