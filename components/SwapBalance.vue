<template>
	<LayoutFlex direction="row-center-space-between swap__balance">
		<label>{{ label }}</label>
		<ComponentLoader component="label" :loaded="tokenBalances[token] !== '0'">
			<label>Balance:
				<span>{{ tokenBalances[token] | formatLongNumber }}</span>
			</label>
		</ComponentLoader>
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
