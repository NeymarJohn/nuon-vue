<template>
	<div>
		<div :class="userAction === 'Receive' ? 'l-flex l-flex--column-reverse' : '' ">
			<div class="swap__container" :class="action === 'Mint' ? 'u-mb-10' : null">
				<SwapBalance
					:label="userAction"
					:token="lockedCallateral" />
				<MintAccordion
					:disabled-tokens="[selectedCollateral, 'BTC', 'BUSD', 'AVAX']"
					:default-token="defaultCollateral"
					@selected-token="selectCollateral">
					<InputMax v-model="value" :maximum="lockedCallateral" @click="inputMaxBalance" />
					<LayoutFlex direction="row-justify-end">
						<p class="u-mb-0 u-font-size-14">~ ${{getDollarValue(lockedCallateral,tokenPrices[selectedCollateral]) | toFixed | numberWithCommas}}</p>
					</LayoutFlex>
				</MintAccordion>
			</div>
			<div class="swap__container" :class="userAction === 'Receive' ? 'u-mb-10' : null">
				<SwapBalance
					:label="action"
					:token="lockedCallateral" />
				<div class="input-wrapper">
					<div class="input-token">
						<NuonLogo />
						<h5>NUON</h5>
					</div>
					<InputMax v-model="value" :maximum="availableAmount()" @click="inputMaxBalance" />
				</div>
				<LayoutFlex direction="row-justify-end">
					<p class="u-mb-0 u-font-size-14 u-color-light-grey">~ ${{0 | toFixed | numberWithCommas}}</p>
				</LayoutFlex>
			</div>
		</div>
		<LayoutFlex direction="row-justify-end">
			<TheButton
				class="u-mt-24"
				:title="`Click to ${action}`"
				:disabled="submitDisabled"
				@click="submit">{{action}}</TheButton>
		</LayoutFlex>
	</div>
</template>
<script>
import { fromWei, toWei } from "~/utils/bnTools";
import NuonLogo from "@/assets/images/logo/logo-numint.svg";

export default {
	name: "InputManageNuon",
	components: {
		NuonLogo,
	},
	props: {
		action: {
			type: String,
			required: true
		},
		userAction: {
			type: String,
			required: true
		},
		defaultCollateral: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			depositInput: "",
			value: "",
			error: "",
			estimatedAmount: {0: 0, 1: 0, 2: 0, 3: 0},
			shareAmount: "",
			selectedCollateral: "WETH"
		};
	},
	computed: {
		submitDisabled() {
			if (!this.value || (this.action === "burn" && parseFloat(this.value) > this.userMintedAmount)) {
				return true;
			}
			return false;
		},
		summary() {
			const summary = [{title: "New Collateral Ratio", val: `${parseFloat(this.estimatedAmount[0]).toFixed(0)}%`}];
			if (this.action === "Deposit") {
				 // this.estimatedAmount = user cratio after deposit, collateral user will receive after deposit, user collateral amount after deposit
				summary.push({title: "New Collateral Amount", val: this.estimatedAmount[2]});
			} else if (this.action === "Burn") {
				// this.estimatedAmount = user cratio after burn, burned nuons, total amount of nuon left after burn
				summary.push({title: "New NUON Amount", val: this.estimatedAmount[2]});
			} else if (this.action === "Mint") {
				// this.estimatedAmount = user cratio after mint, amount of nuon minted, user total nuon after mint
				summary.push({title: "NUON Minted Amount", val: this.estimatedAmount[1]});
				summary.push({title: `Extra ${this.selectedCollateral} Required`, val: this.estimatedAmount[3]});
				summary.push({title: "New NUON Balance", val: this.estimatedAmount[2]});
			} else {
				// this.estimatedAmount = user cratio after redeem, amount redeemed , collaterals left after redeem
				summary.push({title: "New Collateral Amount", val: this.estimatedAmount[2]});
			}
			const lastIdx = summary.length - 1;
			summary[lastIdx].val = `${parseFloat(summary[lastIdx].val).toFixed(2)} ${this.actionIsMintOrBurn ? "NUON" : this.selectedCollateral}`;
			return summary;
		},
		decimals() {
			return this.$store.state.erc20Store.decimals[this.selectedCollateral];
		},
		actionIsMintOrBurn() {
			return ["Mint", "Burn"].includes(this.action);
		},
		tokenBalance() {
			return this.$store.state.erc20Store.balance[this.selectedCollateral];
		},
		isMoreThanBalance() {
			return parseFloat(this.value) > this.tokenBalance;
		},
		nuonBalance() {
			return this.$store.state.erc20Store.balance.NUON;
		},
		lockedCallateral() {
			return this.$store.state.collateralVaultStore.lockedAmount[this.selectedCollateral];
		},
		userMintedAmount() {
			return this.$store.state.collateralVaultStore.mintedAmount[this.selectedCollateral];
		}
	},
	mounted () {
		this.selectedCollateral = this.defaultCollateral;
	},
	methods: {
		async getEstimatedAmounts() {
			let method;
			if (this.action === "Burn") {
				method = "burnNUONEstimation";
			} else if (this.action === "Mint") {
				method = "mintWithoutDepositEstimation";
			}
			const amount = toWei(this.value);

			let resp = {0: 0, 1: 0, 2: 0};
			let resp2 = {1: 0};
			try {
				resp = await this.$store.getters[`collateralVaultStore/${method}`](amount, this.connectedAccount);
				if (this.action === "Mint") {
					resp2 = await this.$store.getters["collateralVaultStore/mintLiquidityHelper"](resp[1]);
				}
			} catch (e) {
				const mintLiquidationMsg = "This will liquidate you";
				if (e.message.includes(mintLiquidationMsg)) {
					this.submitDisabled = true;
					this.error = mintLiquidationMsg;
				}
			} finally {
				this.$set(this.estimatedAmount, 0, fromWei(resp[0]));
				this.$set(this.estimatedAmount, 1, fromWei(resp[1], this.actionIsMintOrBurn ? 18 : this.decimals));
				this.$set(this.estimatedAmount, 2, fromWei(resp[2]));
				if (this.action === "Mint") {
					this.$set(this.estimatedAmount, 3, parseFloat(fromWei(resp2[0], this.decimals)).toFixed(2));
				}
			}
		},
		inputMaxBalance() {
			
		},
		submit() {
			try {
				this.error = "";
				let methodName = "";
				if (this.action === "Burn") {
					methodName = "burnNUON";
				} else if (this.action === "Mint") {
					methodName = "mintWithoutDeposit";
				}
				const amount = toWei(this.value);
				this.$store.dispatch(`collateralVaultStore/${methodName}`, {
					collateral: this.selectedCollateral,
					amount,
					onConfirm: (_confNumber, receipt, _latestBlockHash) => {
						this.successToast(null, "Transaction Succeeded", receipt.transactionHash);
						this.$store.dispatch("collateralVaultStore/updateStatus");
						this.$store.dispatch("erc20Store/initializeBalance", {address: this.connectedAccount});
					},
					onReject: (err) => {
						this.failureToast(null, err, "Transaction failed");
					}
				});
			} catch (e) {
				this.failureToast(null, e, "Transaction Failed");
			}
		},
		availableAmount() {
			if (this.actionIsMintOrBurn) {
				return this.nuonBalance;
			}
			if (this.action === "Deposit") {
				return this.tokenBalance || 0;
			} else if (this.action === "Withdraw") {
				return this.$store.state.collateralVaultStore.lockedAmount[this.selectedCollateral];
			}
		},
		selectCollateral(token) {
			this.selectedCollateral = token.symbol;
			this.$emit("changeCollateral", token);
		},
		inputChanged() {
			this.error = "";
			this.getEstimatedAmounts();
		},
		beforeMount () {
			this.selectedCollateral = this.defaultCollateral;
		},
	},
};
</script>