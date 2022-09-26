<template>
	<button :class="`btn btn--${ size }`" type="button" @click="clicked($event)">
		<slot v-if="!loading" />
		<label v-else >Loading...</label>
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
