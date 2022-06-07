<template>
	<div class="borrow-card">
		<div class="borrow-card__asset">
			<div class="borrow-card__image">
				<img :src="require(`~/assets/images/borrow/${token}.png`)" :alt="`${token} logo`">
				<p>{{ token }}</p>
			</div>
			<div class="borrow-card__text">
				<p>With 145.00 {{ token }}</p>
				<h5>Mint Up To <br />{{ mint | toFixed | numberWithCommas }} NUON</h5>
			</div>
		</div>
		<div class="borrow-card__info">
			<p>Min. Collateral Ratio</p>
			<h4>{{ ratio | toFixed | numberWithCommas }}%</h4>
		</div>
		<div class="borrow-card__info u-mb-24">
			<p>TVL</p>
			<h4>${{ tvl | toFixed | numberWithCommas }}</h4>
		</div>
		<NuxtLink to="/collateral-hub/collateral" class="btn btn--md" title="Click to deposit/redeem assets">Deposit/Redeem</NuxtLink>
	</div>
</template>

<script>
export default {
	name: "BorrowCard",
	props: {
		token: {
			type: String,
			required: true
		},
		ratio: {
			type: Number,
			required: true
		},
		tvl: {
			type: Number,
			required: true
		},
		mint: {
			type: Number,
			required: true
		}
	},
};
</script>
