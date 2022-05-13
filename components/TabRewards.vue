<template>
	<div>
		<TheTabs size="thin" color="dark">
			<TheTab title="Stake HX">
				<TransactionTable />
			</TheTab>
			<TheTab title="Burn HX">
				<TransactionTable />
			</TheTab>
		</TheTabs>
	</div>
</template>

<script>
export default {
	name: "TabRewards"
};
</script>
