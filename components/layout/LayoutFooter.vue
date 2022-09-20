<template>
	<div class="l-footer">
		<slot />
		<AlertModal />
		<ConnectWalletModal />
	</div>
</template>

<script>
export default {
	name: "LayoutFooter"
};
</script>
