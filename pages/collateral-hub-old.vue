<template>
	<div>
		<LayoutContainer>
			<LayoutFlex class="u-mb-48 l-flex-column-start-sm" direction="row-center-space-between">
				<PageTitle>
					<h4>Collateral Hub</h4>
					<h1>My Assets</h1>
				</PageTitle>
				<NuxtLink class="btn btn--md" to="/swap?outputToken=HX" title="Click to buy HX">Buy HX</NuxtLink>
			</LayoutFlex>
			<LayoutInfo size="3">
				<DataCard>
					<label>My Total Locked Collateral</label>
					<TheLoader component="h1">
						<h3>${{ userTVL | toFixed | numberWithCommas }}</h3>
					</TheLoader>
					<TheButton
						size="link"
						title="Click to view the token list"
						@click="setModalVisibility('collateralModal', true)">Token List</TheButton>
					<TheModal
						v-show="isCollateralModalVisible"
						class="modal--collateral-table"
						title="Token List"
						@close-modal="setModalVisibility('collateralModal', false)">
						<CollateralTable />
					</TheModal>
				</DataCard>
				<DataCard>
					<label>My Minted Tokens</label>
					<TheLoader component="h1">
						<h3>{{ userMintedAmount | toFixed | numberWithCommas }}<sup>Nuon</sup></h3>
					</TheLoader>
					<TheLoader component="h5">
						<h5>${{ getDollarValue(userMintedAmount, usxPrice) | toFixed | numberWithCommas }}</h5>
					</TheLoader>
				</DataCard>
			</LayoutInfo>
		</LayoutContainer>
		<LayoutContainer class="u-pt-48">
			<h2 class="u-mb-20 u-mb-lg-14">Ecosystem Status</h2>
			<LayoutGrid class="u-mb-48" :size="'3-stretch-alt'">
				<StatCard class="u-mb-md-12">
					<label>Nuon Price<TooltipIcon v-tooltip="'Enter Nuon price tooltip content here.'" /></label>
					<TheLoader component="h3">
						<h3>{{ usxPrice | toFixed | numberWithCommas }}</h3>
					</TheLoader>
				</StatCard>
				<StatCard class="u-mb-md-12">
					<label>Collateralization Ratio<TooltipIcon v-tooltip="'Enter collateralization ratio tooltip content here.'" /></label>
					<LayoutFlex>
						<TheLoader component="h3 u-mr-32">
							<h3 class="u-mr-32">{{ numberWithCommas(collateralizationRatio.toFixed(2)) }}%</h3>
						</TheLoader>
					</LayoutFlex>
				</StatCard>
				<StatCard>
					<label>APR<TooltipIcon v-tooltip="'Enter apr tooltip content here.'" /></label>
					<LayoutFlex>
						<TheLoader component="h3 u-mr-32">
							<h3 class="u-mr-32">Inflation {{ numberWithCommas(inflation.toFixed(2)) }}%</h3>
						</TheLoader>
						<TheLoader component="h3">
							<h3>Net {{ numberWithCommas(dailyInflationRate.toFixed(2)) }}%</h3>
						</TheLoader>
					</LayoutFlex>
				</StatCard>
			</LayoutGrid>
			<PageTitle>
				<h2>Manage Assets<TooltipIcon v-tooltip="'Enter manage assets tooltip content here.'" /></h2>
				<p>Instanly mint Nuon by depositing your collateral and redeem anytime.</p>
			</PageTitle>
		</LayoutContainer>
		<LayoutContainer size="sm">
			<CollateralToggle :minted-tokens="userTVL" />
		</LayoutContainer>
	</div>
</template>

<script>
import TooltipIcon from "@/assets/images/svg/svg-tooltip.svg";
import { fromWei } from "~/utils/bnTools";

export default {
	name: "TheCaldron",
	components: {
		TooltipIcon
	},
	data () {
		return {
			userTVL: 0,
			collateralizationRatio: 0,
			net: 3.56,
			collateralAddresses: []
		};
	},
	head () {
		return {
			title: "Collateral Hub | Nuon"
		};
	},
	computed: {
		usxPrice() {
			return this.tokenPrices.USX;
		},
		userJustMinted() {
			return this.$store.state.collateralVaultStore.userJustMinted;
		},
		isCollateralModalVisible() {
			return this.$store.state.modalStore.modalVisible.collateralModal;
		},
		userMintedAmount() {
			return parseFloat(this.$store.getters["erc20Store/usxBalance"]);
		},
		inflation() {
			return this.$store.state.collateralVaultStore.inflation / 10;
		},
		dailyInflationRate() {
			return this.$store.state.collateralVaultStore.dailyInflationRate / 10;
		}
	},
	watch: {
		connectedAccount(newValue) {
			this.getUserTVL(newValue);
		},
		userJustMinted(newValue) {
			if (newValue) {
				this.getUserTVL(this.connectedAccount);
				this.$store.commit("collateralVaultStore/setUserJustMinted", false);
			}
		}
	},
	async mounted() {
		this.getUserTVL(this.connectedAccount);
		this.collateralizationRatio = (1 / parseFloat(fromWei(await this.$store.getters["collateralVaultStore/getGlobalCollateralRatio"]()))) * 100;
	},
	methods: {
		async getUserTVL(userAddress) {
			if (this.connectedAccount) {
				this.userTVL = 0;
				this.collateralAddresses = await this.$store.getters["collateralVaultStore/getCollaterals"]();
				this.collateralAddresses.forEach(async (_, idx) => {
					const userAmounts = await this.$store.getters["collateralVaultStore/getUserAmounts"](userAddress, idx);
					const weiBalance = userAmounts[0];
					const usdBalance = fromWei(weiBalance);
					this.userTVL += parseFloat(usdBalance);
				});
			}
		}
	}
};
</script>
