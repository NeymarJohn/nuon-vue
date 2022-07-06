<template>
	<LayoutFlex>
		<div
			v-for="(pill, pillIdx) in pills"
			:key="pillIdx"
			:class="['pill', activeIndex === pillIdx && 'active']"
			@click="pillClicked(pillIdx)">
			{{ pill }}
		</div>
	</LayoutFlex>
</template>

<script>
export default {
	name: "ThePills",
	props: {
		pills: {
			type: Array,
			required: true
		},
		defaultActive: {
			type: Boolean,
			required: false,
		}
	},
	data() {
		return {
			activeIndex: this.defaultActive ? 0 : null
		};
	},
	methods: {
		pillClicked(idx) {
			this.activeIndex = idx;
			this.$emit("pill-clicked", idx);
		}
	}
};
</script>
