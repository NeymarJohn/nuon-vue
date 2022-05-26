<template>
	<ul class="pagination">
		<li>
			<TheButton
				size="icon"
				title="Click to view first page"
				aria-label="Go to first page"
				:disabled="isFirstPage"
				@click="getFirstPage">
				<ChevronLeftDoubleIcon />
			</TheButton>
		</li>
		<li>
			<TheButton
				size="icon"
				title="Click to view previous page"
				aria-label="Go to previous page"
				:disabled="isFirstPage"
				@click="getPreviousPage">
				<ChevronLeftIcon />
			</TheButton>
		</li>
		<li v-for="(page, index) in pages" :key="index">
			<TheButton
				size="icon"
				:title="`Click to view page ${page}`"
				:aria-label="`Go to page number ${page}`"
				:disabled="page.isDisabled"
				:class="{ active: isPageActive(page) }"
				@click="getCurrentPage(page)">
				{{ page }}
			</TheButton>
		</li>
		<li>
			<TheButton
				size="icon"
				title="Click to view next page"
				aria-label="Go to next page"
				:disabled="isLastPage"
				@click="getNextPage">
				<ChevronRightIcon />
			</TheButton>
		</li>
		<li>
			<TheButton
				size="icon"
				title="Click to view last page"
				aria-label="Go to last page"
				:disabled="isLastPage"
				@click="getLastPage">
				<ChevronRightDoubleIcon />
			</TheButton>
		</li>
	</ul>
</template>

<script>
import ChevronLeftIcon from "@/assets/images/svg/svg-chevron-left.svg";
import ChevronLeftDoubleIcon from "@/assets/images/svg/svg-chevron-left-double.svg";
import ChevronRightIcon from "@/assets/images/svg/svg-chevron-right.svg";
import ChevronRightDoubleIcon from "@/assets/images/svg/svg-chevron-right-double.svg";

export default {
	name: "ThePagination",
	components: {
		ChevronLeftIcon,
		ChevronLeftDoubleIcon,
		ChevronRightIcon,
		ChevronRightDoubleIcon
	},
	props: {
		maxVisibleButtons: {
			type: Number,
			required: false,
			default: 3
		},
		totalPages: {
			type: Number,
			required: true
		},
		perPage: {
			type: Number,
			required: true
		},
		currentPage: {
			type: Number,
			required: true
		},
	},
	computed: {
		pages() {
			const minPages = this.totalPages < this.maxVisibleButtons ? this.totalPages : this.maxVisibleButtons;
			let buttons = new Array(minPages).fill(0);

			if (this.currentPage < minPages) { // number is either on start or end or in between range
				buttons[0] = 1;
				buttons.forEach((_, i) => {
					if (i !== 0) buttons[i] = buttons[i - 1] + 1;
				});
			} else { // number is on end
				buttons[0] = this.currentPage;
				buttons.forEach((_, i) => {
					if (i !== 0) buttons[i] = buttons[i - 1] - 1;
				});

				buttons = buttons.reverse();
			}

			return buttons;
		},
		isFirstPage() {
			return this.currentPage === 1;
		},
		isLastPage() {
			return this.currentPage === this.totalPages;
		},
	},
	methods: {
		getFirstPage() {
			this.$emit("pagechanged", 1);
		},
		getPreviousPage() {
			this.$emit("pagechanged", this.currentPage - 1);
		},
		getCurrentPage(page) {
			this.$emit("pagechanged", page);
		},
		getNextPage() {
			this.$emit("pagechanged", this.currentPage + 1);
		},
		getLastPage() {
			this.$emit("pagechanged", this.totalPages);
		},
		isPageActive(page) {
			return this.currentPage === page;
		},
	}
};
</script>
