<template>
	<div :class="`l-info l-info--${size}`">
		<slot />
	</div>
</template>

<script>
export default {
	name: "LayoutInfo",
	props: {
		size: {
			type: String,
			default: "4",
		},
	},
};
</script>
