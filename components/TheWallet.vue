<template>
	<div class="wallet">
		<TheButton
			v-if="!isConnectedWallet"
			title="Click to connect wallet"
			@click="connect">
			Connect Wallet
		</TheButton>
		<div v-else class="wallet__details">
			<Jazzicon
				:address="connectedAccount"
				:diameter="28" />
			<TheButton
				title="Click to disconnect wallet"
				@click="disconnect">
				<span>{{ shortAddress(connectedAccount) }}</span>
			</TheButton>
		</div>
	</div>
</template>

<script>
import Jazzicon from "vue-jazzicon";

export default {
	name: "TheWallet",
	components: {
		[Jazzicon.name]: Jazzicon,
	},
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
		async connect () {
			await this.$store.dispatch("web3Store/connect");
		},
		disconnect () {
			this.$store.dispatch("web3Store/disconnect");
		}
	}
};
</script>
