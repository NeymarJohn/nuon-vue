<template>
	<button :class="`btn btn--${ size }`" type="button" @click="clicked($event)">
		<slot />
	</button>
</template>

<script>
export default {
	name: "TheButton",
	props: {
		size: {
			type: String,
			default: "md",
		},
	},
	methods: {
		clicked ($event) {
			this.$emit("click", $event);
		}
	}
};
</script>
