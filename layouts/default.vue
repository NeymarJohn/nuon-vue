<template>
	<LayoutContent>
		<LayoutSidebar />
		<LayoutMain>
			<Nuxt />
		</LayoutMain>
	</LayoutContent>
</template>

<script>
export default {
	name: "TheDefault",
	layout: "default",
};
</script>

<style lang="scss">
@import "~/assets/stylesheets/main";
</style>

