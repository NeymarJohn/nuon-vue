<template>
	<div :class="`l-container l-container--${ size }`">
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
	},
};
</script>
