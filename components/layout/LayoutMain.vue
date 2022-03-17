<template>
	<main class="l-main">
		<LayoutContainer color="grey" class="u-display-desktop u-position-sticky">
			<LayoutFlex direction="row-center-space-between">
				<TheLogo />
				<TheHamburger />
			</LayoutFlex>
		</LayoutContainer>
		<TheToast
			v-show="$store.state.rootStore.toast.show"
			:kind="$store.state.rootStore.toast.kind"
			:message="$store.state.rootStore.toast.message"
			:tx-hash="$store.state.rootStore.toast.txHash"
			:title="$store.state.rootStore.toast.title" />
		<slot />
	</main>
</template>

<script>
export default {
	name: "LayoutMain"
};
</script>
