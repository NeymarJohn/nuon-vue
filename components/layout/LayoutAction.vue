<template>
	<div :class="`l-action l-action--${type}`">
		<div class="l-action__left">
			<slot name="left" />
		</div>
		<div class="l-action__right">
			<slot name="right" />
		</div>
	</div>
</template>

<script>
export default {
	name: "LayoutAction",
	props: {
		type: {
			type: String,
			default: "",
		},
	},
};
</script>
