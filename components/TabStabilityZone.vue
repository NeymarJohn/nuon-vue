<template>
	<div>
		<TheTabs size="thin" color="dark">
			<TheTab title="Above Peg">
				<TransactionTable
					size="6"
					aria="Stability zone above peg transactions"
					:columns="['Token Type', 'Amount', 'Fees', 'Final Amount', 'Date', 'TX Status']" />
			</TheTab>
			<TheTab title="Below Peg">
				<TransactionTable
					size="6"
					aria="Stability zone below peg transactions"
					:columns="['Token Type', 'Amount', 'Fees', 'Final Amount', 'Date', 'TX Status']" />
			</TheTab>
		</TheTabs>
	</div>
</template>

<script>
export default {
	name: "TabStabilityZone"
};
</script>
