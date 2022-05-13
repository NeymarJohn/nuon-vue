<template>
	<div>
		<TransactionTable
			size="8"
			aria="Swap transactions"
			:columns="['From', 'To', 'Max Slippage', 'Min. Received', 'Price Impace', 'Fees', 'Date', 'TX Status']" />
	</div>
</template>

<script>
export default {
	name: "TabSwap"
};
</script>
