<template>
	<div v-if="!loaded" :class="`loader loader--${ component }`" />
	<div v-else :class="`u-full-width l-flex ${slotClasses}`"><slot /></div>
</template>

<script>
export default {
	name: "ComponentLoader",
	props: {
		component: {
			type: String,
			required: true
		},
		loaded: {
			type: Boolean,
			required: false
		},
		slotClasses: {
			type: String,
			required: false,
			default: ""
		}
	},
};
</script>
