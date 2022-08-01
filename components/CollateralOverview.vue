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
			<label>My Collateralization Ratio<TooltipIcon v-tooltip="'The ratio between your locked collateral and minted NUON, expressed as a percentage. Keep this number above the Liquidation Ratio, below, to avoid being liquidated.'" /></label>
			<ComponentLoader component="h1" :loaded="myCollateralizationRatio !== null">
				<h3 :class="getUserCrClass">{{ myCollateralizationRatio | toFixed }}<sup>%</sup></h3>
			</ComponentLoader>
			<TheLoader component="h5">
				<TheBadge v-if="!isNaN(getChangePercent('collateralRatio', collateralRatioArr, true))" :color="getPercentChangeBadgeClass('collateralRatio', collateralRatioArr, true)">{{ getUserCrSign }}{{ Math.abs(getChangePercent('collateralRatio', collateralRatioArr, true)) }}%</TheBadge>
			</TheLoader>
		</DataCard>
		<DataCard>
			<label>Current {{ collateralToken }} Price<TooltipIcon v-tooltip="`Current ${collateralToken} price, for your reference when considering how much collateral to keep locked up.`" /></label>
			<ComponentLoader component="h1" :loaded="currentPrice !== null">
				<h3>${{ currentPrice | toFixed | numberWithCommas }}</h3>
			</ComponentLoader>
			<TheLoader component="h5">
				<TheBadge v-if="!isNaN(collateralPriceChange[0])" :color="collateralPriceChange[1]">{{collateralPriceChange[0]}}%</TheBadge>
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
			collateralRatioArr: []
		};
	},
	computed: {
		getUserCrClass() {
			if (this.myCollateralizationRatio === 0) return "";
			return this.myCollateralizationRatio < 300 ? this.myCollateralizationRatio < 200 ? "u-is-warning" : "u-is-caution" : "u-is-success";
		},
		getUserCrSign() {
			const changePercent = this.getChangePercent("collateralRatio", this.collateralRatioArr, true);
			if (changePercent === 0) return "";
			return changePercent > 0 ? "+ ":"- ";
		}
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
				this.collateralRatioArr = res.data.data.userCollateralHistories;
			}).catch(() => {
				this.failureToast(() => {}, "An error occurred");
			});
		}
	}
};
</script>
