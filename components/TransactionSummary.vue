<template>
	<div>
		<label class="u-mb-16">Transaction Summary</label>
		<div class="transaction-summary">
			<LayoutFlex v-for="(value, index) in values" :key="index" direction="row-space-between u-mb-20">
				<label>{{ value.title }}</label>
				<LayoutFlex direction="column-end">
					<label>{{ value.val }} {{ value.currency && value.currency }}</label>
					<label v-if="value.dollar">~ ${{ value.dollar | toFixed | numberWithCommas}}</label>
				</LayoutFlex>
			</LayoutFlex>
		</div>
	</div>
</template>

<script>
export default {
	name: "TransactionSummary",
	props: {
		values: {
			type: Array,
			required: true
		},
		finalBalanceLine: {
			type: Boolean,
			required: false,
			default: true
		}
	}
};
</script>
