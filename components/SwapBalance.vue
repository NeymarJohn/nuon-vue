<template>
	<LayoutFlex direction="row-center-space-between swap__balance">
		<label>{{ label }}</label>
		<label>Available balance: <span>{{ tokenBalances[token] | formatLongNumber }}</span></label>
	</LayoutFlex>
</template>

<script>
export default {
	name: "SwapBalance",
	props: {
		label: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	},
};
</script>
