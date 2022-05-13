<template>
	<div>
		<TheTabs size="thin" color="dark">
			<TheTab title="Above Peg">
				<TransactionTable />
			</TheTab>
			<TheTab title="Below Peg">
				<TransactionTable />
			</TheTab>
		</TheTabs>
	</div>
</template>

<script>
export default {
	name: "TabStabilityZone"
};
</script>
