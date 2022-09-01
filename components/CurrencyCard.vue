<template>
	<div class="currency-card">
		<label>{{ label }}</label>
		<h3 v-if="value">{{ symbol }}{{ value | toFixed | numberWithCommas}}<sup>{{ currency }}</sup></h3>
		<h3 v-else>{{ percent | toFixed | numberWithCommas }}<sup>%</sup></h3>
		<h5 v-if="change">${{ change | toFixed | numberWithCommas }}</h5>
	</div>
</template>

<script>
export default {
	name: "CurrencyCard",
	props: {
		label: {
			type: String,
			required: true
		},
		symbol: {
			type: String,
			default: ""
		},
		currency: {
			type: String,
			default: "",
		},
		value: {
			type: Number,
			default: 0
		},
		percent: {
			type: Number,
			default: 0
		},
		change: {
			type: Number,
			default: 0
		},
	},
};
</script>
