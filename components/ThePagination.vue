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
				:title="`Click to view page ${page.name}`"
				:aria-label="`Go to page number ${page.name}`"
				:disabled="page.isDisabled"
				:class="{ active: isPageActive(page.name) }"
				@click="getCurrentPage(page.name)">
				{{ page.name }}
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
		total: {
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
		startPage() {
			if (this.currentPage === 1) {
				return 1;
			}
			if (this.currentPage === this.totalPages) {
				return this.totalPages - this.maxVisibleButtons + 1;
			}
			return this.currentPage - 1;
		},
		endPage() {
			return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
		},
		pages() {
			const range = [];
			for (let i = this.startPage; i <= this.endPage; i+= 1 ) {
				range.push({
					name: i,
					isDisabled: i === this.currentPage
				});
			}
			return range;
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
