<template>
	<div class="u-full-width">
		<div v-if="stepper" class="stepper">
			<div class="stepper__progress">
				<div class="stepper__progress-bar" :style="'width:' + stepperProgress"></div>
			</div>
			<div
				v-for="(item, idx) in 2"
				:key="item" class="stepper__item"
				:class="{ 'active': activeStep === item, 'success': activeStep > item || activeStep === 'loading' }">
				<div class="stepper__counter">
					<CheckmarkIcon />
					<span class="stepper__number"></span>
				</div>
				<div class="stepper__title">
					{{ steps[idx] }}
				</div>
			</div>
		</div>
		<div class="stepper__content">
			<div v-if="activeStep === 1" class="stepper__panel">
				<slot name="step-one" />
			</div>
			<div v-if="activeStep === 2" class="stepper__panel">
				<slot name="step-two" />
			</div>
			<div v-if="activeStep === 'loading' || activeStep === 'approving'" class="stepper__loading">
				<LoadingSpinner />
				<h2>Waiting For {{ activeStep === "loading" ? "Confirmation" : "Approval" }}</h2>
				<p>Confirm this transaction in your Metamask wallet.</p>
			</div>
		</div>
	</div>
</template>

<script>
import CheckmarkIcon from "@/assets/images/svg/svg-checkmark.svg";

export default {
	name: "TheStepper",
	components: {
		CheckmarkIcon
	},
	props: {
		steps: {
			type: Array,
			default() {
				return ["Step 1", "Step 2"];
			}
		},
		activeStep: {
			type: [Number, String],
			default: 1,
			validator(value) {
				return [1, 2, "loading", "approving", ""].includes(value);
			},
		},
		stepper: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		stepperProgress() {
			return ( 100 / 1 ) * ( this.activeStep - 1 ) + "%";
		},
	},
};
</script>
