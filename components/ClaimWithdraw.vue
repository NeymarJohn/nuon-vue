<template>
	<div class="claim-withdraw">
		<div class="claim-withdraw__title">
			<label>Claimable Rewards</label>
		</div>
		<div class="claim-withdraw__wrapper">
			<div class="claim-withdraw__token">
				<BusdLogo />
				<h5>BUSD</h5>
			</div>
			<div class="claim-withdraw__value">
				<h3>{{ numberWithCommas(claimBalance.toFixed(2)) }}<sup>BUSD</sup></h3>
				<label>~ ${{ numberWithCommas(getDollarValue(claimBalance, tokenPrice).toFixed(2)) }}</label>
			</div>
		</div>
	</div>
</template>

<script>
import { fromWei } from "~/utils/bnTools";
import { BUSD } from "~/constants/tokens";
import BusdLogo from "@/assets/images/logo/logo-busd.svg";

export default {
	name: "ClaimWithdraw",
	components: {
		BusdLogo,
	},
	data () {
		return {
			tokenPrice: 0,
		};
	},
	computed: {
		claimBalance() {
			return this.rewardFromBoardroom;
		},
		rewardFromBoardroom() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.earned));
		},
	},
	async mounted() {
		await this.getTokenPrice(BUSD.symbol);
	},
	methods: {
		getTokenPrice(tokenSymbol) {
			this.tokenPrice = this.tokenPrices[tokenSymbol] || 0;
		},
	}
};
</script>
