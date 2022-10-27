<template>
	<LayoutContainer class="welcome-layout">
		<div class="welcome-content">
			<h1>Welcome to Nuon</h1>
			<p>
				Nuon is the first overcollateralized and decentralized stablecoin pegged to the value of inflation, protecting purchasing power. Connect a wallet to get started:
			</p>
			<TheWallet class="welcome-connect-wallet"/>
		</div>
	</LayoutContainer>
</template>
<script>
export default {
	name: "Welcome",
};
</script>
<style>
.welcome-layout {
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	padding-bottom: 4rem;
	width: 100%;
}
.welcome-content {
	width: 100%;
}
.welcome-content h1 {
	font-size: 4rem;
}
.welcome-content p {
	padding: 2rem 0 1rem 0;
	max-width: 500px;
	font-size: 1.15rem;
}
.welcome-connect-wallet {
	width: 200px;
}
</style>
