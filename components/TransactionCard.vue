<template>
	<div>
		<div class="transaction-card">
			<div class="transaction-card__header">
				<p v-for="(column, index) in config" :key="index">{{ column.title }}</p>
			</div>
			<div
				v-for="(row, index) in data.slice((currentPage - 1) * 1, currentPage * 1)"
				:key="index"
				class="transaction-card__body">
				<p v-for="(obj, idx) in config" :key="idx">
					<span v-if="obj.id === 'date'">{{ new Date(row[obj.id]).toLocaleDateString() }}</span>
					<span v-else>{{ row[obj.id] }}</span>
				</p>
			</div>
		</div>
		<ThePagination
			v-if="data.length"
			:max-visible-buttons="3"
			:total-pages="Math.ceil(data.length / 10)"
			:per-page="10"
			:current-page="currentPage"
			@pagechanged="onPageChange" />
	</div>
</template>

<script>
export default {
	name: "TransactionCard",
	props: {
		data: {
			type: Array,
			required: true
		},
		config: {
			type: Array,
			required: true
		},
	},
	data() {
		return {
			currentPage: 1
		};
	},
};
</script>
