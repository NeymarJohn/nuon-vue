<template>
	<div>
		<h5 class="u-mb-12 u-color-light-grey">Transaction Summary</h5>
		<div class="transaction-summary">
			<LayoutFlex
				v-for="(value, index) in values"
				:key="index"
				direction="row-start-space-between"
				:class="`${index !== values.length - 1 && 'u-mb-8'} ${index === values.length - 2 && finalBalanceLine && 'u-pb-8 u-bb-white'}`">
				<p>{{ value.title }}</p>
				<LayoutFlex direction="column-end">
					<p>{{ value.val }} {{ value.currency && value.currency }}</p>
					<p v-if="value.dollar">~ ${{ value.dollar | toFixed | numberWithCommas}}</p>
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
