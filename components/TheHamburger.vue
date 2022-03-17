<template>
	<button class="hamburger" :class="{ 'is-active': navActive }" @click="toggleNav">
		<div class="hamburger-box">
			<div class="hamburger-inner"></div>
		</div>
	</button>
</template>

<script>
export default {
	name: "TheHamburger",
	computed: {
		navActive() {
			return this.$store.getters["nav/isActive"];
		},
	},
	methods: {
		toggleNav() {
			this.$store.commit("nav/toggle", null);
		}
	}
};
</script>
