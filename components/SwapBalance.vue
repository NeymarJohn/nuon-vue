<template>
	<LayoutFlex
		direction="row-center-space-between"
		class="swap__balance">
		<label>{{ label }}</label>
		<p>{{token}} Balance: <span>{{ tokenBalances[token] | formatLongNumber }}</span></p>
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
