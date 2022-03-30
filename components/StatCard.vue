<template>
	<div :class="`stat-card stat-card--${color}`">
		<slot />
	</div>
</template>

<script>
export default {
	name: "StatCard",
	props: {
		color: {
			type: String,
			default: "dark-blue",
		},
	}
};
</script>
