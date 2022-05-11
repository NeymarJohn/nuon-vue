<template>
	<div>
		<LayoutContainer>
			<PageTitle class="u-mb-48">
				<h4>Dashboard</h4>
				<LayoutFlex direction="row-center">
					<TheButton
						size="icon"
						class="u-mr-24 u-no-transition u-p-0"
						title="Click to go back"
						@click="getPreviousPage"><ChevronLeftIcon /></TheButton>
					<h1>My Page</h1>
				</LayoutFlex>
			</PageTitle>
			<h2>Account Balance</h2>
		</LayoutContainer>
	</div>
</template>

<script>
import ChevronLeftIcon from "@/assets/images/svg/svg-chevron-left.svg";

export default {
	name: "MyPage",
	components: {
		ChevronLeftIcon,
	},
	head () {
		return {
			title: "My Page | Nuon"
		};
	},
};
</script>
