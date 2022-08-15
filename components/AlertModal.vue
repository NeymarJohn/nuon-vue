<template>
	<TheModal
		v-show="isAlertModalVisible"
		:title="title"
		@close-modal="setModalVisibility('alertModal', false)">
		<div v-if="message">
			{{message}}
		</div>
		<div v-if="htmlContent" v-html="htmlContent" ></div>
		<LayoutFlex v-if="cta" class="u-mt-16" direction="row-space-around">
			<TheButton
				size="md u-min-width-230"
				title="Click to switch network"
				@click="ctaClicked">Switch Network</TheButton>
		</LayoutFlex>
		<p v-if="error" class="u-mt-16 u-is-warning">{{ error }}</p>
	</TheModal>
</template>

<script>
import { DEFAULT_CHAIN_ID } from "~/store/web3Store.ts";

export default {
	name: "AlertModal",
	data() {
		return {
			error: ""
		};
	},
	computed: {
		isAlertModalVisible() {
			return this.$store.state.modalStore.modalVisible.alertModal;
		},
		title() {
			return this.$store.state.modalStore.modalInfo.alertModal.title;
		},
		message() {
			return this.$store.state.modalStore.modalInfo.alertModal.message;
		},
		htmlContent() {
			return this.$store.state.modalStore.modalInfo.alertModal.htmlContent;
		},
		cta() {
			return this.$store.state.modalStore.modalInfo.alertModal.cta;
		},
		chainId() {
			return this.$store.state.web3Store.chainId;
		}
	},
	watch: {
		chainId(newVal) {
			if (newVal === DEFAULT_CHAIN_ID) {
				this.$store.commit("modalStore/setModalVisibility", {name: "alertModal", visibility: false});
				this.$store.commit("modalStore/setModalInfo",{name: "alertModal", info: {title:"", message: "", cta: "", htmlContent: ""}});
			}
		}
	},
	methods: {
		async switchNetwork() {
			try {
				const web3 = this.$store.getters["web3Store/instance"]();
				await web3.currentProvider.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: web3.utils.toHex(DEFAULT_CHAIN_ID)}],
				});
				this.$store.commit("modalStore/setModalVisibility", {name: "alertModal", visibility: false});
				this.$store.commit("modalStore/setModalInfo",{name: "alertModal", info: {title:"", message: "", cta: ""}});
			} catch (e) {
				if (e.code === 4902) {
					this.error = "This network is not available in your metamask. Please add it";
				}
			} finally {
				if (this.error) {
					setTimeout(() => {
						this.error = "";
					}, 5000);
				}
			}
		},
		ctaClicked() {
			if (this.cta === "switch-network") {
				this.switchNetwork();
			}
		}
	}
};
</script>
