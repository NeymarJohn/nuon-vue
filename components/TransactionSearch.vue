<template>
	<div class="transaction-search">
		<input
			:value="transactionSearch"
			type="text"
			class="transaction-search__input"
			placeholder="Search transaction history"
			autocomplete="off"
			autocorrect="off"
			spellcheck="false"
			@input="debounceInput" />
	</div>
</template>

<script>
import debounce from "lodash.debounce";
export default {
	name: "TransactionSearch",
	methods: {
		debounceInput: debounce(function(e) {
			this.setTransactionSearch(e); 
		}, 500)
	},
};
</script>
