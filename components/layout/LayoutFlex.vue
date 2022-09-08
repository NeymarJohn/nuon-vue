<template>
	<div :class="`l-flex l-flex--${ direction } l-flex--border-${ border }`" @click="clicked($event)">
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
		border: {
			type: String,
			default: "none",
		},
	},
	methods: {
		clicked ($event) {
			this.$emit("click", $event);
		}
	}
};
</script>
