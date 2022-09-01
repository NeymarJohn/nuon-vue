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
				inputmode="decimal"
				:value="content"
				@input="handleInput" />
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
			type: [String, Number],
			default: 0
		},
		value: {
			type: [String, Number],
			default: ""
		}
	},
	data() {
		return {
			content: this.value
		};
	},
	watch: {
		value(newValue) {
			this.content = newValue;
		}
	},
	methods: {
		clicked ($event) {
			this.$emit("click", $event);
		},
		handleInput (e) {
			this.content = e.target.value;
			this.$emit("input", this.content);
		}
	}
};
</script>
