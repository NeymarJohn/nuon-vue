<template>
	<div class="range-slider">
		<input type="range" min="170" max="1000" value="170" class="range-slider__input">
		<LayoutFlex direction="row-space-between">
			<div class="range-slider__value">
				<h5>170%</h5>
				<p>Increased Risk</p>
			</div>
			<div class="range-slider__value">
				<h5>1000%</h5>
				<p>Decreased Risk</p>
			</div>
		</LayoutFlex>
	</div>
</template>

<script>
export default {
	name: "RangeSlider"
};
</script>
