<template>
	<div>
		<div :class="action === 'Burn' ? 'l-flex l-flex--column-reverse u-mb-24' : 'u-mb-24' ">
			<div class="swap__container" :class="action === 'Mint' ? 'u-mb-10' : null">
				<SwapBalance
					label="Spend"
					:token="selectedCollateral" 
					:balance="lockedCallateral"/>
				<MintAccordion
					:disabled-tokens="['BTC', 'BUSD', 'AVAX']"
					:default-token="defaultCollateral"
					@selected-token="selectCollateral">
					<template #input>
						<InputMax v-model="spendValue" :maximum="lockedCallateral" auto-focus @input="handleChangeCollateral" />
					</template>
					<template #messages>
						<LayoutFlex direction="row-justify-end">
							<p class="u-mb-0 u-font-size-14 u-color-light-grey">~ ${{getDollarValue(spendValue,tokenPrices[selectedCollateral]) | toFixed | numberWithCommas}}</p>
						</LayoutFlex>
					</template>
				</MintAccordion>
			</div>
			<div class="swap__container" :class="action === 'Burn' ? 'u-mb-10' : null">
				<SwapBalance
					:label="action"
					token="NUON"
					:balance="userMintedAmount" />
				<div class="input-wrapper">
					<div class="input-token">
						<NuonLogo />
						<h5>NUON</h5>
					</div>
					<InputMax  v-model="mintValue" :maximum="userMintedAmount" :hidden-max-button="action==='Mint'" @input="inputChanged"/>
				</div>
				<LayoutFlex direction="row-center-space-between">
					<div>
						<p v-if="isMoreThanEqualMinimumAndLessThanBalance" class="u-font-size-14 u-is-success u-mb-0">Ready To {{ action }}</p>
						<p v-if="isMoreThanBalance" class="u-font-size-14 u-is-warning u-mb-0">Insufficient Balance</p>
					</div>
					<p class="u-mb-0 u-font-size-14 u-color-light-grey">~ ${{getDollarValue(mintValue,tokenPrices.NUON) | toFixed | numberWithCommas}}</p>
				</LayoutFlex>
			</div>
		</div>
		<TransactionSummary v-if="mintValue > 0 && !isMoreThanBalance" class="u-mt-24" :values="summary" />
		<LayoutFlex direction="row-justify-end">
			<TheButton
				class="u-min-width-200"
				:title="`Click to ${action}`"
				:disabled="isSubmitDisabled"
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
		defaultCollateral: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			depositInput: "",
			mintValue: "",
			spendValue: "",
			error: "",
			estimatedAmount: {0: 0, 1: 0, 2: 0, 3: 0},
			shareAmount: "",
			selectedCollateral: "WETH"
		};
	},
	computed: {
		isSubmitDisabled() {
			if (!this.mintValue || (this.action === "burn" && parseFloat(this.mintValue) > this.userMintedAmount) || this.isMoreThanBalance) {
				return true;
			}
			return false;
		},
		isMoreThanEqualMinimumAndLessThanBalance() {
			return parseFloat(this.mintValue) > 0 && parseFloat(this.mintValue) <= this.tokenBalance;
		},
		summary() {
			const summary = [{title: "New Collateral Ratio", val: `${parseFloat(this.estimatedAmount[0]).toFixed(0)}%`}];
			if (this.action === "Burn") {
				// this.estimatedAmount = user cratio after burn, burned nuons, total amount of nuon left after burn
				summary.push({title: "New NUON Amount", val: this.estimatedAmount[2]});
			} else if (this.action === "Mint") {
				// this.estimatedAmount = user cratio after mint, amount of nuon minted, user total nuon after mint
				summary.push({title: "NUON Minted Amount", val: this.estimatedAmount[1]});
				summary.push({title: `Extra ${this.selectedCollateral} Required`, val: this.estimatedAmount[3]});
				summary.push({title: "New NUON Balance", val: this.estimatedAmount[2]});
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
			return parseFloat(this.mintValue) > this.tokenBalance;
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
	methods: {
		async getEstimatedAmounts() {
			let method;
			if (this.action === "Burn") {
				method = "burnNUONEstimation";
			} else if (this.action === "Mint") {
				method = "mintWithoutDepositEstimation";
			}
			const amount = toWei(this.mintValue);

			let resp = {0: 0, 1: 0, 2: 0};
			let resp2 = {1: 0};
			try {
				resp = await this.$store.getters[`collateralVaultStore/${method}`](this.selectedCollateral, amount, this.connectedAccount);
				if (this.action === "Mint") {
					resp2 = await this.$store.getters["collateralVaultStore/mintLiquidityHelper"](this.selectedCollateral, resp[1]);
				}
			} catch (e) {
				const mintLiquidationMsg = "This will liquidate you";
				if (e.message.includes(mintLiquidationMsg)) {
					this.isSubmitDisabled = true;
					this.error = mintLiquidationMsg;
				}
			} finally {
				this.$set(this.estimatedAmount, 0, fromWei(resp[0]));
				this.$set(this.estimatedAmount, 1, fromWei(resp[1]));
				this.$set(this.estimatedAmount, 2, fromWei(resp[2]));
				if (this.action === "Mint") {
					this.$set(this.estimatedAmount, 3, parseFloat(fromWei(resp2[0], this.decimals)).toFixed(2));
				}
			}
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
				const amount = toWei(this.mintValue);
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
			this.spendValue = (this.mintValue * this.tokenPrices.NUON/ this.tokenPrices[this.selectedCollateral]).toFixed(2);

			this.getEstimatedAmounts();
		},
		beforeMount () {
			this.selectedCollateral = this.defaultCollateral;
		},
		handleChangeCollateral () {
			this.mintValue = (this.spendValue * this.tokenPrices[this.selectedCollateral] / this.tokenPrices.NUON).toFixed(2);
			this.getEstimatedAmounts();
		}
	},
};
</script>
