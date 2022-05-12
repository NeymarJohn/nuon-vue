<template>
	<div :class="`tabs tabs--${size} tabs--${color}`">
		<ul class="tabs__header">
			<li v-for="(tab, index) in tabs" :key="tab.title" :class="{'is-active': (index === selectedIndex)}" @click="selectTab(index)">
				<h5>{{ tab.title }}</h5>
			</li>
		</ul>
		<slot />
	</div>
</template>

<script>
export default {
	name: "TheTabs",
	props: {
		size: {
			type: String,
			default: "default"
		},
		color: {
			type: String,
			default: "dark"
		}
	},
	data() {
		return {
			selectedIndex: 0,
			tabs: []
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
			this.tabs.forEach((tab, index) => {
				tab.isActive = (index === i);
			});
		}
	}
};
</script>
