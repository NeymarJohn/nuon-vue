<template>
	<div class="borrow-card">
		<div class="borrow-card__asset">
			<div class="borrow-card__image">
				<img :src="require(`~/assets/images/borrow/${token}.png`)" :alt="`${token} logo`">
				<p>{{ token }}</p>
			</div>
			<div class="borrow-card__text">
				<p>With 1 {{ token }}</p>
				<h5>Mint {{ mint | toFixed | numberWithCommas }} NUON</h5>
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
		<LayoutFlex direction="center-space-between" class="u-mb-32 u-mb-sm-0 l-flex--column-md">
			<NuxtLink to="/collateral-hub/collateral" class="btn btn--md u-mr-24 u-mr-md-0 u-mb-md-12" title="Click to deposit assets">Deposit</NuxtLink>
			<NuxtLink to="/collateral-hub/collateral" class="btn btn--md" title="Click to redeem assets" disabled>Redeem</NuxtLink>
		</LayoutFlex>
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
