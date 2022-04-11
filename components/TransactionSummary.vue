<template>
	<div>
		<h5 class="u-mb-12 u-color-dark-grey">Transaction Summary</h5>
		<div class="transaction-summary">
			<LayoutFlex
				v-for="(value, index) in values"
				:key="index"
				direction="row-start-space-between"
				:class="`${index !== values.length - 1 && 'u-mb-8'} ${index === values.length - 2 && 'u-pb-8 u-bb-black'}`">
				<p>{{ value.title }}</p>
				<LayoutFlex direction="column-end">
					<p>{{ value.val }} {{ value.currency && value.currency }}</p>
					<p>~ ${{ value.dollar }}</p>
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
		}
	}
};
</script>
