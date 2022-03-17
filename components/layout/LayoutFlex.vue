<template>
	<div :class="`l-flex l-flex--${ direction }`" @click="clicked($event)">
		<slot />
	</div>
</template>

<script>
export default {
	name: "LayoutFlex",
	props: {
		direction: {
			type: String,
			default: "row",
		},
	},
	methods: {
		clicked ($event) {
			this.$emit("click", $event);
		}
	}
};
</script>
