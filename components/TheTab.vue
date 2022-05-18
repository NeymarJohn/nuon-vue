<template>
	<div v-if="isActive" :class="`tabs__body u-mt-${margin}`">
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
		},
		margin: {
			type: String,
			default: "0"
		}
	},
	data() {
		return {
			isActive: true
		};
	}
};
</script>
