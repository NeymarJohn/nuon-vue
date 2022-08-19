<template>
	<NuxtLink to="/" class="logo" title="Click to visit dashboard">
		<NuonLogo />
	</NuxtLink>
</template>

<script>
import NuonLogo from "@/assets/images/logo/logo-nuon.svg";

export default {
	name: "TheLogo",
	components: {
		NuonLogo
	},
};
</script>
