<template>
	<div :class="`l-grid l-grid--${ direction }-${size}`">
		<slot />
	</div>
</template>

<script>
export default {
	name: "LayoutGrid",
	props: {
		direction: {
			type: String,
			default: "column",
		},
		size: {
			type: String,
			default: "4",
		},
	},
};
</script>
