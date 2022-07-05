<template>
	<div :class="`dot dot--${color}`"></div>
</template>

<script>
export default {
	name: "TheDot",
	props: {
		color: {
			type: String,
			required: true
		},
	},
};
</script>
