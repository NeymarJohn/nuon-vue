<template>
	<div :class="`data-card data-card--${ align }`">
		<slot />
	</div>
</template>

<script>
export default {
	name: "DataCard",
	props: {
		align: {
			type: String,
			default: "start",
		},
	},
};
</script>
