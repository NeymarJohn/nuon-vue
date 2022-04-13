<template>
	<LayoutFlex direction="column" class="farm-card-container">
		<LayoutFlex direction="row-space-between">
			<p>test</p>
			<p>{{item.name}}</p>
		</LayoutFlex>
		<LayoutFlex direction="row-space-between">
			<p>APR:</p>
			<p>{{item.apr}}</p>
		</LayoutFlex>
		<LayoutFlex direction="row-space-between">
			<p>Earn:</p>
			<p>{{item.earned}}</p>
		</LayoutFlex>
		<LayoutFlex>
			<div class="farm-card__more-info">
				<p>Cake earned</p>
				<LayoutFlex direction="row-space-around">
					<div>{{item.earned}}</div>
					<button>Harvest</button>
				</LayoutFlex>
			</div>
		</LayoutFlex>
		<LayoutFlex>
			<div class="farm-card__more-info">
				<p>Enable farm</p>
				<button class="more-info__round-container__enable-farm">Enable farm</button>
			</div>
		</LayoutFlex>
		<hr class="farm-card__hr" />
		<LayoutFlex
			class="farm-card__details-text"
			direction="row-center-space-between l-flex--row-justify-center"
			@click="viewMoreClicked(idx)"
		>
			Details
			<ChevronDown v-if="!item.viewMore" class="chevron-down" />
			<ChevronUp v-else />
		</LayoutFlex>
		<div v-if="item.viewMore" class="farm-card__details">
			<LayoutFlex direction="row-space-between">
				<div>Total liquidity</div>
				<div>{{item.liquidity}}</div>
			</LayoutFlex>
			<LayoutFlex direction="column">
				<a :href="item.addLPLink" class="text-underline">Get {{item.name}} LP <ExternalLinkIcon /></a>
				<a :href="item.contractAddress" class="text-underline">View Contract <ExternalLinkIcon /></a>
				<a :href="item.poolInfo" class="text-underline">See Pair Info <ExternalLinkIcon /></a>
			</LayoutFlex>
		</div>
	</LayoutFlex>
</template>

<script>
import ChevronDown from "~/assets/images/svg/svg-chevron-down.svg";
import ChevronUp from "~/assets/images/svg/svg-chevron-up.svg";
import ExternalLinkIcon from "@/assets/images/svg/svg-external-link.svg";

export default {
	name: "FarmCard",
	components: {
		ChevronDown,
		ChevronUp,
		ExternalLinkIcon
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

<style>

</style>
