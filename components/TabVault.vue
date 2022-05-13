<template>
	<div>
		<TheTabs size="thin" color="dark">
			<TheTab title="Mint">
				<TransactionTable
					size="7"
					aria="Vault minted transactions"
					:columns="['Token Type', 'Amount', 'Minted', 'Fees', 'Final Amount', 'Date', 'TX Status']" />
			</TheTab>
			<TheTab title="Redeem">
				<TransactionTable
					size="7"
					aria="Vault redeemed transactions"
					:columns="['Token Type', 'Amount', 'Minted', 'Fees', 'Final Amount', 'Date', 'TX Status']" />
			</TheTab>
		</TheTabs>
	</div>
</template>

<script>
export default {
	name: "TabVault"
};
</script>
