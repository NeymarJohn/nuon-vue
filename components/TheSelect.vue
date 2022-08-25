<template>
	<div class="select" :class="{ active: isActive, inline: inline }" @click="toggleSelect" >
		<label>{{ label }}</label>
		<div class="select__button">
			<div class="select__selected">
				{{ options[selectedIndex].label || options[selectedIndex]}}
				<ChevronDownIcon v-if="!isActive" />
				<ChevronUpIcon v-else />
			</div>
			<div class="select__options">
				<div
					v-for="(option, index) in options"
					:key="index"
					:class="{ selected: option.value === value || option === value }"
					class="select__option"
					@click="selectOption(option, index)">
					{{ option.label || option }} <SelectedIcon v-if="option.value === value || option === value" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ChevronDownIcon from "@/assets/images/svg/svg-chevron-down.svg";
import ChevronUpIcon from "@/assets/images/svg/svg-chevron-up.svg";
import SelectedIcon from "@/assets/images/svg/svg-selected.svg";

export default {
	name: "TheSelect",
	components: {
		ChevronDownIcon,
		ChevronUpIcon,
		SelectedIcon
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
		},
		inline: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			value: "",
			isActive: false,
			selectedIndex: 0
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
		selectOption(option, index) {
			this.value = option;
			this.selectedIndex = index;
			this.$emit("filter-select", option);
		}
	}
};
</script>
