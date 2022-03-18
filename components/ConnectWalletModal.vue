<template>
	<DefaultModal
		v-show="isConnectWalletVisible"
		title="Choose a wallet to connect"
		@close-modal="setModalVisibility('connectWalletModal', false)"
	>
		<div class="l-flex l-flex--row-space-around parent-container">
			<div
				v-for="(wallet, index) in wallets"
				:key="index"
				class="l-flex l-flex--column l-flex--align-items-center icon-container"
				@click="walletClicked(wallet)">
				<img
					:class="`icon ${index === 1 && 'solid-border'}`"
					:src="require(`~/assets/images/wallets/${wallet}-icon.png`)"
					alt="metamask icon" />
				<p class="icon-title">{{capitalize(wallet)}}</p>
			</div>
		</div>
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

<style>

</style>
