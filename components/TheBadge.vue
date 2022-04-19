<template>
	<div :class="`badge badge--${ color }`">
		<slot />
	</div>
</template>

<script>
export default {
	name: "TheBadge",
	props: {
		color: {
			type: String,
			default: "lime",
		},
	},
};
</script>
