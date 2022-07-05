<template>
	<LayoutInfo size="row-space-between" class="u-mb-48 l-info--chub">
		<DataCard>
			<label>My Total Locked Collateral</label>
			<ComponentLoader component="h1" :loaded="myTotalLockedCollateral !== null">
				<h3>{{ myTotalLockedCollateral | toFixed | numberWithCommas }}<sup>{{ collateralToken }}</sup></h3>
			</ComponentLoader>
			<ComponentLoader component="h5" :loaded="myTotalLockedCollateralDollar !== null">
				<h5>${{ myTotalLockedCollateralDollar | toFixed | numberWithCommas }}</h5>
			</ComponentLoader>
		</DataCard>
		<DataCard>
			<label>My Total NUON Minted</label>
			<ComponentLoader component="h1" :loaded="myTotalMintedTokens !== null">
				<h3>{{ myTotalMintedTokens | toFixed | numberWithCommas }}<sup>NUON</sup></h3>
			</ComponentLoader>
			<ComponentLoader component="h5" :loaded="myTotalMintedTokensDollar !== null">
				<h5>${{ myTotalMintedTokensDollar | toFixed | numberWithCommas }}</h5>
			</ComponentLoader>
		</DataCard>
		<DataCard>
			<label>My Collateralization Ratio<TooltipIcon v-tooltip="'Enter my collateralization ratio tooltip content here.'" /></label>
			<ComponentLoader component="h1" :loaded="myCollateralizationRatio !== null">
				<h3 :class="myCollateralizationRatio < 730 ? myCollateralizationRatio < 460 ? 'u-is-warning' : 'u-is-caution' : 'u-is-success'">{{ myCollateralizationRatio | toFixed }}<sup>%</sup></h3>
			</ComponentLoader>
			<TheLoader component="h5">
				<TheBadge color="price-up">{{collateralRatioDiff>=0?"+":"-"}} {{Math.abs(collateralRatioDiff) | toFixed}}%</TheBadge>
			</TheLoader>
		</DataCard>
		<DataCard>
			<label>Current {{ collateralToken }} Price<TooltipIcon v-tooltip="'Enter current ETH price tooltip content here.'" /></label>
			<ComponentLoader component="h1" :loaded="currentPrice !== null">
				<h3>${{ currentPrice | toFixed | numberWithCommas }}</h3>
			</ComponentLoader>
			<TheLoader component="h5">
				<TheBadge :color="collateralPriceChange[1]">{{collateralPriceChange[0]}}%</TheBadge>
			</TheLoader>
		</DataCard>
	</LayoutInfo>
</template>

<script>
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";
import { getUserCollateralHistory } from "~/services/theGraph";

export default {
	name: "CollateralOverview",
	components: {
		TooltipIcon
	},
	props: {
		collateralToken: {
			type: String,
			default: null
		},
		myTotalLockedCollateral: {
			type: Number,
			default: null
		},
		myTotalLockedCollateralDollar: {
			type: Number,
			default: null
		},
		myTotalMintedTokens: {
			type: Number,
			default: null
		},
		myTotalMintedTokensDollar: {
			type: Number,
			default: null
		},
		myCollateralizationRatio: {
			type: Number,
			default: null
		},
		currentPrice: {
			type: Number,
			default: null
		},
		collateralPriceChange: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			collateralRatioDiff: 0
		};
	},
	watch: {
		connectedAccount(value) {
			if (value) {
				this.getCalcDiffCollateralRatio();
			}
		}
	},
	mounted () {
		this.getCalcDiffCollateralRatio();
	},
	methods: {
		getCalcDiffCollateralRatio() {
			if (!this.connectedAccount) return;
			getUserCollateralHistory({user: this.connectedAccount}).then(res => {
				const latestCollateralHistory = res.data.data.userCollateralHistories;
				if (latestCollateralHistory.length >= 2) {
					this.collateralRatioDiff = Number(latestCollateralHistory[0].collateralRatio) - Number(latestCollateralHistory[1].collateralRatio);
				} else if (latestCollateralHistory.length === 1) {
					this.collateralRatioDiff = Number(latestCollateralHistory[0].collateralRatio);
				} else {
					this.collateralRatioDiff = 0;
				}
			}).catch(() => {
				
			});
		}
	},
};
</script>
