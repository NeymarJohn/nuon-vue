<template>
	<LayoutFlex direction="row-wrap">
		<div v-for="item in items" :key="item.id" :class="className">
			<slot name="item" :item="item"/>
		</div>
		<div v-observe-visibility="handleScroll"></div>
	</LayoutFlex>
</template>

<script>
import { ObserveVisibility } from "vue-observe-visibility";

export default {
	directives: {
		ObserveVisibility
	},
	props: {
		items: {
			type: Array,
			required: true
		},
		className: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			page: 0,
		};
	},
	methods: {
		handleScroll(isVisible) {
			if(!isVisible) return true;
			this.page ++;
			this.$emit("fetch", this.page);
		}
	}
};
</script>
