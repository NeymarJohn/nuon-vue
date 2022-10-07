<template>
	<button :class="`btn btn--${ size }`" type="button" :disabled="loading" @click="clicked($event)">
		<slot v-if="!loading" />
		<div v-else class="spin-loader" ></div>
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
		loading: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		loading(newValue) {
			console.log(newValue);
		}
	},
	methods: {
		clicked ($event) {
			if (this.loading) return;
			this.$emit("click", $event);
		}
	}
};
</script>
