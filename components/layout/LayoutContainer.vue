<template>
	<div :class="`l-container l-container--${ size } l-container--${ color }`">
		<slot />
	</div>
</template>

<script>
export default {
	name: "LayoutContainer",
	props: {
		size: {
			type: String,
			default: "md",
		},
		color: {
			type: String,
			default: "white",
		},
	},
};
</script>
