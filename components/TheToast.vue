<template>
	<Transition name="toast-slide">
		<div :class="`toast toast--${kind}`">
			<div class="toast__header">
				<p>{{ title ? title : `Transaction ${kind}` }}</p>
				<TheButton
					title="Click to close toast"
					size="icon"
					aria-label="Close toast"
					@click="closeToast">
					<CloseIcon />
				</TheButton>
			</div>
			<div class="toast__body">
				<h4 v-if="message">{{ message }}</h4>
				<a v-if="txHash" :href="$config.blockExplorerUrl + 'tx/' + txHash" target="_blank" rel="noopener noreferrer" class="btn btn--link" title="Click to view transaction on the block explorer">View transaction on block explorer</a>
			</div>
		</div>
	</Transition>
</template>

<script>
import CloseIcon from "@/assets/images/svg/svg-close.svg";

export default {
	name: "TheToast",
	components: {
		CloseIcon,
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
