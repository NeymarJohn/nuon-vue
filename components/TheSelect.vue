<template>
	<div class="select" :class="{ active: isActive }" @click="toggleSelect" >
		<label>{{ label }}</label>
		<div class="select__selected">
			{{ value || this.default }}
			<ChevronDownIcon v-if="!isActive" />
			<ChevronUpIcon v-else />
		</div>
		<div class="select__options">
			<div
				v-for="(option, index) in options"
				:key="index"
				:class="{ selected: option === value }"
				class="select__option"
				@click="selectOption(option)"
			>
				{{ option }} <SuccessIcon v-if="option === value" />
			</div>
		</div>
	</div>
</template>

<script>
import ChevronDownIcon from "@/assets/images/svg/svg-chevron-down.svg";
import ChevronUpIcon from "@/assets/images/svg/svg-chevron-up.svg";
import SuccessIcon from "@/assets/images/svg/svg-success.svg";

export default {
	name: "TheSelect",
	components: {
		ChevronDownIcon,
		ChevronUpIcon,
		SuccessIcon
	},
	props: {
		options: {
			type: Array,
			required: true,
		},
		default: {
			type: String,
			required: false,
			default: ""
		},
		label: {
			type: String,
			required: true,
			default: "Filter"
		}
	},
	data() {
		return {
			value: "",
			isActive: false
		};
	},
	mounted() {
		window.addEventListener("click", (e) => {
			if (!this.$el.contains(e.target)){
				this.isActive = false;
			}
		});
	},
	methods: {
		toggleSelect() {
			this.isActive = !this.isActive;
		},
		selectOption(option) {
			this.value = option;
			this.$emit("filter-select", option);
		}
	}
};
</script>
