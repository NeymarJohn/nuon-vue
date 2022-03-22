<template>
	<DefaultModal
		v-show="isConnectWalletVisible"
		title="Choose a wallet to connect"
		@close-modal="setModalVisibility('connectWalletModal', false)"
	>
		<LayoutFlex direction="row-space-around">
			<LayoutFlex
				v-for="(wallet, index) in wallets"
				:key="index"
				class="icon-container l-flex--column-center"
				@click="walletClicked(wallet)">
				<component :is="require(`~/assets/images/svg/svg-${wallet}.svg`)" />
				<p class="icon-title">{{capitalize(wallet)}}</p>
			</LayoutFlex>
		</LayoutFlex>
	</DefaultModal>
</template>

<script>
export default {
	data() {
		return {
			wallets: ["metamask", "walletconnect"]
		};
	},
	computed: {
		isConnectWalletVisible() {
			return this.$store.state.modalStore.modalVisible.connectWalletModal;
		}
	},
	methods: {
		async walletClicked(wallet) {
			await this.$store.dispatch("web3Store/connect", wallet);
		}
	}
};
</script>
