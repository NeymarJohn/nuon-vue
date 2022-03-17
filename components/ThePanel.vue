<template>
	<div class="panel">
		<h3>{{ title }}</h3>
		<slot />
	</div>
</template>

<script>
export default {
	name: "ThePanel",
	props: {
		title: {
			type: String,
			required: true
		},
	},
};
</script>
