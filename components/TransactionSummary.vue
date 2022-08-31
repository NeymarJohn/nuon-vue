<template>
	<div class="transaction-summary">
		<label class="u-mb-16">Transaction Summary</label>
		<div class="transaction-summary__container">
			<LayoutFlex v-for="(value, index) in values" :key="index" direction="row-space-between u-mb-20">
				<label>{{ value.title }}</label>
				<label><strong>{{ value.val }} {{ value.currency && value.currency }}</strong></label>
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
