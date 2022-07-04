<template>
	<div class="toggle">
		<div class="toggle__buttons">
			<TheButton
				title="Click to view mint section"
				:class="{ active: isMintView }"
				@click="toggleMintView">Mint</TheButton>
			<TheButton
				title="Click to view redeem section"
				:class="{ active: isWithdrawView }"
				:disabled="isDisabled"
				@click="toggleRedeemView">Redeem</TheButton>
		</div>
		<CollateralMint v-if="isMintView" :currently-selected-collateral="currentlySelectedCollateral" />
		<CollateralRedeem v-else :currently-selected-collateral="currentlySelectedCollateral" />
	</div>
</template>

<script>
import { fromWei } from "~/utils/bnTools";
import { HX } from "~/constants/tokens";

export default {
	name: "CollateralToggle",
	props: {
		currentlySelectedCollateral: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			isMintView: true,
			isWithdrawView: false,
			mintedTokens: 0
		};
	},
	computed: {
		isDisabled() {
			return this.mintedTokens === 0;
		},
		myRewards() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.earned));
		},
		isApproved() {
			const isApprovedToken = this.$store.getters["boardroomStore/checkApprovedToken"](HX.symbol);
			return isApprovedToken ? "btn--approved" : "";
		},
		hxPrice() {
			return this.tokenPrices.HX;
		},
		claimRewardsToken() {
			return { symbol: HX.symbol, price: this.hxPrice, balance: this.myRewards };
		},
	},
	mounted() {
		setTimeout(async () => {
			if (this.connectedAccount) {
				this.mintedTokens = fromWei(await this.$store.getters["collateralVaultStore/getUserMintedAmount"](this.connectedAccount));
			}
		}, 1000);
	},
	methods: {
		toggleMintView() {
			this.isMintView = true;
			this.isWithdrawView = false;
		},
		toggleRedeemView() {
			if(this.mintedTokens !== 0) {
				this.isMintView = false;
				this.isWithdrawView = true;
			}
		},
		selectClaimToken(token) {
			const price = this.tokenPrices[token.symbol];
			this.claimRewardsToken = {...token, price, balance: this.myRewards};
		},
		submitTransaction() {
			this.$store.commit("modalStore/setModalStatus", "is-confirming");
			if (this.modalError) this.$store.commit("modalStore/setModalError", "");
			if (this.account !== "") {
				const _this = this;
				if (this.action === "stake") {
					this.$store.dispatch("boardroomStore/stake", {
						amount: this.inputValue,
						onConfirm: () => this.successToast(),
						onReject: (e) => this.failureToast(null, e)
					}).then(() => {
						_this.$store.dispatch("boardroomStore/updateStatus");
					});
				} else if (this.action === "withdraw") {
					this.$store.dispatch("boardroomStore/withdraw", {
						amount: this.inputValue,
						onConfirm: () => this.successToast(),
						onReject: (e) => this.failureToast(null, e)
					}).then(()=>{
						_this.$store.dispatch("boardroomStore/updateStatus");
					}).catch(()=>{});;
				} else if (this.action === "claim") {
					this.$store.dispatch("boardroomStore/claimReward", {
						onConfirm: () => this.successToast(),
						onReject: (e) => this.failureToast(null, e)
					}).then(()=>{
						_this.$store.dispatch("boardroomStore/updateStatus");
					}).catch(()=>{});
				}
			}
		},
		approveToken() {
			this.$store.dispatch("boardroomStore/approveToken",
				{
					token: HX.symbol,
					onConfirm:  () => {},
					onReject: () => {},
					onCallback: () => {}
				});
		},
	}
};
</script>
