<template>
	<LayoutFlex direction="column" class="farm-row-container">
		<div class="farm-row" @click="clicked(idx)">
			<div class="farm-row__item">
				{{item.name}}
			</div>
			<div class="farm-row__item">
				<div class="farm-row__item-header">
					Earned
				</div>
				<div>
					{{item.earned}}
				</div>
			</div>
			<div class="farm-row__item">
				<div class="farm-row__item-header">
					APR
				</div>
				<div>
					{{item.apr}}
				</div>
			</div>
			<div class="farm-row__item">
				<div class="farm-row__item-header">
					Liquidity
				</div>
				<div>
					{{item.liquidity}}
				</div>
			</div>
			<div class="farm-row__item">
				<div class="farm-row__item-header">
					Multiplier
				</div>
				<div>
					{{item.multiplier}}
				</div>
			</div>
			<ChevronDown v-if="!item.viewMore" class="chevron-down" />
			<ChevronUp v-else />
		</div>
		<LayoutFlex v-if="item.viewMore" class="more-info" direction="row-center">
			<LayoutFlex direction="column" class="more-info__item">
				<a :href="item.addLPLink" class="text-underline">Get {{item.name}} LP <ExternalLinkIcon /></a>
				<a :href="item.contractAddress" class="text-underline">View Contract <ExternalLinkIcon /></a>
				<a :href="item.poolInfo" class="text-underline">See Pair Info <ExternalLinkIcon /></a>
			</LayoutFlex>
			<div class="more-info__item">
				<div class="more-info__round-container">
					<p>Cake earned</p>
					<LayoutFlex direction="row-space-around">
						<div>{{item.earned}}</div>
						<button>Harvest</button>
					</LayoutFlex>
				</div>
			</div>
			<div class="more-info__item">
				<div class="more-info__round-container">
					<p>Enable farm</p>
					<button class="more-info__round-container__enable-farm">Enable farm</button>
				</div>
			</div>
		</LayoutFlex>
	</LayoutFlex>
</template>

<script>
import ChevronDown from "~/assets/images/svg/svg-chevron-down.svg";
import ChevronUp from "~/assets/images/svg/svg-chevron-up.svg";
import ExternalLinkIcon from "@/assets/images/svg/svg-external-link.svg";


export default {
	name: "FarmRow",
	components: {
		ChevronDown,
		ChevronUp,
		ExternalLinkIcon
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
		idx: {
			type: Number,
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

<style>

</style>
