<template>
	<div class="dropdown">
		<TheButton size="dropdown" title="Click to show menu" @click="toggleShow">
			<EllipsisIcon />
		</TheButton>
		<div v-if="showMenu" class="dropdown__menu">
			<div v-for="(item, idx) in items" :key="idx" class="dropdown__menu-item" @click="itemClicked(item)">{{item.label}}</div>
		</div>
	</div>
</template>

<script>
import EllipsisIcon from "@/assets/images/svg/svg-ellipsis.svg";

export default{
	name: "TheDropdown",
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
	mounted () {
		document.addEventListener("keyup", (e) => {
			if (e.key === "Escape" || e.key === "Esc" || e.key === 27) {
				this.showMenu = false;
			}
		});
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
