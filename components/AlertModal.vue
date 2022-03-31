<template>
	<DefaultModal
		v-show="isAlertModalVisible"
		:title="title"
		@close-modal="setModalVisibility('alertModal', false)">
		<div v-if="message">
			{{message}}
		</div>
		<div v-if="htmlContent" v-html="htmlContent" >
		</div>
	</DefaultModal>
</template>
<script>
import DefaultModal from "./DefaultModal.vue";
export default {
	name: "AlertModal",
	components: { DefaultModal },
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
		}
	},
};
</script>
