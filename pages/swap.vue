<template>
	<div>
		<LayoutContainer class="u-mb-48">
			<PageTitle>
				<h4>Swap</h4>
				<h1>Lorem ipsum dolor sit amet</h1>
			</PageTitle>
		</LayoutContainer>
		<LayoutContainer size="sm" class="u-pt-0">
			<div class="swap">
				<LayoutFlex direction="row-start-space-between" class="u-mb-48 u-mb-sm-24">
					<PageTitle class="u-mb-sm-0">
						<h2>Swap Tokens <TooltipIcon v-tooltip="'Enter swap tokens tooltip content here.'" /></h2>
						<p>Trade tokens in an instant</p>
					</PageTitle>
					<TheButton
						size="icon"
						title="Click to open swap settings"
						@click="setModalVisibility('settingsModal', true)">
						<SettingsIcon />
					</TheButton>
					<TheModal
						v-show="isSettingsModalVisible"
						title="Transaction Settings"
						@close-modal="setModalVisibility('settingsModal', false)">
						<label>Slippage Tolerance <TooltipIcon v-tooltip="'Enter slippage tolerance tooltip content here.'" /></label>
						<div class="input">
							<div class="input__container">
								<input
									id="slippage"
									v-model="maxSlippage"
									placeholder="0.0"
									type="number"
									min="0"
									max="79"
									autocomplete="off"
									autocorrect="off"
									spellcheck="false"
									inputmode="decimal"
									@change="calculateSlippage" />
							</div>
						</div>
					</TheModal>
				</LayoutFlex>
				<TheStepper :active-step="activeStep" :steps="['Token', 'Confirm']">
					<template #step-one>
						<LayoutFlex direction="row-center-space-between" class="u-mb-12 u-mt-24">
							<h5>Select Token To Swap</h5>
							<h5>Max Slippage {{ maxSlippage }}%</h5>
						</LayoutFlex>
						<div class="swap__container">
							<SwapBalance
								label="From"
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
									<p class="u-mb-0">~ ${{ getPriceInDAI(input.token, input.value) | toFixed | numberWithCommas }}</p>
								</LayoutFlex>
							</SwapAccordion>
						</div>
						<TheButton
							size="swap"
							:disabled="loadingPrice || !output.token"
							@click="reverseToken">
							<img :src="swapButtonHover" @mouseover="hover = true" @mouseleave="hover = false">
						</TheButton>
						<div class="swap__container u-mb-36">
							<SwapBalance
								label="To"
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
									<p class="u-mb-0">~ ${{ numberWithCommas(getPriceInDAI(output.token, output.value).toFixed(2))}}</p>
								</LayoutFlex>
							</SwapAccordion>
						</div>
						<div class="swap__output">
							<LayoutFlex  v-if="output.value && input.value" direction="row-center" class="u-mb-12">
								<h4 v-if="isInputRate">1 {{ output.token }} = {{ input.value / output.value | numberWithCommas }} {{ input.token }}</h4>
								<h4 v-else>1 {{ input.token }} = {{ output.value / input.value | numberWithCommas}} {{ output.token }}</h4>
								<TheButton
									size="icon"
									title="Click to convert rate"
									@click="convertRate"><RefreshIcon />
								</TheButton>
							</LayoutFlex>
							<LayoutFlex  direction="row-space-between" class="u-full-width" >
								<h4>Slippage Tolerance</h4> 
								<h4><b>{{maxSlippage}}</b>%</h4>
							</LayoutFlex>
							<LayoutFlex  v-if="output.value && input.value" direction="row-space-between" class="u-full-width u-mt-12">
								<h4>Price Impact</h4> 
								<h4><b>{{priceImpact | toFixed | numberWithCommas}}</b>%</h4>
							</LayoutFlex>
							<LayoutFlex  v-if="output.value && input.value" direction="row-space-between" class="u-full-width u-mt-12">
								<h4>Minimum received after slippage</h4> 
								<h4><b>{{calculateSlippage() | toFixed | numberWithCommas}}</b> {{output.token}}</h4>
							</LayoutFlex>
							<LayoutFlex  v-if="output.value && input.value" direction="row-space-between" class="u-full-width u-mt-12">
								<h4>{{input.token}} reserves</h4> 
								<h4><b>{{reserves[input.token] | toFixed | numberWithCommas}}</b> {{input.token}}</h4>
							</LayoutFlex>
							<LayoutFlex  v-if="output.value && input.value" direction="row-space-between" class="u-full-width u-mt-12">
								<h4>{{output.token}} reserves</h4> 
								<h4><b>{{reserves[output.token] | toFixed | numberWithCommas}}</b> {{output.token}}</h4>
							</LayoutFlex>
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
							<TheButton
								v-else-if="!isApproved(input.token)"
								size="lg"
								@click="approveToken(input.token)">
								<span>Approve {{input.token}} Token</span>
							</TheButton>
							<TheButton
								v-else-if="!isApproved(output.token)"
								size="lg"
								@click="approveToken(output.token)">
								<span>Approve {{output.token}} Token</span>
							</TheButton>
							<TheButton
								v-if="isConnectedWallet"
								size="lg"
								title="Click to go next"
								:disabled="disabledSwap"
								@click="activeStep = 2">Next</TheButton>
						</div>
					</template>
					<template #step-two>
						<TransactionSummarySwap :values="summary" :input="input" :output="output"/>
						<p class="u-color-light-grey u-pb-32">Minimum received is estimated. You will receive at least <strong>{{ calculateSlippage() | formatPrice }} {{ output.token }}</strong> or the transaction will revert.</p>
						<div class="transaction-input__buttons">
							<TheButton
								size="lg"
								title="Click to go back"
								@click="activeStep = 1">Back</TheButton>
							<TheButton
								size="lg"
								title="Click to confirm"
								:disabled="disabledSwap"
								@click="swap">Confirm</TheButton>
						</div>
					</template>
				</TheStepper>
			</div>
		</LayoutContainer>
	</div>
</template>

<script>
import { fromWei } from "~/utils/bnTools";
import RefreshIcon from "@/assets/images/svg/svg-refresh.svg";
import SettingsIcon from "@/assets/images/svg/svg-settings.svg";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "TheSwap",
	components: {
		RefreshIcon,
		SettingsIcon,
		TooltipIcon
	},
	data() {
		return {
			arrowDown: require("~/assets/images/png/png-arrow-down.png"),
			arrowDownDisabled: require("~/assets/images/png/png-arrow-down-disabled.png"),
			arrowCollapse: require("~/assets/images/png/png-arrow-collapse.png"),
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
			activeStep: 1,
			isInputRate: true,
			reserves: {}
		};
	},
	head () {
		return {
			title: "Swap | Nuon"
		};
	},
	computed: {
		swapButtonHover() {
			if (this.hover === true && this.loadingPrice || !this.output.token) {
				return this.arrowDownDisabled;
			} else if (this.hover === true ) {
				return this.arrowCollapse;
			} else {
				return this.arrowDown;
			}
		},
		tokens() {
			return this.$store.state.addressStore.tokens;
		},
		disabledSwap() {
			if (this.loadingPrice || !this.input.value || !this.output.value || !this.output.token || this.maxSlippage > 10) return true;
			return false;
		},
		isSettingsModalVisible() {
			return this.$store.state.modalStore.modalVisible.settingsModal;
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
			return this.input.value > this.tokenBalances[this.input.token];
		}
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
		getPriceInDAI(token, value) {
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
			this.$store.dispatch("swapStore/getReserves", [this.input.token, this.output.token]).then((reserves) => {
				this.reserves = reserves;
				const oldPrice = parseFloat(reserves[this.input.token]) / parseFloat(reserves[this.output.token]);
				const newPrice = parseFloat(reserves[this.input.token] - this.input.value) / parseFloat(reserves[this.output.token] + this.output.value);
				this.priceImpact = (oldPrice - newPrice) / oldPrice * 100;
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
			if (this.changedValue === "input") {
				return this.$store.getters["swapStore/getMinOutputWithSlippage"]({
					value: this.output.value,
					slippage: this.maxSlippage,
					formatted: true
				});
			} else {
				return this.$store.getters["swapStore/getMaxInputWithSlippage"]({
					value: this.input.value,
					slippage: this.maxSlippage,
					formatted: true
				});
			}
		},
		inputMaxBalance() {
			this.input.value = this.tokenBalances[this.input.token];
			this.getMaxOutput();
		},
		showSettingsModal() {
			this.isSettingsModalVisible = true;
			document.body.classList.add("is-active");
		},
		closeSettingsModal() {
			this.isSettingsModalVisible = false;
			document.body.classList.remove("is-active");
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
					onConfirm:  () =>{
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
		convertRate() {
			this.isInputRate = !this.isInputRate;
		}
	}
};
</script>
