import Vue from "vue";
import Web3 from "web3";

Vue.mixin({
	filters: {
		numberWithCommas(x) {
			if (!x) return 0;
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		toFixed(x) {
			return parseFloat(x).toFixed(2);
		},
		formatPrice(x) {
			if (!x) return 0;
			return parseFloat(x).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		formatLongNumber(x) {
			const nums = x.toString().split(".");
			if (nums[1]) {
				nums[1] = nums[1].substring(0,2);
			} else {
				nums[1] = "00";
			} 
			return `${nums[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${nums[1]}`;
		},
		formatWithTwoDigit(number) {
			return (`0${number}`).slice(-2);
		}
	},
	computed: {
		isLoaded() {
			return this.$store.getters["rootStore/getIsLoaded"];
		},
		isConnectedWallet() {
			return this.$store.getters["web3Store/isConnectedWallet"];
		},
		modalStatus() {
			return this.$store.getters["modalStore/getModalStatus"];
		},
		connectedAccount() {
			return this.$store.state.web3Store.account;
		},
		tokenPrices() {
			return this.$store.state.tokenStore.price;
		},
		tokenBalances() {
			return this.$store.state.erc20Store.balance;
		}
	},
	methods: {
		numberWithCommas (x) {
			if (!x) return 0;
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		formatPrice(x) {
			if (!x) return 0;
			return parseFloat(x).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		abbreviateNumber(x) {
			if (x < 1e3) return x;
			if (x >= 1e3 && x < 1e6) return +(x / 1e3).toFixed(1) + "K";
			if (x >= 1e6 && x < 1e9) return +(x / 1e6).toFixed(1) + "M";
			if (x >= 1e9 && x < 1e12) return +(x / 1e9).toFixed(1) + "B";
			if (x >= 1e12) return +(x / 1e12).toFixed(1) + "T";
		},
		fromWei(x) {
			if (!x) return 0;
			return Number(Web3.utils.fromWei(x)).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		getDollarValue(x, y) {
			return parseFloat(x) * parseFloat(y);
		},
		getPreviousPage() {
			this.$router.back();
		},
		capitalize(x) {
			if (!x) return "";
			return x[0].toUpperCase() + x.substring(1);
		},
		firstLetterLowercase(x) {
			if (!x) return "";
			return x[0].toLowerCase() + x.substring(1);
		},
		formatDate(x) {
			return x.toDateString().slice(4) + ", " + x.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
		},
		connectWallet() {
			this.$store.dispatch("web3Store/connect");
		},
		disconnectWallet() {
			this.$store.dispatch("web3Store/disconnect");
		},
		setModalVisibility(name, visibility) {
			this.$store.commit("modalStore/setModalVisibility", {name, visibility});
			visibility ? document.body.classList.add("is-active") : document.body.classList.remove("is-active");
		},
		shortAddress(x) {
			if (!x) return;
			return `${x.slice(0, 6)}...${x.slice(36, 42)}`;
		},
		isMaxInputDisabled(x) {
			if (!x) return;
			return x === 0;
		},
		successToast(turnPageCallback, msg, txHash) {
			this.$store.commit("rootStore/setToast", {show: true, message: msg, txHash});
			if (turnPageCallback) turnPageCallback();
			setTimeout(() => {
				this.$store.commit("rootStore/setToast", {...this.$store.state.rootStore.toast, show: false});
			}, 5000);
		},
		failureToast(turnPageCallback, e, title) {
			if (e) {
				let err = e;
				if (typeof(e) === "object") {
					err = e.code === 4001 ? "Transaction failed because you rejected the transaction." : e.message;
				}
				this.$store.commit("rootStore/setToast", {show: true, kind: "failure", message: err, title});
			}
			if (turnPageCallback) turnPageCallback();
			setTimeout(() => {
				this.$store.commit("rootStore/setToast", {...this.$store.state.rootStore.toast, show: false});
			}, 5000);
		},
		getRPCErrorMessage(err){
			const open = err.message.indexOf("{");
			const close = err.message.lastIndexOf("}");
			const jsonData = err.message.substring(open, close + 1);
			const j = JSON.parse(jsonData);
			const message = j.message;
			return message;
		},
		onFilterChange(o) {
			this.filterOption = o;
		}
	}
});
