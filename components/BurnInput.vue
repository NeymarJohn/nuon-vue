<template>
	<div class="transaction-input">
		<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
			<template #step-one>
				<LayoutFlex direction="row-center-space-between" class="l-m-flex--column">
					<h4>Enter amount to burn</h4>
					<p>Available {{ tokenBurn }} tokens: {{ tokenBalance }}</p>
				</LayoutFlex>
				<div class="input">
					<div class="input__container">
						<input
							v-model="burningValue"
							placeholder="0.0"
							type="number"
							min="0"
							max="79"
							autocomplete="off"
							autocorrect="off"
							spellcheck="false"
							inputmode="decimal"
						>
						<TheButton :disabled="isMaxInputDisabled(getBalance)" size="sm" title="Click to input your max balance" @click="inputMaxBalance">Max</TheButton>
					</div>
				</div>
				<div class="transaction-input__price">
					<p>You will get <span>{{ numberWithCommas(estimatedOut.toFixed(2)) }} {{ tokenReceive }}</span> worth <span>${{ numberWithCommas(estimatedOutPrice.toFixed(2)) }}</span></p>
					<p v-if="allowance[tokenBurn] <= 0" class="u-is-success">Please click approve to burn {{ tokenBurn }}.</p>
					<p v-if="tokenBurn === 'USX'">Vested until peg is restored earning 236% APY</p>
					<p v-if="isMoreThanBalance" class="u-is-warning">Insufficient balance.</p>
					<p v-else-if="isFailing" class="u-is-warning">Your transaction will fail, please change burn amount.</p>
					<p v-else-if="!isBurnDisabled()" class="u-is-success">Ready to burn</p>
				</div>
				<div class="transaction-input__buttons">
					<TheButton
						size="lg"
						:disabled="!!isApproved"
						:class="isApproved"
						title="Click to approve"
						@click="approveTokens">
						<span v-if="!isApproved">Approve</span>
						<span v-else>Approved</span>
					</TheButton>
					<TheButton
						size="lg"
						:disabled="isFailing || isBurnDisabled()"
						title="Click to go next"
						@click="activeStep = 2">
						Next
					</TheButton>
				</div>
			</template>
			<template #step-two>
				<TransactionSummary :values="summary" />
				<div class="transaction-input__buttons">
					<TheButton
						size="lg"
						title="Click to go back"
						@click="activeStep = 1">Back</TheButton>
					<TheButton
						size="lg"
						:disabled="isBurnDisabled()"
						title="Click to confirm"
						@click="burnTokens">Confirm</TheButton>
				</div>
			</template>
		</TheStepper>
	</div>
</template>

<script>
import debounce from "lodash.debounce";
import { fromWei, toWei } from "~/utils/bnTools";
export default {
	name: "BurnInput",
	props: {
		tokenBurn: {
			type: String,
			required: true
		},
		tokenReceive: {
			type: String,
			required: true
		},
		tokenBalance: {
			type: String,
			required: true
		},
	},
	data () {
		return {
			burningValue: null,
			price: {
				usx: 0,
				hx: 0
			},
			account: "",
			usxPriceBurned: 0,
			tolerance: {
				high: 0,
				low: 0
			},
			pegStatus: false,
			estimatedOut: 0,
			activeStep: 1
		};
	},
	computed: {
		allowance() {
			return this.$store.state.stabilityFlashStore.allowance;
		},
		balance() {
			return this.$store.getters["erc20Store/tokenBalance"];
		},
		getBalance() {
			return this.balance[this.tokenBurn] || 0;
		},
		isFailing() {
			return this.tokenBurn === "HX" && this.pegStatus;
		},
		isMoreThanBalance() {
			return parseFloat(this.burningValue) > this.getBalance;
		},
		isApproved() {
			return this.allowance[this.tokenBurn] > 0 ? "btn--success" : "";
		},
		estimatedOutPrice() {
			if (this.tokenBurn === "HX") return parseFloat(this.estimatedOut) * this.price.usx;
			else return parseFloat(this.estimatedOut) * this.price.hx;
		},
		mintingFee() {
			return this.$store.state.stabilityFlashStore.mintingFee;
		},
		summary() {
			return [
				{
					title: "Amount to Burn",
					val: this.numberWithCommas(this.burningValue),
					currency: this.tokenBurn,
					dollar: this.numberWithCommas(this.estimatedOutPrice.toFixed(2))
				},
				{
					title: "Fee",
					val: `${this.mintingFee}%`,
					dollar: this.numberWithCommas((this.estimatedOutPrice * this.mintingFee / 100).toFixed(2))
				},
				{
					title: "Total Received",
					val: this.numberWithCommas((this.estimatedOut - this.estimatedOut  * this.mintingFee / 100).toFixed(2)),
					currency: this.tokenReceive,
					dollar: this.numberWithCommas((this.estimatedOutPrice  - this.estimatedOutPrice * this.mintingFee / 100).toFixed(2))
				}
			];
		},
	},
	watch: {
		burningValue(newValue) {
			this.updatePrices(newValue);
		}
	},
	async mounted() {
		this.$store.watch((state) => {
			this.account = state.web3Store.account;
		});
		this.tolerance.high = await this.$store.getters["stabilityFlashStore/getToleranceHigh"];
		this.tolerance.low = await this.$store.getters["stabilityFlashStore/getToleranceLow"];
		this.price.usx = parseFloat(await this.$store.getters["stabilityFlashStore/getUSXPriceInDAI"]);
		this.price.hx = parseFloat(await this.$store.getters["stabilityFlashStore/getHYDROPriceInDAI"]);
		this.updatePrices = debounce(async function(burningInput){
			try {
				if (burningInput) {
					try {
						this.usxPriceBurned = await this.$store.dispatch("stabilityFlashStore/getReservesInUSD", burningInput);
					} catch(e) {
						this.usxPriceBurned = 0;
					}
					if (this.tokenBurn === "HX" ) {
						this.pegStatus = await this.$store.getters["stabilityFlashStore/getPegStatus"](toWei(burningInput));
						this.estimatedOut = parseFloat(fromWei(await this.$store.getters["stabilityFlashStore/getEstimatedUSXOut"](toWei(burningInput))));
					} else {
						this.pegStatus = false;
						this.estimatedOut = parseFloat(fromWei(await this.$store.getters["stabilityFlashStore/getEstimatedHYDROOut"](toWei(burningInput))));
					}
				} else {
					this.usxPriceBurned = 0;
					this.pegStatus = false;
					this.estimatedOut = 0;
				}
			} catch(e) {
				this.usxPriceBurned = 0;
				this.pegStatus = false;
				this.estimatedOut = 0;
			}
		},300);
	},
	methods: {
		isBurnDisabled () {
			if (this.burningValue <= 0 || this.isMoreThanBalance || !this.isApproved) return true;
			if (this.tokenBurn === "HX" &&  this.usxPriceBurned > 0 && this.usxPriceBurned < this.tolerance.high) return true;
			return false;
		},
		async burnTokens() {
			this.activeStep = "loading";
			if (this.tokenBurn === "HX" && this.account !== "") {
				await this.$store.dispatch("stabilityFlashStore/burnHydro", {
					address: this.account,
					amount: this.burningValue,
					onConfirm: (txHash) => this.successToast(() => {this.activeStep = 1;}, null, txHash),
					onError: (e) => this.failureToast(() => {this.activeStep = 1;}, e),
					onComplete: () => {}
				});
			}
			if (this.tokenBurn === "USX" && this.account !== "") {
				await this.$store.dispatch("stabilityFlashStore/burnUsx", {
					address: this.account,
					amount: this.burningValue,
					onConfirm: (txHash) => this.successToast(() => {this.activeStep = 1;}, null, txHash),
					onError: (e) => this.failureToast(() => {this.activeStep = 1;}, e),
					onComplete: () => {}
				});
			}
		},
		approveTokens() {
			this.activeStep = "approving";
			this.$store.dispatch("stabilityFlashStore/approveToken", {
				tokenName:this.tokenBurn,
				onConfirm: () => {
					this.activeStep = 1;
				},
				onReject: (err) => {
					this.failureToast(() => {this.activeStep = 1;}, err);
				},
				onCallback: () => {
				}
			});
		},
		inputMaxBalance() {
			this.burningValue = parseFloat(this.tokenBalance.replace(/,/g, ""));
		},
	}
};
</script>
