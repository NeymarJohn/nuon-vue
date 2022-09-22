<template>
	<div class="transaction-summary">
		<label class="u-mb-16">Transaction Summary</label>
		<div class="transaction-summary__container">
			<LayoutFlex v-for="(value, index) in values" :key="index" direction="row-space-between u-mb-20">
				<label>{{ value.title }}</label>
				<ComponentLoader :loaded="value.val !== undefined && value.val !== null && value.val !== NaN" component="label" :slot-classes="'l-flex--row-justify-center'">
					<label><strong>{{ value.val | toFixed | numberWithCommas }} {{ value.currency }}</strong></label>
				</ComponentLoader>
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
