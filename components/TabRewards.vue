<template>
	<div>
		<TheTabs size="thin" color="dark">
			<TheTab title="Stake HX">
				<TransactionTable
					size="6"
					aria="Staked HX reward transactions"
					:columns="['Reward Token', 'Reward Amount', 'Fees', 'Total Claimed', 'Date', 'TX Status']" />
			</TheTab>
			<TheTab title="Burn HX">
				<TransactionTable
					size="7"
					aria="Burned HX reward transactions"
					:columns="['Reward Token', 'Reward Amount', 'Claim Ratio', 'Fees', 'Total Claimed', 'Date', 'TX Status']" />
			</TheTab>
		</TheTabs>
	</div>
</template>

<script>
export default {
	name: "TabRewards"
};
</script>
