<template>
	<div class="l-footer">
		<slot />
		<AlertModal/>
	</div>
</template>

<script>
import AlertModal from "../AlertModal.vue";
export default {
	name: "LayoutFooter",
	components: { AlertModal }
};
</script>
