<template>
	<LayoutFlex direction="row-space-between">
		<TheButton v-for="(item, idx) in items" :key="idx" size="xs" :title="`Click to ${item.label}`" @click="itemClicked(item)">{{item.label}}</TheButton>
	</LayoutFlex>
</template>

<script>
export default{
	name: "TransactionTableButtons",
	props: {
		items: {
			type: Array,
			default: () => []
		}
	},
	methods: {
		itemClicked(item) {
			this.$emit("click", item);
		},
	}
};
</script>
