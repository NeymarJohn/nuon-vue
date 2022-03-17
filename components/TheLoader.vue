<template>
	<div v-if="!isLoaded" :class="`loader loader--${ component } ${ width }`" />
	<div v-else><slot /></div>
</template>

<script>
export default {
	name: "TheLoader",
	props: {
		component: {
			type: String,
			default: "default",
		},
		width: {
			type: String,
			default: ""
		}
	},
};
</script>
