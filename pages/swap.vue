<template>
	<div>
		<LayoutContainer>
			<LayoutHeader>
				<PageTitle>
					<h1>Swap</h1>
				</PageTitle>
				<PriceIndicator />
			</LayoutHeader>
		</LayoutContainer>
		<LayoutContainer size="sm" class="u-pt-0">
			<div class="swap">
				<div class="swap__container">
					<SwapBalance
						label="Spend"
						:token="input.token"
						:balance="tokenBalances[input.token]" />
					<SwapAccordion
						:disabled-tokens="[output.token]"
						:default-token="input.token"
						@selected-token="selectInputToken">
						<template #input>
							<InputMax v-model="input.value" :maximum="tokenBalances[input.token]" @input="onInputKeyUp('input')"/>
						</template>
						<template #messages>
							<LayoutFlex direction="row-center-space-between">
								<div>
									<p v-if="isMoreThanEqualMinimumAndLessThanBalance" class="u-font-size-14 u-is-success u-mb-0">Ready To Swap</p>
									<p v-if="isMoreThanBalance" class="u-font-size-14 u-is-warning u-mb-0">Insufficient Balance</p>
								</div>
								<p class="u-mb-0 u-font-size-14 u-color-light-grey">~ ${{ getPrice(input.token, input.value) | toFixed | numberWithCommas }}</p>
							</LayoutFlex>
						</template>
					</SwapAccordion>
				</div>
				<TheButton
					size="swap"
					:disabled="loadingPrice || !output.token"
					@click="reverseToken">
					<SwapIcon />
				</TheButton>
				<div class="swap__container u-mb-24">
					<div class="swap__balance">
						<label>Receive</label>
					</div>
					<SwapAccordion
						:disabled-tokens="[input.token]"
						:default-token="output.token"
						@selected-token="selectOutputToken">
						<template #input>
							<div class="input">
								<div class="input__container">
									<input
										v-model="output.value"
										placeholder="0.00"
										type="number"
										min="0"
										autocomplete="off"
										autocorrect="off"
										spellcheck="false"
										inputmode="decimal"
										@keyup="onInputKeyUp('output')" />
								</div>
							</div>
						</template>
						<template #messages>
							<LayoutFlex direction="row-justify-end">
								<p class="u-mb-0 u-font-size-14 u-color-light-grey">~ ${{ numberWithCommas(getPrice(output.token, output.value).toFixed(2))}}</p>
							</LayoutFlex>
						</template>
					</SwapAccordion>
				</div>
				<div class="swap__slippage u-mb-24">
					<label>Slippage Tolerance<TooltipIcon v-tooltip="'Slippage tolerance tooltip.'" /></label>
					<div class="input">
						<div class="input__container">
							<input
								v-model="maxSlippage"
								placeholder="0"
								type="number"
								min="0"
								autocomplete="off"
								autocorrect="off"
								spellcheck="false"
								inputmode="decimal"
								@change="calculateSlippage" />
							<span>%</span>
						</div>
					</div>
				</div>
				<div v-if="output.value && input.value" class="swap__output u-mb-24">
					<label class="u-mb-16">Transaction Summary</label>
					<div class="swap__container">
						<LayoutFlex direction="row-space-between u-mb-20">
							<label>Price impact</label>
							<ComponentLoader component="h4" :loaded="!isLoadingPriceImpact">
								<label><strong>{{priceImpact | toFixed | numberWithCommas}}%</strong></label>
							</ComponentLoader>
						</LayoutFlex>
						<LayoutFlex direction="row-space-between u-mb-20">
							<label>Minimum received after slippage</label>
							<ComponentLoader component="h4" :loaded="!isLoadingPriceImpact">
								<label><strong>{{calculateSlippage() | toFixed | numberWithCommas}} {{output.token}}</strong></label>
							</ComponentLoader>
						</LayoutFlex>
						<LayoutFlex direction="row-space-between u-mb-20">
							<label>{{input.token}} reserves</label>
							<ComponentLoader component="h4" :loaded="!isLoadingPriceImpact">
								<label><strong>{{reserves[input.token] | toFixed | numberWithCommas}} {{input.token}}</strong></label>
							</ComponentLoader>
						</LayoutFlex>
						<LayoutFlex direction="row-space-between">
							<label>{{output.token}} reserves</label>
							<ComponentLoader component="h4" :loaded="!isLoadingPriceImpact">
								<label><strong>{{reserves[output.token] | toFixed | numberWithCommas}} {{output.token}}</strong></label>
							</ComponentLoader>
						</LayoutFlex>
					</div>
				</div>
				<TheButton
					v-if="!isConnectedWallet"
					size="lg"
					title="Click to connect wallet"
					@click="connectWallet">Connect Wallet</TheButton>
				<TheButton
					v-else
					size="lg"
					title="Click to swap"
					:disabled="isSwapDisabled"
					:loading="swapping"
					@click="approveAndSwap">Swap</TheButton>
			</div>
		</LayoutContainer>
	</div>
</template>

<script>
import SwapIcon from "@/assets/images/svg/svg-swap.svg";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";
import { fromWei, toFixedAfterZero } from "~/utils/bnTools";

export default {
	name: "TheSwap",
	components: {
		SwapIcon,
		TooltipIcon,
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
			priceImpact: 0,
			isActive: false,
			loadingPrice: false,
			loadedPrice: false,
			changedValue: "input",
			maxSlippage: 0.5,
			isInputRate: true,
			reserves: {},
			isLoadingPriceImpact: false,
			swapping: false
		};
	},
	head () {
		return {
			title: "Swap | NUON",
			meta: [
				{ hid: "swap", name: "description", content: "Swap your inflation-shielded Nuon flatcoins and nuMINT governance tokens for other crypto assets on the Nuon Protocol." },
				{ hid: "og-type", property: "og:type", content: "website" },
				{ hid: "og-title", property: "og:title", content: "Swap | NUON" },
				{ hid: "og-desc", property: "og:description", content: "Swap your inflation-shielded Nuon flatcoins and nuMINT governance tokens for other crypto assets on the Nuon Protocol." },
				{ hid: "og-image", property: "og:image", content: "https://nuon.fi/assets/img/opengraph-default.jpg" },
				{ hid: "og-url", property: "og:url", content: "https://app.nuon.fi/swap" },
				{ hid: "twitter", property: "twitter:card", content: "summary_large_image" },
			]
		};
	},
	computed: {
		tokens() {
			return this.$store.state.addressStore.tokens;
		},
		isSwapDisabled() {
			if (this.loadingPrice || !this.input.value || !this.output.value || !this.output.token || this.maxSlippage > 10 || this.isMoreThanBalance) return true;
			return false;
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
		},
		isMoreThanEqualMinimumAndLessThanBalance() {
			return parseFloat(this.input.value) > 0 && parseFloat(this.input.value) <= parseFloat(this.tokenBalances[this.input.token]);
		},
	},
	mounted () {
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
			this.input.value = "";
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
				const estimatedOutPutValue = Number(fromWei(res[this.output.token], this.$store.state.erc20Store.decimals[this.output.token]));
				this.output.value = toFixedAfterZero(estimatedOutPutValue) ;
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
				const estimatedInputValue = Number(fromWei(res[this.input.token], this.$store.state.erc20Store.decimals[this.input.token]));
				this.input.value = toFixedAfterZero(estimatedInputValue);
			}).catch(() => {
				this.loadingPrice = false;
				this.loadedPrice = false;
				this.input.value = 0;
			});
		},
		swapForInput() {
			this.swapping = true;
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
				.then((receipt) => {
					this.successToast(null, "You successfully swapped", receipt.transactionHash);
					this.$store.dispatch("erc20Store/getBalance", this.input.token);
					this.$store.dispatch("erc20Store/getBalance", this.output.token);
					this.initialize();
				})
				.catch((e) => {
					this.failureToast(null, e, "Transaction Failed");
				})
				.finally(() => {
					this.swapping = false;
				});
		},
		swapForOutput() {
			this.swapping = true;
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
			).then((receipt) => {
				this.initialize();
				this.successToast(null, "You successfully swapped", receipt.transactionHash);
				this.$store.dispatch("erc20Store/getBalance", this.input.token);
				this.$store.dispatch("erc20Store/getBalance", this.output.token);
			}).catch(() => {})
				.finally(() => {
					this.swapping = false;
				});
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
		approveAndSwap() {
			if (!this.isApproved(this.input.token)) {
				this.$store.dispatch("swapStore/approveToken",
					{
						tokenName: this.input.token,
						onConfirm: () =>{
						},
						onReject: () => {
						},
						onCallback: () => {
							this.swap();
						}
					});
			} else {
				this.swap();
			}
		},
		swap() {
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
		refreshPrice() {
			this.calculate();
		},
	}
};
</script>
