<template>
	<div :class="`transaction-table transaction-table--${size}`" role="table" :aria-label="aria">
		<div class="transaction-table__row" role="rowgroup">
			<div
				v-for="(column, index) in config"
				:key="index"
				class="transaction-table__cell"
				role="columnheader">{{ column.title }}</div>
		</div>
		<div v-for="(row, index) in data.slice((currentPage - 1) * 10, currentPage * 10)" :key="index" class="transaction-table__row" role="rowgroup">
			<div
				v-for="(obj, idx) in config"
				:key="idx"
				class="transaction-table__cell"
				role="cell">
				<span v-if="obj.id === 'date'">{{ new Date(row[obj.id]).toLocaleDateString() }}</span>
				<span v-else>{{ row[obj.id] }}</span>
			</div>
		</div>
		<ThePagination
			:max-visible-buttons="10"
			:total-pages="Math.ceil(data.length / 10)"
			:per-page="10"
			:current-page="currentPage"
			@pagechanged="onPageChange" />
	</div>
</template>

<script>
export default {
	name: "TransactionTable",
	props: {
		data: {
			type: Array,
			required: true
		},
		config: {
			type: Array,
			required: true
		},
		aria: {
			type: String,
			required: true
		},
		size: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			currentPage: 1
		};
	},
	methods: {
		onPageChange(page) {
			this.currentPage = page;
		}
	}
};
</script>
