<template>
	<div>
		<LayoutContainer color="grey">
			<LayoutFlex class="u-mb-md u-m-mb-xs l-m-flex--column" direction="row-center-space-between">
				<h2 class="u-m-mb-xs">Collateral Vault</h2>
				<LayoutFlex>
					<NuxtLink class="btn btn--md" to="/swap?outputToken=HX" title="Click to buy HX">Buy HX</NuxtLink>
				</LayoutFlex>
			</LayoutFlex>
			<LayoutFlex class="l-m-flex--column u-mb-md">
				<DataCard class="u-mr-lg u-m-mb-xs u-m-mr-none">
					<p>Locked Collateral</p>
					<TheLoader component="h3">
						<h3>${{ numberWithCommas(lockedCollateral.toFixed(2)) }}</h3>
					</TheLoader>
					<TheButton
						size="unstyled"
						title="Click to view the token list"
						@click="setModalVisibility('collateralModal', true)">Token List</TheButton>
					<DefaultModal
						v-show="isCollateralModalVisible"
						title="Locked Collateral"
						@close-modal="setModalVisibility('collateralModal', false)">
						<CollateralTable />
					</DefaultModal>
				</DataCard>
				<DataCard class="u-mr-lg u-mb-xs u-m-mr-none">
					<p>My Minted Tokens</p>
					<TheLoader component="h3">
						<h3>{{ numberWithCommas(myMintedTokens.toFixed(2)) }}<sup>USX</sup></h3>
					</TheLoader>
					<TheLoader component="p">
						<p>${{ numberWithCommas(getDollarValue(myMintedTokens, usxPrice).toFixed(2)) }}</p>
					</TheLoader>
				</DataCard>
				<DataCard class="u-mr-lg u-m-mr-none">
					<p>My Collateral Ratio</p>
					<TheLoader component="h3">
						<h3>{{ numberWithCommas(myCollateralRatio.toFixed(2)) }}<sup>%</sup></h3>
					</TheLoader>
				</DataCard>
			</LayoutFlex>
		</LayoutContainer>
		<LayoutContainer>
			<h2 class="u-mb-xs u-m-mb-xs">Ecosystem Status</h2>
			<LayoutGrid class="u-mb-md u-m-mb-xs l-m-grid--column-1" :size="'3'">
				<StatCard>
					<h3 class="u-flex-row-center">USX Price <TooltipIcon v-tooltip="'Enter usx price tooltip content here.'" /></h3>
					<TheLoader component="h4">
						<h4>{{ numberWithCommas(usxPrice.toFixed(2)) }}</h4>
					</TheLoader>
				</StatCard>
				<StatCard>
					<h3 class="u-flex-row-center">Collateralization Ratio <TooltipIcon v-tooltip="'Enter collateralization ratio tooltip content here.'" /></h3>
					<LayoutFlex>
						<TheLoader component="h4-long u-mr-xs">
							<h4 class="u-mr-xs">Target {{ numberWithCommas(targetCollateralizationRatio.toFixed(2)) }}%</h4>
						</TheLoader>
						<TheLoader component="h4-long">
							<h4>Real {{ numberWithCommas(realCollateralizationRatio.toFixed(2)) }}%</h4>
						</TheLoader>
					</LayoutFlex>
				</StatCard>
				<StatCard>
					<h3 class="u-flex-row-center">APR <TooltipIcon v-tooltip="'Enter apr tooltip content here.'" /></h3>
					<LayoutFlex>
						<TheLoader component="h4-long u-mr-xs">
							<h4 class="u-mr-xs">Inflation {{ numberWithCommas(inflation.toFixed(2)) }}%</h4>
						</TheLoader>
						<TheLoader component="h4-long">
							<h4>Net {{ numberWithCommas(net.toFixed(2)) }}%</h4>
						</TheLoader>
					</LayoutFlex>
				</StatCard>
			</LayoutGrid>
			<LayoutFlex class="u-mb-xs u-m-mb-sm l-m-flex--column">
				<LayoutFlex direction="column" class="u-m-mb-xs">
					<h2 class="u-mb-xs u-flex-row-center">Manage Assets <TooltipIcon v-tooltip="'Enter manage assets tooltip content here.'" /></h2>
					<p>Instanly mint USX by depositing your collateral and redeem anytime.</p>
				</LayoutFlex>
			</LayoutFlex>
			<LayoutContainer size="sm">
				<CaldronToggle :minted-tokens="myMintedTokens" />
			</LayoutContainer>
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
			title: "Caldron | Ultrastable Money"
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
