<template>
	<div class="l-grid-account-balance">
		<div class="l-grid-account-balance__title">
			<slot name="panel-one" />
		</div>
		<div class="l-grid-account-balance__body">
			<slot name="panel-two" />
			<LayoutFlex>
				<slot name="panel-three" />
				<slot name="panel-four" />
				<slot name="panel-five" />
			</LayoutFlex>
		</div>
	</div>
</template>

<script>
export default {
	name: "LayoutAccountBalance",
};
</script>
