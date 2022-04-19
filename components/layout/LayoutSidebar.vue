<template>
	<aside class="l-sidebar" :class="{ 'is-active': isNavClosed }">
		<div class="l-sidebar--top">
			<TheLogo />
			<TheNav />
		</div>
		<TheFooter />
	</aside>
</template>

<script>
export default {
	name: "LayoutSidebar",
	computed: {
		isNavClosed() {
			return this.$store.getters["nav/isActive"];
		}
	},
};
</script>
