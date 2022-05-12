<template>
	<div v-if="isActive" class="tabs__body">
		<slot />
	</div>
</template>

<script>
export default {
	name: "TheTab",
	props: {
		title: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			isActive: true
		};
	}
};
</script>
