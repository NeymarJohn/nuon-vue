<template>
	<div class="tabs tabs--default tabs--image">
		<ul class="tabs__header">
			<li v-for="(tab, index) in tabs" :key="tab.index" :class="{'is-active': (index === selectedIndex)}" :title="`Click to view ${tab.title.toLowerCase()} hub`" @click="selectTab(index)">
				<img :src="require(`~/assets/images/borrow/${tab.title}.png`)" />
				<h5>{{ tab.title }}</h5>
			</li>
			<li title="Click to view hub overview">
				<h5>Hub Overview</h5>
			</li>
		</ul>
		<slot />
	</div>
</template>

<script>
export default {
	name: "TheTabsImage",
	data() {
		return {
			selectedIndex: 0,
			tabs: [],
		};
	},
	mounted() {
		this.selectTab(0);
	},
	created() {
		this.tabs = this.$children;
	},
	methods: {
		selectTab (i) {
			this.selectedIndex = i;
			this.$emit("tab-changed", i);
			this.tabs.forEach((tab, index) => {
				tab.isActive = (index === i);
			});
		}
	}
};
</script>
