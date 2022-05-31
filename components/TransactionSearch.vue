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
			@input="setTransactionSearch" />
	</div>
</template>

<script>
export default {
	name: "TransactionSearch"
};
</script>
