<template>
	<Transition name="toast-slide">
		<div class="toast" :style="{ backgroundColor: kind === 'success' ? '#2ecc71' : '#e74c3c' }">
			<LayoutFlex direction="row-start-space-between">
				<div>
					<p>{{ title ? title : `Transaction ${kind}` }}</p>
					<h3 v-if="message">{{ message }}</h3>
					<a v-if="txHash" :href="$config.blockExplorerUrl + 'tx/' + txHash" target="_blank" rel="noopener noreferrer">
						Click to view transaction on block explorer <ExternalLinkIcon />
					</a>
				</div>
				<TheButton
					title="Click to close toast"
					size="icon"
					aria-label="Close toast"
					@click="closeToast">
					<CloseIcon />
				</TheButton>
			</LayoutFlex>
		</div>
	</Transition>
</template>

<script>
import CloseIcon from "@/assets/images/svg/svg-close.svg";
import ExternalLinkIcon from "@/assets/images/svg/svg-external-link.svg";

export default {
	name: "TheToast",
	components: {
		CloseIcon,
		ExternalLinkIcon
	},
	props: {
		kind: {
			type: String,
			required: true,
			validator(value) {
				return ["success", "failure", ""].includes(value);
			},
			default: "success"
		},
		message: {
			type: String,
			required: false,
			default: ""
		},
		txHash: {
			type: String,
			required: false,
			default: ""
		},
		title: {
			type: String,
			required: false,
			default: ""
		}
	},
	methods: {
		closeToast () {
			this.$store.commit("rootStore/setToast", {...this.$store.state.rootStore.toast, show: false});
		},
	}
};
</script>
