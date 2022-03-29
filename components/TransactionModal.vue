<template>
	<Transition name="modal-fade">
		<div class="modal" role="dialog" aria-labelledby="transactionModalTitle" aria-describedby="transactionModalDescription">
			<div class="modal__overlay" @click="closeModal"></div>
			<div class="modal__container">
				<header id="transactionModalTitle" class="modal__header">
					<div>
						<h2>{{ title }}</h2>
						<p v-if="subtitle">{{ subtitle }}</p>
					</div>
					<TheButton
						title="Click to close modal"
						size="icon"
						aria-label="Close modal"
						@click="closeModal">
						<CloseIcon />
					</TheButton>
				</header>
				<section id="transactionModalDescription" class="modal__body">
					<slot />
				</section>
			</div>
		</div>
	</Transition>
</template>

<script>
import CloseIcon from "@/assets/images/svg/svg-close.svg";

export default {
	name: "TransactionModal",
	components: {
		CloseIcon
	},
	props: {
		title: {
			type: String,
			required: true
		},
		subtitle: {
			type: String,
			required: false
		},
	},
	mounted () {
		document.addEventListener("keyup", (e) => {
			if (e.key === "Escape" || e.key === "Esc" || e.key === 27) {
				this.closeModal();
			}
		});
	},
	methods: {
		closeModal () {
			this.$emit("close-modal");
		},
	}
};
</script>
