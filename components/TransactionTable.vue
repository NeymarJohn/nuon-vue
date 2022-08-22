<template>
	<div :class="`transaction-table transaction-table--${size}`" role="table" :aria-label="aria">
		<div class="transaction-table__row" role="rowgroup">
			<div
				v-for="(column, index) in config"
				:key="index"
				class="transaction-table__cell"
				role="columnheader">{{ column.title }}</div>
			<div v-if="actions.length > 0" class="transaction-table__cell" role="columnheader"></div>
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
				@click="handleClickRow(row)">
				<div
					v-for="(obj, idx) in config"
					:key="idx"
					class="transaction-table__cell"
					role="cell">
					<span v-if="obj.id === 'date'">{{ new Date(row[obj.id]) | formateDateTime }}</span>
					<template v-else-if="obj.id === 'transactionType'">
						<template v-if="tableData === 'collateral'">
							<span class="transaction-table__cell--marked">{{row[obj.id]}}</span>Nuon<span class="transaction-table__cell--marked">By {{row[obj.id] === 'Mint' ? 'Depositing' : 'Withdrawing'}}</span>{{`${row.depositToken.symbol}`}}
						</template>
						<template v-else-if="tableData === 'swap'">
							<span class="transaction-table__cell--marked">From</span>{{row.inputToken}}
							<span class="transaction-table__cell--marked">To</span>{{row.outputToken}}
						</template>
						<template v-else-if="tableData === 'boardroom'">
							<span class="transaction-table__cell--marked">Stake</span>{{row.inputToken}}
						</template>
						<template v-else-if="tableData === 'reward'">
							<span class="transaction-table__cell--marked">{{row.transactionType}}</span>
						</template>
					</template>
					<LayoutFlex v-else direction="row-center">
						<img v-if="misc.hasImage && misc.hasImage[obj.id]" :src="require(`~/assets/images/borrow/${misc.hasImage[obj.id][index]}.png`)" class="u-mr-8" height="24" width="24" alt="Token icon">
						<span v-if="obj.id === 'totalAmount' || obj.id === 'amount'">
							{{ row[obj.id] | toFixed |  numberWithCommas }}
							<span v-if="obj.id === 'amount'">{{row.inputToken}}</span>
							<span v-if="obj.id === 'totalAmount'">{{row.outputToken}}</span>
						</span>
						<template v-else-if="obj.id === 'collateralizationRatio'">
							<span :class="Number(row[obj.id]) < highRiskLevel ? 'u-color-error' : 'u-color-warning'">{{row[obj.id] }}%</span>
							<TheBadge v-if="Number(row[obj.id]) && Number(row[obj.id]) < highRiskLevel" color="high-risk">High Risk</TheBadge>
							<TheBadge v-else-if="Number(row[obj.id]) && Number(row[obj.id]) < mediumRiskLevel" color="medium-risk">Medium Risk</TheBadge>
							<TheBadge v-else color="low-risk">Low Risk</TheBadge>
						</template>
						<span v-else>{{ row[obj.id] }}</span>
					</LayoutFlex>
				</div>
				<div
					v-if="actions.length > 0"
					class="transaction-table__cell" role="cell">
					<TheButton
						v-for="action in actions"
						:key="action.label"
						size="xs"
						:title="`Click to ${action.label.toLowerCase()}`"
						@click="action.handler(row)">{{action.label}}</TheButton>
				</div>
			</div>
		</template>
		<template v-else>
			<div class="transaction-table__row--no-results" role="rowgroup">
				<div class="transaction-table__cell">
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
		},
		misc: {
			type: Object,
			required: false,
			default() {
				return {hasImage: {}};
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
		},
		actions: {
			type: Array,
			default: () => []
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
