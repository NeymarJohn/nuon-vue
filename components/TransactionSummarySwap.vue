<template>
	<div>
		<h4>Transaction Summary</h4>
		<div class="transaction-summary">
			<LayoutFlex direction="row-center-space-between">
				<LayoutFlex direction="row-center">
					<img :src="require(`~/assets/images/tokens/Hydro.png`)" alt="Hydro logo">
					<h2>{{input.token}}</h2>
				</LayoutFlex>
				<LayoutFlex direction="column-end">
					<h2>{{input.value | formatPrice }}</h2>
					<p class="u-colour-grey-dark">~ ${{ input.value * tokenPrices[input.token] | formatPrice }}</p>
				</LayoutFlex>
			</LayoutFlex>
			<LayoutFlex>
				<ArrowDownIcon />
			</LayoutFlex>
			<LayoutFlex direction="row-center-space-between">
				<LayoutFlex direction="row-center">
					<img :src="require(`~/assets/images/tokens/Ethereum.png`)" alt="Ethereum logo">
					<h2>{{output.token}}</h2>
				</LayoutFlex>
				<LayoutFlex direction="column-end">
					<h2>{{ output.value | formatPrice }}</h2>
					<p class="u-colour-grey-dark">~ ${{ output.value * tokenPrices[output.token] | formatPrice }}</p>
				</LayoutFlex>
			</LayoutFlex>
			<div v-if="priceUpdate" class="transaction__update">
				<LayoutFlex direction="column">
					<h4>Price Updated</h4>
					<h4>1 {{output.token}} = {{swapPrice}} {{input.token}}</h4>
				</LayoutFlex>
				<TheButton
					size="md"
					title="Click to accept"
					@click="acceptNewPrice">Accept</TheButton>
			</div>
			<LayoutFlex v-else class="u-bb-white">
				<h4>1 {{output.token}} = {{swapPrice}} {{input.token}}</h4>
			</LayoutFlex>
			<LayoutFlex
				v-for="(value, index) in values"
				:key="index"
				direction="row-start-space-between">
				<p>{{ value.title }}</p>
				<LayoutFlex direction="column-end">
					<p>{{ value.val }} {{ value.currency && value.currency }}</p>
					<p v-if="value.dollar" class="u-colour-grey-dark">~ ${{ value.dollar | formatPrice }}</p>
				</LayoutFlex>
			</LayoutFlex>
		</div>
	</div>
</template>

<script>
import ArrowDownIcon from "@/assets/images/svg/svg-arrow-down.svg";

export default {
	name: "TransactionSummarySwap",
	components: {
		ArrowDownIcon
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
