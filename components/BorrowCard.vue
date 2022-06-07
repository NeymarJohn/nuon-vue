<template>
	<div class="borrow-card">
		<div class="borrow-card__asset">
			<div class="borrow-card__image">
				<EthereumLogo />
				<p>ETH</p>
			</div>
			<div class="borrow-card__text">
				<p>With 145.00 ETH</p>
				<h5>Mint Up To 151,000.00 NUON</h5>
			</div>
		</div>
		<div class="borrow-card__info">
			<p>Min Coll. Ratio</p>
			<h4>170.00%</h4>
		</div>
		<div class="borrow-card__info u-mb-24">
			<p>TVL</p>
			<h4>$1,243.00</h4>
		</div>
		<TheButton title="Click to deposit/redeem assets">Deposit/Redeem</TheButton>
	</div>
</template>

<script>
import EthereumLogo from "@/assets/images/borrow/borrow-ethereum.svg";

export default {
	name: "BorrowCard",
	components: {
		EthereumLogo
	},
};
</script>
