<template>
	<div class="dropdown">
		<TheButton size="dropdown" title="Click to show menu" @click="toggleShow">
			<EllipsisIcon />
		</TheButton>
		<div v-if="showMenu" class="menu">
			<div v-for="item in items" :key="item" class="menu-item" @click="itemClicked(item)">{{item.label}}</div>
		</div>
	</div>
</template>
<script>
import EllipsisIcon from "@/assets/images/svg/svg-ellipsis.svg";

export default{
	name: "Dropdown",
	components: {
		EllipsisIcon,
	},
	props: {
		items: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			showMenu: false
		};
	},
	methods: {
		toggleShow() {
			this.showMenu = !this.showMenu;
		},
		itemClicked(item) {
			this.toggleShow();
			this.$emit("click", item);
		}
	}
};
</script>
