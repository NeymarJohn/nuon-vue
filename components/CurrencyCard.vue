<template>
	<div class="currency-card">
		<label>{{ label }}</label>
		<h3>{{ symbol }}{{ value | toFixed | numberWithCommas}}<sup>{{ currency }}</sup></h3>
		<h5 v-if="change">${{ change | toFixed | numberWithCommas }}</h5>
		<TheBadge v-if="badge" :color="`collateral badge--collateral-${badgeColor}`">{{ badge | toFixed | numberWithCommas}} {{ badgeCurrency }} after</TheBadge>
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
		badge: {
			type: String,
			default: ""
		},
		badgeCurrency: {
			type: String,
			default: "",
		},
		badgeColor: {
			type: String,
			default: "grey"
		}
	},
};
</script>
