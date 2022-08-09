<template>
	<div :class="`transaction-table transaction-table--${size}`" role="table" :aria-label="aria">
		<div class="transaction-table__row" role="rowgroup">
			<div
				v-for="(column, index) in config"
				:key="index"
				class="transaction-table__cell"
				role="columnheader">{{ column.title }}
				<TooltipIcon v-if="misc.headerTooltips && misc.headerTooltips[column.id]" v-tooltip="misc.headerTooltips[column.id]" class="tooltip--table-header" />
			</div>
		</div>
		<div v-if="loading" class="transaction-table__row"  role="rowgroup">
			<div
				v-for="(obj, idx) in config"
				:key="idx"
				class="transaction-table__cell"
				role="cell">
				<ComponentLoader component="h3" :loaded="false" slot-classes="l-flex l-flex--row-center-space-between" />
			</div>
		</div>
		<template v-else-if="data.length">
			<div
				v-for="(row, index) in data.slice((currentPage - 1) * 10, currentPage * 10)"
				:key="index"
				class="transaction-table__row"
				role="rowgroup"
				@click="handleClickRow(row)"
			>
				<div
					v-for="(obj, idx) in config"
					:key="idx"
					class="transaction-table__cell"
					role="cell">
					<span v-if="obj.id === 'date'">{{ new Date(row[obj.id]) | formateDateTime }}</span>
					<span v-else-if="obj.id === 'transactionType'">
						<template v-if="tableData === 'collateral'">
							<span  class="transaction-table__cell_marked">{{row[obj.id]}}</span> Nuon
							<span  class="transaction-table__cell_marked">By {{row[obj.id] === 'Mint' ? 'Deposit' : 'Withdraw'}}</span><span>{{` ${row.depositToken.symbol}`}}</span>
						</template>
						<template v-else-if="tableData === 'swap'">
							<span  class="transaction-table__cell_marked">From</span><span> {{row.inputToken}}</span>
							<span  class="transaction-table__cell_marked">To</span><span> {{row.outputToken}}</span>
						</template>
						<template v-else-if="tableData === 'boardroom'">
							<span  class="transaction-table__cell_marked">Stake</span><span> {{row.inputToken}}</span>
						</template>
						<template v-else-if="tableData === 'reward'">
							<span  class="transaction-table__cell_marked">{{row.transactionType}}</span>
						</template>
					</span>
					<span v-else class="l-flex l-flex--row-center">
						<img v-if="misc.hasImage && misc.hasImage[obj.id]" :src="require(`~/assets/images/borrow/${misc.hasImage[obj.id][index]}.png`)" class="u-mr-8" height="17" width="17" alt="">
						<span v-if="obj.id === 'totalAmount' || obj.id === 'amount'">
							{{ row[obj.id] | toFixed |  numberWithCommas }}
							<span v-if="obj.id === 'amount'">{{row.inputToken}}</span>
							<span v-if="obj.id === 'totalAmount'">{{row.outputToken}}</span>
						</span>
						<span v-else>{{ row[obj.id] }}</span>
					</span>
				</div>
			</div>
		</template>
		<template v-else>
			<div class="transaction-table__row" role="rowgroup">
				<div class="transaction-table__cell u-full-width u-text-center">
					<span>No transaction records found</span>
				</div>
			</div>
		</template>
		<ThePagination
			v-if="data.length && data.length > 10"
			:max-visible-buttons="10"
			:total-pages="Math.ceil(data.length / 10)"
			:per-page="10"
			:current-page="currentPage"
			@pagechanged="onPageChange" />
	</div>
</template>

<script>
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "TransactionTable",
	components: {
		TooltipIcon
	},
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
		},
		misc: {
			type: Object,
			required: false,
			default() {
				return {hasImage: {}, headerTooltips: {}};
			}
		},
		tableData: {
			type: String,
			default() {
				return "";
			}
		},
		loading: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			currentPage: 1
		};
	},
	methods: {
		handleClickRow(row) {
			if (!row.txHash) return;
			const explorerLink = this.$store.getters["web3Store/explorerLink"];
			window.open(`${explorerLink}/tx/${row.txHash}`, "_blank");
		}
	},
};
</script>
