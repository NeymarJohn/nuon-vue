<template>
	<div>
		<h5 class="u-mb-12 u-color-light-grey">Transaction Summary</h5>
		<div class="transaction-summary transaction-summary--swap">
			<LayoutFlex direction="row-center-space-between">
				<LayoutFlex direction="row-center">
					<img :src="require(`~/assets/images/tokens/Hydro.png`)" alt="Hydro logo">
					<h4>{{input.token}}</h4>
				</LayoutFlex>
				<LayoutFlex direction="column-end">
					<h2>{{input.value | formatPrice }}</h2>
					<p>~ ${{ input.value * tokenPrices[input.token] | formatPrice }}</p>
				</LayoutFlex>
			</LayoutFlex>
			<LayoutFlex>
				<ArrowDownIcon />
			</LayoutFlex>
			<LayoutFlex direction="row-center-space-between">
				<LayoutFlex direction="row-center">
					<img :src="require(`~/assets/images/tokens/Ethereum.png`)" alt="Ethereum logo">
					<h4>{{output.token}}</h4>
				</LayoutFlex>
				<LayoutFlex direction="column-end">
					<h2>{{ output.value | formatPrice }}</h2>
					<p>~ ${{ output.value * tokenPrices[output.token] | formatPrice }}</p>
				</LayoutFlex>
			</LayoutFlex>
			<div v-if="priceUpdate" class="transaction__update">
				<LayoutFlex direction="column">
					<h4 class="u-mb-8"><WarningIcon /> Price Updated</h4>
					<h4>1 {{output.token}} = {{swapPrice}} {{input.token}}</h4>
				</LayoutFlex>
				<TheButton
					size="lg"
					title="Click to accept"
					@click="acceptNewPrice">Accept</TheButton>
			</div>
			<LayoutFlex v-else class="u-bb-medium-light-grey u-ptb-32 u-mb-32">
				<h4 class="u-color-white">1 {{output.token}} = {{swapPrice}} {{input.token}}</h4>
			</LayoutFlex>
			<LayoutFlex
				v-for="(value, index) in values"
				:key="index"
				direction="row-start-space-between">
				<h4 class="u-color-white">{{ value.title }}</h4>
				<LayoutFlex direction="column-end" class="u-mb-8">
					<h4 class="u-color-white">{{ value.val }} {{ value.currency && value.currency }}</h4>
					<p v-if="value.dollar">~ ${{ value.dollar | formatPrice }}</p>
				</LayoutFlex>
			</LayoutFlex>
		</div>
	</div>
</template>

<script>
import ArrowDownIcon from "@/assets/images/svg/svg-arrow-down.svg";
import WarningIcon from "@/assets/images/svg/svg-warning.svg";

export default {
	name: "TransactionSummarySwap",
	components: {
		ArrowDownIcon,
		WarningIcon
	},
	props: {
		values: {
			type: Array,
			required: true
		},
		input: {
			type: Object,
			required: true
		},
		output: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			tokenInput: {
				in: 200,
				dollar: 100
			},
			tokenOutput: {
				out: 0.497,
				dollar: 0.76
			},
			priceUpdate: true
		};
	},
	computed: {
		swapPrice() {
			return parseFloat(this.input.value) / parseFloat(this.output.value); 
		}
	},
	methods: {
		acceptNewPrice() {
			this.priceUpdate = false;
		}
	},
};
</script>
