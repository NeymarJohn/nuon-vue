<template>
	<div v-if="!loaded" :class="`loader loader--${ component } ${ width }`" />
	<div v-else :class="`u-full-width l-flex ${slotClasses}`"><slot /></div>
</template>

<script>
export default {
	name: "ComponentLoader",
	props: {
		component: {
			type: String,
			default: "default",
		},
		width: {
			type: String,
			default: ""
		},
		loaded: {
			type: Boolean,
			required: true
		},
		slotClasses: {
			type: String,
			required: false,
			default: ""
		}
	},
};
</script>
