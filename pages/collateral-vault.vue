<template>
	<div>
		<LayoutContainer>
			<LayoutFlex class="u-mb-48 l-flex-column-start-sm" direction="row-center-space-between">
				<PageTitle>
					<h4>Collateral Vault</h4>
					<h1>My Assets</h1>
				</PageTitle>
				<NuxtLink class="btn btn--ghost" to="/swap?outputToken=HX" title="Click to buy HX">Buy HX</NuxtLink>
			</LayoutFlex>
			<LayoutInfo size="3">
				<DataCard>
					<label>My Total Locked Collateral</label>
					<TheLoader component="h1">
						<h3>${{ numberWithCommas(lockedCollateral.toFixed(2)) }}</h3>
					</TheLoader>
					<TheButton
						size="unstyled"
						title="Click to view the token list"
						@click="setModalVisibility('collateralModal', true)">Token List</TheButton>
					<TheModal
						v-show="isCollateralModalVisible"
						title="Locked Collateral"
						@close-modal="setModalVisibility('collateralModal', false)">
						<CollateralTable />
					</TheModal>
				</DataCard>
				<DataCard>
					<label>My Minted Tokens</label>
					<TheLoader component="h1">
						<h3>{{ numberWithCommas(myMintedTokens.toFixed(2)) }}<sup>USX</sup></h3>
					</TheLoader>
					<TheLoader component="h5">
						<h5>${{ numberWithCommas(getDollarValue(myMintedTokens, usxPrice).toFixed(2)) }}</h5>
					</TheLoader>
				</DataCard>
				<DataCard>
					<label>My Collateral Ratio</label>
					<TheLoader component="h1">
						<h3>{{ numberWithCommas(myCollateralRatio.toFixed(2)) }}<sup>%</sup></h3>
					</TheLoader>
				</DataCard>
			</LayoutInfo>
		</LayoutContainer>
		<LayoutContainer class="u-pt-48">
			<h2 class="u-mb-20 u-mb-lg-14">Ecosystem Status</h2>
			<LayoutGrid class="u-mb-48" :size="'3-stretch-alt'">
				<StatCard class="u-mb-sm-12">
					<label>USX Price<TooltipIcon v-tooltip="'Enter usx price tooltip content here.'" /></label>
					<TheLoader component="h3">
						<h3>{{ numberWithCommas(usxPrice.toFixed(2)) }}</h3>
					</TheLoader>
				</StatCard>
				<StatCard class="u-mb-sm-12">
					<label>Collateralization Ratio<TooltipIcon v-tooltip="'Enter collateralization ratio tooltip content here.'" /></label>
					<LayoutFlex>
						<TheLoader component="h3">
							<h3 class="u-mr-32">Target {{ numberWithCommas(targetCollateralizationRatio.toFixed(2)) }}%</h3>
						</TheLoader>
						<TheLoader component="h3">
							<h3>Real {{ numberWithCommas(realCollateralizationRatio.toFixed(2)) }}%</h3>
						</TheLoader>
					</LayoutFlex>
				</StatCard>
				<StatCard>
					<label>APR<TooltipIcon v-tooltip="'Enter apr tooltip content here.'" /></label>
					<LayoutFlex>
						<TheLoader component="h3">
							<h3 class="u-mr-32">Inflation {{ numberWithCommas(inflation.toFixed(2)) }}%</h3>
						</TheLoader>
						<TheLoader component="h3">
							<h3>Net {{ numberWithCommas(net.toFixed(2)) }}%</h3>
						</TheLoader>
					</LayoutFlex>
				</StatCard>
			</LayoutGrid>
			<PageTitle>
				<h2>Manage Assets<TooltipIcon v-tooltip="'Enter manage assets tooltip content here.'" /></h2>
				<p>Instanly mint USX by depositing your collateral and redeem anytime.</p>
			</PageTitle>
		</LayoutContainer>
		<LayoutContainer size="sm">
			<CollateralToggle :minted-tokens="myMintedTokens" />
		</LayoutContainer>
	</div>
</template>

<script>
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";

export default {
	name: "TheCaldron",
	components: {
		TooltipIcon
	},
	data () {
		return {
			lockedCollateral: 102886,
			myMintedTokens: 1249,
			targetCollateralizationRatio: 170,
			realCollateralizationRatio: 150,
			myCollateralRatio: 0,
			usxPrice: 0,
			inflation: 34.09,
			net: 3.56
		};
	},
	head () {
		return {
			title: "Collateral Vault | Caldron"
		};
	},
	computed: {
		isCollateralModalVisible() {
			return this.$store.state.modalStore.modalVisible.collateralModal;
		},
	},
	async mounted() {
		this.usxPrice = parseFloat(await this.$store.getters["stabilityFlashStore/getUSXPriceInDAI"]);
	}
};
</script>
