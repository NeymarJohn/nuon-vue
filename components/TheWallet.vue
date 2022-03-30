<template>
	<div class="wallet">
		<TheButton
			v-if="!isConnectedWallet"
			title="Click to connect wallet"
			@click="connect">
			Connect Wallet
		</TheButton>
		<TheButton
			v-else
			title="Click to disconnect wallet"
			@click="disconnect">
			<span>{{ shortAddress(connectedAccount) }}</span>
		</TheButton>
	</div>
</template>

<script>
export default {
	name: "TheWallet",
	data () {
		return {
			web3: null,
		};
	},
	computed: {
		balance() {
			return this.$store.state.web3Store.balance;
		}
	},
	mounted () {
		this.$store.dispatch("web3Store/init");
	},
	methods: {
		connect () {
			this.$store.commit("modalStore/setModalVisibility", {
				name: "connectWalletModal",
				visibility: true
			});
		},
		disconnect () {
			this.$store.dispatch("web3Store/disconnect");
		}
	}
};
</script>
