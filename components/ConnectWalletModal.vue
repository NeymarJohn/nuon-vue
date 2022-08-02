<template>
	<TheModal
		v-show="isConnectWalletVisible"
		title="Connect Wallet"
		subtitle="Choose a wallet to connect"
		class="modal--connect"
		@close-modal="setModalVisibility('connectWalletModal', false)">
		<LayoutFlex direction="row-space-around">
			<LayoutFlex
				v-for="(wallet, index) in wallets"
				:key="index"
				class="u-cursor-pointer"
				direction="column-center"
				@click="walletClicked(wallet)">
				<component :is="require(`~/assets/images/svg/svg-${wallet}.svg`)" class="u-mb-16"/>
				<h5>{{capitalize(wallet)}}</h5>
			</LayoutFlex>
		</LayoutFlex>
	</TheModal>
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
			await this.$store.dispatch("web3Store/connect",
				{
					wallet,
					onError: (e) => {
						this.failureToast(null, e, "Wallet connection failed");
					}
				}
			);
			this.$store.dispatch("web3Store/wrongNetwork");
		}
	}
};
</script>
