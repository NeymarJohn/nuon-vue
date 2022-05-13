<template>
	<div>
		<TheTabs size="thin" color="dark">
			<TheTab title="Stake">
				<TransactionTable />
			</TheTab>
			<TheTab title="Unstake">
				<TransactionTable />
			</TheTab>
			<TheTab title="Proposal">
				<TransactionTable />
			</TheTab>
			<TheTab title="Votes">
				<TransactionTable />
			</TheTab>
		</TheTabs>
	</div>
</template>

<script>
export default {
	name: "TabBoardroom"
};
</script>
