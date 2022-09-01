<template>
	<div class="input">
		<div class="input__container">
			<input
				placeholder="0.0"
				type="number"
				min="0"
				max="79"
				autocomplete="off"
				autocorrect="off"
				spellcheck="false"
				inputmode="decimal" />
			<TheButton
				:disabled="isMaxInputDisabled(maximum)"
				size="sm"
				title="Click to input your max balance"
				@click="clicked($event)">Max</TheButton>
		</div>
	</div>
</template>

<script>
export default {
	name: "InputMax",
	props: {
		maximum: {
			type: Number,
			default: 0
		},
	},
	methods: {
		clicked ($event) {
			this.$emit("click", $event);
		},
	}
};
</script>
