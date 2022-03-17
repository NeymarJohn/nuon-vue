<template>
	<div class="transaction-input">
		<TheStepper :active-step="activeStep" :steps="['Input', 'Confirm']">
			<template #step-one>
				<LayoutFlex
					direction="row-center-space-between"
					class="u-mb-xxs l-m-flex--column">
					<h4>{{ title }}</h4>
					<p class="u-mb-0">{{ subtitle }}: {{ numberWithCommas(maximum.toFixed(2)) }}</p>
				</LayoutFlex>
				<div class="input">
					<div class="input__container">
						<input
							v-model="inputValue"
							placeholder="0.0"
							type="number"
							min="0"
							max="79"
							autocomplete="off"
							autocorrect="off"
							spellcheck="false"
							inputmode="decimal">
						<TheButton
							:disabled="isMaxInputDisabled(maximum)"
							size="sm"
							title="Click to input your max balance"
							@click="inputMaxBalance">Max</TheButton>
					</div>
				</div>
				<div class="transaction-input__price">
					<p>You are {{ actionPlural }} <span>{{ numberWithCommas(parseFloat(inputValue || 0).toFixed(2)) }} HX</span> worth <span>${{ numberWithCommas(getDollarValue(inputValue, price.hx).toFixed(2)) }}</span></p>
					<p v-if="isMoreThanBalance" class="u-is-warning">Insufficient balance.</p>
					<p v-if="!isDisabled()" class="u-is-success">Ready to {{ action }}</p>
				</div>
				<div class="transaction-input__buttons">
					<TheButton
						size="lg"
						:disabled="!!isApproved"
						:class="isApproved"
						title="Click to approve"
						@click="approveToken">
						<span v-if="isApproved">Approved</span>
						<span v-else>Approve</span>
					</TheButton>
					<TheButton
						size="lg"
						:disabled="isDisabled()"
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
						:disabled="isDisabled()"
						title="Click to confirm"
						@click="submitTransaction">Confirm</TheButton>
				</div>
			</template>
		</TheStepper>
	</div>
</template>

<script>
import debounce from "lodash.debounce";
import { HX } from "~/constants/tokens";
import { fromWei, toWei } from "~/utils/bnTools";

export default {
	name: "InputTransaction",
	props: {
		title: {
			type: String,
			required: true
		},
		subtitle: {
			type: String,
			required: true
		},
		action: {
			type: String,
			required: true
		},
		actionPlural: {
			type: String,
			required: true
		},
		maximum: {
			type: Number,
			default: 0
		}
	},
	data () {
		return {
			inputValue: null,
			price: {
				hx: 0
			},
			account: "",
			estimatedOut: 0,
			activeStep: 1
		};
	},
	computed: {
		claimFee() {
			return this.$store.state.boardroomStore.claimFee;
		},
		isMoreThanBalance() {
			return parseFloat(this.inputValue) > this.hxBalance;
		},
		estimatedOutPrice() {
			return parseFloat(this.estimatedOut) * this.price.hx;
		},
		hxBalance() {
			return this.$store.getters["erc20Store/hxBalance"] || 0;
		},
	 	isApproved() {
			const isApprovedToken = this.$store.getters["boardroomStore/checkApprovedToken"](HX.symbol);
			return isApprovedToken ? "btn--success" : "";
		},
		myStake() {
			return parseFloat(fromWei(this.$store.state.boardroomStore.stakedBalance));
		},
		feeToken() {
			return this.inputValue * this.claimFee / 100;
		},
		summary() {
			return [
				{
					title: "Amount to Stake",
					val: this.numberWithCommas(this.inputValue),
					currency: "HX",
					dollar: this.numberWithCommas(this.getDollarValue(this.inputValue, this.price.hx).toFixed(2)),
				},
				{
					title: "Stake Fee",
					val: `-${this.numberWithCommas(this.feeToken.toFixed(2))}HX (${this.claimFee} %)`,
					dollar: this.numberWithCommas(this.getDollarValue(this.feeToken, this.price.hx).toFixed(2))
				},
				{
					title: "Total",
					val: this.numberWithCommas((parseFloat(this.inputValue) - this.feeToken).toFixed(2)) ,
					currency: "HX",
					dollar: this.numberWithCommas(this.getDollarValue(parseFloat(this.inputValue) - this.feeToken, this.price.hx).toFixed(2)),
				}
			];
		}
	},
	watch: {
		inputValue(newValue) {
			this.handleWatchInput(newValue);
		}
	},
	async mounted() {
		this.$store.watch((state) => {
			this.account = state.web3Store.account;
		});
		this.price.hx = parseFloat(await this.$store.getters["stabilityFlashStore/getHydroPriceInDAI"]);
		this.handleWatchInput = debounce(async (inputValue) => {
			try {
				this.estimatedOut = fromWei(await this.$store.getters["stabilityFlashStore/getEstimatedUSXOut"](toWei(inputValue || 0)));
			} catch(e) {
				this.estimatedOut = 0;
			}
		}, 300);
	},
	methods: {
		isDisabled () {
			if (this.inputValue <= 0 || this.isMoreThanBalance || !this.isApproved) return true;
		},
		submitTransaction() {
			if (this.account !== "") {
				this.activeStep = "loading";
				if (this.action === "stake") {
					this.$store.dispatch("boardroomStore/stake", {
						amount: this.inputValue,
						onConfirm: (txHash) => this.successToast(() => {this.activeStep = 1;}, null, txHash),
						onError: (e) => this.failureToast(() => {this.activeStep = 1;}, e),
						onComplete: () => {
							this.inputValue = "";
							this.$store.dispatch("boardroomStore/updateStatus");
						}
					});
				} else if (this.action === "withdraw") {
					this.$store.dispatch("boardroomStore/withdraw", {
						amount: this.inputValue,
						onConfirm: (txHash) => this.successToast(() => {this.activeStep = 1;}, null, txHash),
						onError: (e) => this.failureToast(() => {this.activeStep = 1;}, e),
						onComplete: () => {
							this.inputValue = "";
							this.$store.dispatch("boardroomStore/updateStatus");
						}
					});
				} else if (this.action === "claim") {
					this.$store.dispatch("boardroomStore/claimReward", {
						onConfirm: (txHash) => this.successToast(() => {this.activeStep = 1;}, null, txHash),
						onError: (e) => this.failureToast(() => {this.activeStep = 1;}, e),
						onComplete: () => {
							this.$store.dispatch("boardroomStore/updateStatus");
						}
					});
				}
			}
		},
		inputMaxBalance() {
			this.inputValue = this.hxBalance;
		},
		approveToken() {
			this.activeStep = "approving";
			this.$store.dispatch("boardroomStore/approveToken",
				{
					token: HX.symbol,
					onConfirm:  () => {
						this.activeStep = 1;
					},
					onReject: () => {
						this.activeStep = 1;
					},
					onCallback: () => {
					}
				});
		},

	}
};
</script>
