<template>
	<div :class="`tabs tabs--${size} tabs--${color}`">
		<LayoutFlex class="u-mb-24" direction="row-center-space-between">
			<ul class="tabs__header">
				<li v-for="(tab, index) in tabs" :key="tab.index" :class="{'is-active': (index === selectedIndex)}" @click="selectTab(index)">
					<h5>{{ tab.title }}</h5>
				</li>
			</ul>
			<slot name="filter" />
		</LayoutFlex>
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
