<template>
	<div class="l-grid-account-balance">
		<div class="l-grid-account-balance__panel-one">
			<slot name="panel-one" />
		</div>
		<div class="l-grid-account-balance__panel-two">
			<slot name="panel-two" />
		</div>
		<div class="l-grid-account-balance__panel-three">
			<slot name="panel-three" />
		</div>
		<div class="l-grid-account-balance__panel-four">
			<slot name="panel-four" />
		</div>
		<div class="l-grid-account-balance__panel-five">
			<slot name="panel-five" />
		</div>
		<div class="l-grid-account-balance__panel-six">
			<slot name="panel-six" />
		</div>
	</div>
</template>

<script>
export default {
	name: "LayoutAccountBalance",
};
</script>
