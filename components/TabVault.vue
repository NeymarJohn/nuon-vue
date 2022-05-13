<template>
	<div>
		<TheTabs size="thin" color="dark">
			<TheTab title="Mint">
				<TransactionTable />
			</TheTab>
			<TheTab title="Redeem">
				<TransactionTable />
			</TheTab>
		</TheTabs>
	</div>
</template>

<script>
export default {
	name: "TabVault"
};
</script>
