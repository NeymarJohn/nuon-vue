<template>
	<div class="range-slider">
		<div class="range-slider__labels u-mb-8">
			<p>High Risk</p>
			<p>Low Risk</p>
		</div>
		<input ref="rangeSlider" v-model="selectedValue" type="range" :min="min" :max="max" :disabled="sliderDisabled" class="range-slider__input" @change="handleRangeChange">
		<div class="range-slider__labels u-mt-8">
			<p>{{ min }}%</p>
			<p>1000%</p>
		</div>
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
		},
		handleRangeChange() {
			const target = this.$refs.rangeSlider;
			const min = target.min;
			const max = target.max;
			const val = target.value;
			target.style.backgroundSize = (val - min) * 100 / (max - min) + "% 100%";
		}
	}
};
</script>
