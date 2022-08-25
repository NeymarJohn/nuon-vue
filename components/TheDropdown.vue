<template>
	<div class="dropdown">
		<TheButton size="dropdown" title="Click to show menu" @click="toggleShow">
			<EllipsisIcon @click="handleClickIcon"/>
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
			showMenu: false,
		};
	},
	mounted () {
		document.addEventListener("keyup", (e) => {
			if (e.key === "Escape" || e.key === "Esc" || e.key === 27) {
				this.showMenu = false;
			}
		});
		document.addEventListener("click", (e) => {
			if (!e.target.classList.contains("btn--dropdown")) this.showMenu = false;
		});
		this.handleClickIcon = this.handleClickIcon.bind(this);
	},
	methods: {
		toggleShow() {
			this.showMenu = !this.showMenu;
		},
		itemClicked(item) {
			this.toggleShow();
			this.$emit("click", item);
		},
		handleClickIcon(e) {
			e.stopPropagation(); 
			this.toggleShow();
		}
	}
};
</script>
