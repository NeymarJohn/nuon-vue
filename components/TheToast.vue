<template>
	<Transition name="toast-slide">
		<div :class="`toast toast--${kind}`">
			<div class="toast__header">
				<span>
					<SuccessIcon v-if="kind === 'success'" />
					<ErrorIcon v-if="kind === 'failure'" />
					<h4>{{ title ? title : `Transaction ${kind}` }}</h4>
				</span>
				<TheButton
					title="Click to close toast"
					size="icon"
					aria-label="Close toast"
					@click="closeToast">
					<CloseIcon />
				</TheButton>
			</div>
			<div class="toast__body">
				<p v-if="message">{{ message }}.</p>
				<a v-if="txHash" :href="`${explorerLink}/tx/${txHash}`" target="_blank" rel="noopener noreferrer" title="Click to view transaction on the block explorer">View transaction</a>
			</div>
		</div>
	</Transition>
</template>

<script>
import CloseIcon from "@/assets/images/svg/svg-close.svg";
import SuccessIcon from "@/assets/images/svg/svg-success.svg";
import ErrorIcon from "@/assets/images/svg/svg-error.svg";
import { CHAIN_DATA } from "~/constants/web3";

export default {
	name: "TheToast",
	components: {
		CloseIcon,
		SuccessIcon,
		ErrorIcon
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
	computed: {
		explorerLink() {
			if (!CHAIN_DATA[this.$store.state.web3Store.chainId]) return "";
			return CHAIN_DATA[this.$store.state.web3Store.chainId].explorerLink;
		}
	},
	methods: {
		closeToast () {
			this.$store.commit("rootStore/setToast", {...this.$store.state.rootStore.toast, show: false});
		},
	}
};
</script>
