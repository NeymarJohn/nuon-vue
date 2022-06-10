<template>
	<div class="range-slider">
		<input v-model="selectedValue" type="range" :min="min" :max="max" class="range-slider__input">
	</div>
</template>

<script>
export default {
	name: "RangeSlider",
	props: {
		min: {
			type: Number,
			default: 170
		},
		max: {
			type: Number,
			default: 1000
		}
	},
	data() {
		return {
			selectedValue: this.min
		};
	},
	watch: {
		selectedValue(newValue) {
			if (newValue) this.emitChange(newValue);
		}
	},
	methods: {
		emitChange(e) {
			this.$emit("emit-change", e);
		}
	}
};
</script>
