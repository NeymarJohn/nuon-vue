<template>
	<div :class="`tabs tabs--${size} tabs--${color}`">
		<ul :class="`tabs__header u-mb-${margin}`">
			<li v-for="(tab, index) in tabs" :key="tab.index" :class="{'is-active': (index === selectedIndex)}" :title="`Click to view ${tab.title.toLowerCase()}`" @click="selectTab(index)">
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
		},
		margin: {
			type: String,
			default: "48"
		},
		defaultSelected: {
			type: Number,
			required: false,
			default: 0
		}
	},
	data() {
		return {
			selectedIndex: null,
			tabs: []
		};
	},
	watch: {
		defaultSelected(newValue) {
			this.selectTab(newValue);
		}
	},
	mounted() {
		this.selectTab(this.defaultSelected);
	},
	created() {
		this.tabs = this.$children;
	},
	methods: {
		selectTab (i) {
			this.$emit("tab-changed", i);
			this.selectedIndex = i;
			this.tabs.forEach((tab, index) => {
				tab.isActive = (index === i);
			});
		}
	},
};
</script>
