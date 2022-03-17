<template>
	<div>
		<h4 class="u-mb-xs">Transaction Summary</h4>
		<div class="transaction-summary">
			<LayoutFlex
				v-for="(value, index) in values"
				:key="index"
				direction="row-start-space-between"
				:class="`${index !== values.length - 1 && 'u-mb-xs'} ${index === values.length - 2 && 'u-pb-xs u-bb-black'}`">
				<p>{{ value.title }}</p>
				<LayoutFlex direction="column-end">
					<p>{{ value.val }} {{ value.currency && value.currency }}</p>
					<p class="u-colour-grey-dark">~ ${{ value.dollar }}</p>
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
