<template>
	<div :class="`l-stat-bar l-stat-bar--${ columns }`">
		<slot />
	</div>
</template>

<script>
export default {
	name: "LayoutStatBar",
	props: {
		columns: {
			type: String,
			default: "3",
		},
	},
};
</script>
