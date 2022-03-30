<template>
	<div>
		<LayoutContainer>
			<PageTitle>
				<h4>Swap</h4>
				<h1>Trade tokens in an instant</h1>
			</PageTitle>
			<div class="swap">
				<LayoutFlex direction="row-center-space-between" class="u-mb-md">
					<TheButton
						size="icon"
						title="Click to open settings"
						@click="setModalVisibility('settingsModal', true)">
						<SettingsIcon />
					</TheButton>
					<TheModal
						v-show="isSettingsModalVisible"
						title="Transaction Settings"
						@close-modal="setModalVisibility('settingsModal', false)">
						<label>
							Slippage Tolerance
							<TooltipIcon v-tooltip="'Enter slippage tolerance tooltip content here.'" />
						</label>
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
						<LayoutFlex direction="row-center-space-between" class="u-mb-xxs">
							<h4>Select Token To Swap</h4>
							<h4>Max Slippage {{ maxSlippage }}%</h4>
						</LayoutFlex>
						<div class="swap__container">
							<SwapBalance
								label="From"
								:token="input.token" />
							<SwapAccordion
								:disabled-tokens="[output.token]"
								:default-token="input.token"
								@selected-token="selectInputToken">
								<div class="input u-mb-xs">
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
									<p class="u-mb-0">~ ${{ getPriceInDAI(input.token, input.value) | formatPrice}}</p>
								</LayoutFlex>
							</SwapAccordion>
						</div>
						<TheButton
							class="btn--circle"
							:disabled="loadingPrice || !output.token"
							@click="reverseToken"><SwapIcon /></TheButton>
						<div class="swap__container u-mb-md">
							<SwapBalance
								label="To"
								:token="output.token" />
							<SwapAccordion
								:disabled-tokens="[input.token]"
								:default-token="output.token"
								@selected-token="selectOutputToken">
								<div class="input u-mb-xs">
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
						<div v-if="output.value && input.value">
							<div class="swap__output">
								<LayoutFlex direction="row-center">
									<h4 class="u-mr-xxxs">1 {{ output.token }} = {{ input.value / output.value }} {{ input.token }}</h4>
									<TheButton
										size="icon"
										title="Click to refresh price"
										@click="refreshPrice"><RefreshIcon /></TheButton>
								</LayoutFlex>
								<div class="gas">
									<GasIcon />
									<p>~ ${{ swapFee.toFixed(2) }}</p>
								</div>
							</div>
						</div>
						<div class="transaction-input__buttons">
							<TheButton
								v-if="!isConnectedWallet"
								size="lg"
								title="Click to connect wallet"
								@click="connectWallet">Connect Wallet</TheButton>
							<TheButton
								v-else-if="input.token === 'HX' && input.value > hxBalance || input.token === 'USX' && input.value > usxBalance || input.token === 'ETH' && input.balance > ethBalance"
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
						<p class="u-mb-md">Minimum received is estimated. You will receive at least <strong>{{ calculateSlippage() | formatPrice }} {{ output.token }}</strong> or the transaction will revert.</p>
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
import { HX, USX } from "~/constants/tokens";
import GasIcon from "@/assets/images/svg/svg-gas.svg";
import RefreshIcon from "@/assets/images/svg/svg-refresh.svg";
import SettingsIcon from "@/assets/images/svg/svg-settings.svg";
import SwapIcon from "@/assets/images/svg/svg-swap.svg";
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "TheSwap",
	components: {
		GasIcon,
		RefreshIcon,
		SettingsIcon,
		SwapIcon,
		TooltipIcon
	},
	data() {
		return {
			price: {
				usx: 0,
				hx: 0
			},
			input: {
				value: "",
				token: "ETH"
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
			activeStep: 1
		};
	},
	head () {
		return {
			title: "Swap | Nuon"
		};
	},
	computed: {
		tokens(){
			return this.$store.state.addressStore.tokens;
		},
		disabledSwap() {
			if (this.loadingPrice || !this.input.value || !this.output.value || !this.output.token || this.maxSlippage > 10) return true;
			return false;
		},
		hxBalance() {
			return this.$store.getters["erc20Store/hxBalance"] || 0;
		},
		usxBalance() {
			return this.$store.getters["erc20Store/usxBalance"] || 0;
		},
		ethBalance() {
			return parseFloat(fromWei(this.$store.getters["web3Store/balance"])) || 0;
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
	},
	async mounted () {
		this.price.usx = parseFloat(await this.$store.getters["stabilityFlashStore/getUSXPriceInDAI"]);
		this.price.hx = parseFloat(await this.$store.getters["stabilityFlashStore/getHydroPriceInDAI"]);
		this.getAllowance();

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
			if (token === "HX") return this.price.hx * value;
			if (token === "USX") return this.price.usx * value;
			return 0;
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
			if (!this.input.value || !this.output.token) return;
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
				this.output.value = parseFloat(fromWei(res[1])).toFixed(2);
			}).catch(() => {
				this.loadedPrice = false;
				this.loadingPrice = false;
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
				this.input.value = parseFloat(fromWei(res[0])).toFixed(2);
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
				.catch(() => {});
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
			}).catch(() => {
			});
		},
		calcuatePriceImpact() {
			this.$store.dispatch("swapStore/getReserves", [this.input.token, this.output.token]).then((reserves) => {
				const oldPrice = reserves[this.input.token] / reserves[this.output.token];
				const newPrice = (reserves[this.input.token] - this.input.value) / (reserves[this.output.token] + this.output.value);
				this.priceImpact = (oldPrice - newPrice) / oldPrice * 100;
			});
		},
		connectWallet() {
			this.$store.commit("modalStore/setModalVisibility", {name: "connectWalletModal", visibility: true});
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
			if(this.input.token === "ETH") {
				this.input.value = parseFloat(fromWei(this.$store.getters["web3Store/balance"])).toFixed(3);
			};
			if(this.input.token === "USX") {
				this.input.value = parseFloat(this.$store.getters["erc20Store/usxBalance"]).toFixed(2);
			};
			if(this.input.token === "HX") {
				this.input.value = parseFloat(this.$store.getters["erc20Store/hxBalance"]).toFixed(2);
			};
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
			if (tokenName !== USX.symbol && tokenName !== HX.symbol) return true;
			const allowance = this.$store.state.swapStore.allowance;
			return allowance[tokenName] > 0;
		},
		getAllowance() {
			this.$store.dispatch("swapStore/getAllowance");
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
		}
	}
};
</script>
