<template>
	<div class="range-slider">
		<input v-model="selectedValue" type="range" :min="min" :max="max" :disabled="sliderDisabled" class="range-slider__input">
	</div>
</template>

<script>
export default {
	name: "RangeSlider",
	props: {
		min: {
			type: String,
			default: "0"
		},
		max: {
			type: String,
			default: "1000"
		},
		sliderDisabled: {
			type: Boolean,
			default: true
		},
		selectedCollateralRatio: {
			type: String,
			required: true
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
		},
		selectedCollateralRatio(newValue, oldValue) {
			if (oldValue === "null" && newValue) {
				this.selectedValue = this.selectedCollateralRatio;
			}
		}
	},
	methods: {
		emitChange(e) {
			this.$emit("emit-change", e);
		}
	}
};
</script>
