<template>
	<div class="range-slider">
		<div class="range-slider__header">
			<label for="rangeInput">Input your ratio here</label>
			<div class="range-slider__addon">
				<input id="rangeInput" v-model="selectedValue" type="number" :min="min" :max="max" :disabled="sliderDisabled" :class="selectedCollateralRatio < 300 ? selectedCollateralRatio < 200 ? 'u-is-warning' : 'u-is-caution' : 'u-is-success'"  />
				<span :class="sliderDisabled ? 'is-disabled' : null || selectedCollateralRatio < 300 ? selectedCollateralRatio < 200 ? 'u-is-warning' : 'u-is-caution' : 'u-is-success'">%</span>
			</div>
		</div>
		<div class="range-slider__wrapper">
			<div class="range-slider__labels u-mb-8">
				<p>High Risk</p>
				<p>Low Risk</p>
			</div>
			<input ref="rangeSlider" v-model="selectedValue" type="range" :min="min" :max="max" :disabled="sliderDisabled" class="range-slider__input" >
			<div class="range-slider__labels u-mt-8">
				<p>{{ min }}%</p>
				<p>1000%</p>
			</div>
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
			if (newValue) {
				this.emitChange(newValue);
				this.handleRangeChange(newValue);
			} else {
				this.emitChange(0);
				this.handleRangeChange(0);
			}
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
		handleRangeChange(value) {
			const target = this.$refs.rangeSlider;
			const min = target.min;
			const max = target.max;
			let currentPosition = value - min;
			if (currentPosition < 0) {
				currentPosition = 0;
			}
			target.style.backgroundSize = currentPosition * 100 / (max - min) + "% 100%";
		}
	}
};
</script>
