<template>
	<LayoutError>
		<ErrorIcon />
		<h3>{{ message }}</h3>
		<nuxt-link v-if="statusCode === 404" to="/">
			Return to dashboard
		</nuxt-link>
	</LayoutError>
</template>

<script>
import ErrorIcon from "@/assets/images/svg/svg-error.svg";

export default {
	name: "TheError",
	components: {
		ErrorIcon
	},
	props: {
		error: {
			type: Object,
			default: null
		}
	},
	head () {
		return {
			title: this.message
		};
	},
	computed: {
		statusCode () {
			return (this.error && this.error.statusCode) || 500;
		},
		message () {
			return this.error.message;
		}
	}
};
</script>
