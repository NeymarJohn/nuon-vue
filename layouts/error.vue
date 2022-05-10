<template>
	<LayoutError>
		<ErrorIcon class="u-mb-48" />
		<h1 class="u-mb-24">{{ statusCode }}</h1>
		<h2 class="u-mb-64">{{ message }}</h2>
		<nuxt-link v-if="statusCode === 404" to="/" class="btn btn--md">
			Back To Dashboard
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
