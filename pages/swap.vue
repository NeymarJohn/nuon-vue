<template>
	<div>
		<LayoutContainer>
			<LayoutFlex direction="row-center-space-between" class="u-mb-48 u-pb-32 u-bb-medium-light-grey">
				<PageTitle>
					<h4>Swap</h4>
					<h1>Token Exchange</h1>
				</PageTitle>
				<PriceIndicator :nuon-price="tokenPrices.NUON" :truflation-peg="truflationPeg" />
			</LayoutFlex>
		</LayoutContainer>
		<LayoutContainer size="sm" class="u-pt-0">
			<div class="swap">
				<div class="swap__container">
					<SwapBalance
						label="Spend"
						:token="input.token" />
					<SwapAccordion
						:disabled-tokens="[output.token]"
						:default-token="input.token"
						@selected-token="selectInputToken">
						<div class="input u-mb-12">
							<div class="input__container">
								<input
									v-model="input.value"
									placeholder="0.0"
									type="number"
									min="0"
									max="79"
									autocomplete="off"
									autocorrect="off"
									spellcheck="false"
									inputmode="decimal"
									@keyup="onInputKeyUp('input')" />
								<TheButton
									size="sm"
									title="Click to input your max balance"
									@click="inputMaxBalance">Max</TheButton>
							</div>
						</div>
						<LayoutFlex direction="row-justify-end">
							<p class="u-mb-0">~ ${{ getPrice(input.token, input.value) | toFixed | numberWithCommas }}</p>
						</LayoutFlex>
					</SwapAccordion>
				</div>
				<TheButton
					size="swap"
					:disabled="loadingPrice || !output.token"
					@click="reverseToken">
					<SwapIcon />
				</TheButton>
				<div class="swap__container u-mb-36">
					<SwapBalance
						label="Receive"
						:token="output.token" />
					<SwapAccordion
						:disabled-tokens="[input.token]"
						:default-token="output.token"
						@selected-token="selectOutputToken">
						<div class="input u-mb-12">
							<div class="input__container">
								<input
									v-model="output.value"
									placeholder="0.0"
									type="number"
									min="0"
									max="79"
									autocomplete="off"
									autocorrect="off"
									spellcheck="false"
									inputmode="decimal"
									@keyup="onInputKeyUp('output')" />
							</div>
						</div>
						<LayoutFlex direction="row-justify-end">
							<p class="u-mb-0">~ ${{ numberWithCommas(getPrice(output.token, output.value).toFixed(2))}}</p>
						</LayoutFlex>
					</SwapAccordion>
				</div>
				<div class="swap__output">
					<LayoutFlex direction="row-space-between">
						<h4>Slippage Tolerance</h4>
						<h4><strong>{{maxSlippage}}%</strong></h4>
					</LayoutFlex>
					<template  v-if="output.value && input.value">
						<LayoutFlex direction="row-space-between" class="u-mt-12">
							<h4>Price Impact</h4>
							<ComponentLoader component="h4" :loaded="!isLoadingPriceImpact">
								<h4><strong>{{priceImpact | toFixed | numberWithCommas}}%</strong></h4>
							</ComponentLoader>
						</LayoutFlex>
						<LayoutFlex direction="row-space-between" class="u-mt-12">
							<h4>Minimum received after slippage</h4>
							<ComponentLoader component="h4" :loaded="!isLoadingPriceImpact">
								<h4><strong>{{calculateSlippage() | toFixed | numberWithCommas}} {{output.token}}</strong></h4>
							</ComponentLoader>
						</LayoutFlex>
						<LayoutFlex direction="row-space-between" class="u-mt-12">
							<h4>{{input.token}} reserves</h4>
							<ComponentLoader component="h4" :loaded="!isLoadingPriceImpact">
								<h4><strong>{{reserves[input.token] | toFixed | numberWithCommas}} {{input.token}}</strong></h4>
							</ComponentLoader>
						</LayoutFlex>
						<LayoutFlex direction="row-space-between" class="u-mt-12">
							<h4>{{output.token}} reserves</h4>
							<ComponentLoader component="h4" :loaded="!isLoadingPriceImpact">
								<h4><strong>{{reserves[output.token] | toFixed | numberWithCommas}} {{output.token}}</strong></h4>
							</ComponentLoader>
						</LayoutFlex>
					</template>
				</div>
				<div class="transaction-input__buttons">
					<TheButton
						v-if="!isConnectedWallet"
						size="lg"
						title="Click to connect wallet"
						@click="connectWallet">Connect Wallet</TheButton>
					<TheButton
						v-else-if="isMoreThanBalance"
						size="lg"
						disabled>Insufficient Balance</TheButton>
				</div>
				<!-- <TransactionSummarySwap :values="summary" :input="input" :output="output"/> -->
				<p class="u-color-light-grey u-pb-32">Minimum received is estimated. You will receive at least <strong>{{ calculateSlippage() | formatPrice }} {{ output.token }}</strong> or the transaction will revert.</p>
				<div class="transaction-input__buttons">
					<TheButton
						size="lg"
						title="Click to confirm"
						:disabled="disabledSwap"
						@click="swap">Confirm</TheButton>
				</div>
			</div>
		</LayoutContainer>
	</div>
</template>

<script>
import SwapIcon from "@/assets/images/svg/svg-swap.svg";
import { fromWei } from "~/utils/bnTools";

export default {
	name: "TheSwap",
	components: {
		SwapIcon,
	},
	data() {
		return {
			hover: false,
			input: {
				value: "",
				token: "nuMINT"
			},
			output: {
				value: "",
				token: ""
			},
			truflationPeg: 0,
			priceImpact: 0,
			isActive: false,
			loadingPrice: false,
			loadedPrice: false,
			changedValue: "input",
			maxSlippage: 0.5,
			activeStep: 1,
			isInputRate: true,
			reserves: {},
			isLoadingPriceImpact: false
		};
	},
	head () {
		return {
			title: "Swap | NUON"
		};
	},
	computed: {
		tokens() {
			return this.$store.state.addressStore.tokens;
		},
		disabledSwap() {
			if (this.loadingPrice || !this.input.value || !this.output.value || !this.output.token || this.maxSlippage > 10) return true;
			return false;
		},
		summary() {
			return [
				{
					title: "Price Impact",
					val: `${this.priceImpact}%`,
				},
				{
					title: "Fee",
					val: this.swapFee,
					dollar: this.getDollarValue(this.swapFeePrice, 1)
				},
				{
					title: `Minimum received after slippage (${this.maxSlippage}%)`,
					val: this.formatPrice(this.calculateSlippage()),
					currency: this.output.token,
				}
			];
		},
		swapPrice() {
			return this.input.value / this.output.value;
		},
		swapFee() {
			return this.$store.state.swapStore.swapFee;
		},
		swapFeePrice() {
			return this.output.value * this.swapFee / 100;
		},
		isMoreThanBalance() {
			return parseFloat(this.input.value) > parseFloat(this.tokenBalances[this.input.token]);
		}
	},
	mounted () {
		this.getTruflationPeg();
		const routeQuery = this.$route.query;
		if (routeQuery.inputToken) this.input.token = routeQuery.inputToken;
		if (routeQuery.outputToken) this.output.token = routeQuery.outputToken;
	},
	methods: {
		initialize() {
			this.loadedPrice = false;
			this.input.value = "";
			this.output.value = "";
		},
		getPrice(token, value) {
			return this.getDollarValue(this.tokenPrices[token], value) || 0;
		},
		selectInputToken(token) {
			this.input.token = token.symbol;
			this.calculate();
		},
		selectOutputToken(token) {
			this.output.token = token.symbol;
			this.calculate();
		},
		calculate() {
			if (this.changedValue === "input") {
				this.getMaxOutput();
			} else {
				this.getMinInput();
			}
			this.calcuatePriceImpact();
		},
		onInputKeyUp(changedValue) {
			this.changedValue = changedValue;
			this.calculate();
		},
		getMaxOutput() {
			this.loadingPrice = true;
			this.loadedPrice = false;
			this.$store.dispatch(
				"swapStore/getAmountsOut",
				{
					inputToken: this.input.token,
					outputToken: this.output.token,
					amount: this.input.value
				}
			).then(res => {
				this.loadingPrice = false;
				this.loadedPrice = true;
				this.output.value = fromWei(res[this.output.token], this.$store.state.erc20Store.decimals[this.output.token]);
			}).catch(() => {
				this.loadedPrice = false;
				this.loadingPrice = false;
				this.output.value = 0;
			});
		},
		getMinInput() {
			if (!this.output.value || !this.output.token) return;
			this.loadingPrice = true;
			this.loadedPrice = false;
			this.$store.dispatch(
				"swapStore/getAmountsIn",
				{
					inputToken: this.input.token,
					outputToken: this.output.token,
					amount: this.output.value
				}
			).then(res => {
				this.loadingPrice = false;
				this.loadedPrice = true;
				this.input.value = fromWei(res[this.input.token], this.$store.state.erc20Store.decimals[this.input.token]);
			}).catch(() => {
				this.loadingPrice = false;
				this.loadedPrice = false;
				this.input.value = 0;
			});
		},
		swapForInput() {
			this.$store.dispatch(
				"swapStore/swapExactTokensForTokens",
				{
					inputToken: this.input.token,
					outputToken: this.output.token,
					inputAmount: this.input.value,
					outputAmount: this.output.value,
					slippage: this.maxSlippage,
					callback: () => {
						this.initialize();
					}
				}
			)
				.then(() => {
					this.initialize();
				})
				.catch(() => {})
				.finally(() => {this.activeStep = 1;});
		},
		swapForOutput() {
			this.$store.dispatch(
				"swapStore/swapTokensForExactTokens",
				{
					inputToken: this.input.token,
					outputToken: this.output.token,
					inputAmount: this.input.value,
					outputAmount: this.output.value,
					slippage: this.maxSlippage,
					callback: () => {
						this.initialize();
					}
				}
			).then(() => {
				this.initialize();
			}).catch(() => {})
				.finally(() => {this.activeStep = 1;});
		},
		calcuatePriceImpact() {
			if (!this.input.token || !this.output.token) return;
			this.isLoadingPriceImpact = true;
			this.$store.dispatch("swapStore/getReserves", [this.input.token, this.output.token]).then((reserves) => {
				this.reserves = reserves;
				const inputTokenReserve = parseFloat(reserves[this.input.token]);
				const outputTokenReserve = parseFloat(reserves[this.output.token]);
				const oldPrice = inputTokenReserve / outputTokenReserve;
				const newPrice = (inputTokenReserve - this.input.value) / (outputTokenReserve + parseFloat(this.output.value));
				this.priceImpact = (oldPrice - newPrice) / oldPrice * 100;
				this.isLoadingPriceImpact = false;
			});
		},
		connectWallet() {
			this.$store.commit("modalStore/setModalVisibility", {name: "connectWalletModal", visibility: true});
		},
		swap() {
			this.activeStep = "loading";
			if (this.changedValue === "input") {
				this.swapForInput();
			} else {
				this.swapForOutput();
			}
		},
		reverseToken() {
			const temp = this.input;
			this.input = this.output;
			this.output = temp;
			this.changedValue = this.changedValue === "input" ? "output" : "input";
			this.calculate();
		},
		calculateSlippage() {
			return this.$store.getters["swapStore/getMinOutputWithSlippage"]({
				value: this.output.value,
				slippage: this.maxSlippage,
				formatted: true
			});
		},
		inputMaxBalance() {
			this.input.value = this.tokenBalances[this.input.token];
			this.getMaxOutput();
		},
		triggerAccordion() {
			this.isActive = !this.isActive;
		},
		isApproved(tokenName) {
			if (!tokenName) return true;
			const allowance = this.$store.state.swapStore.allowance;
			return allowance[tokenName] > 0;
		},
		approveToken(tokenName) {
			this.activeStep = "approving";
			this.$store.dispatch("swapStore/approveToken",
				{
					tokenName,
					onConfirm: () =>{
						this.activeStep = 1;
					},
					onReject: () => {
						this.activeStep = 1;
					},
					onCallback: () => {
					}
				});
		},
		refreshPrice() {
			this.calculate();
		},
	}
};
</script>
