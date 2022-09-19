<template>
	<div class="input">
		<div class="input__container">
			<input
				ref="inputFocus"
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
				v-if="!hiddenMaxButton"
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
		},
		hiddenMaxButton: {
			type: Boolean,
			default: false
		},
		autoFocus: {
			type: Boolean,
			default: false
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
	mounted () {
		if (this.autoFocus) {
			this.$nextTick(() => this.$refs.inputFocus.focus());
		}
	},
	methods: {
		clicked ($event) {
			if (this.maximum) {
				this.content = Number(this.maximum).toFixed(2);
				this.$emit("input", this.content);
			}
			this.$emit("click", $event);
		},
		handleInput (e) {
			this.content = e.target.value;
			this.$emit("input", this.content);
		}
	}
};
</script>
