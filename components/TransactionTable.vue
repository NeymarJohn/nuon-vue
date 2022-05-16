<template>
	<div :class="`transaction-table transaction-table--${size}`" role="table" :aria-label="aria">
		<div class="transaction-table__row" role="rowgroup">
			<div
				v-for="(column, index) in columns"
				:key="index"
				class="transaction-table__cell"
				role="columnheader">{{ column }}</div>
		</div>
		<div class="transaction-table__row" role="rowgroup">
			<div
				v-for="(row, index) in rows"
				:key="index"
				class="transaction-table__cell"
				role="cell">{{ row }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "TransactionTable",
	props: {
		columns: {
			type: Array,
			required: true,
		},
		rows: {
			type: Array,
			required: true,
		},
		aria: {
			type: String,
			required: true
		},
		size: {
			type: String,
			required: true
		}
	}
};
</script>
