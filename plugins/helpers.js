import Vue from "vue";
import Web3 from "web3";
import dayjs from "dayjs";
import { BigNumber } from "bignumber.js";

Vue.mixin({
	filters: {
		numberWithCommas(x) {
			if (!x) return 0;
			const str = x.toString();
			const main = str.split(".")[0];
			const decimals = str.split(".")[1] || "00";
			return `${main.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${decimals}`;
		},
		toFixed(x) {
			return parseFloat(x).toFixed(2);
		},
		formatPrice(x) {
			if (!x) return 0;
			return parseFloat(x).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		formatLongNumber(x) {
			if (!x) return "0.00";
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
		},
		formateDateTime(date) {
			return dayjs(date).format("YYYY-MM-DD hh:mm:ss");
		}
	},
	data() {
		return {
			highRiskLevel: 200, // my collateral Ratio
			mediumRiskLevel: 300, // my collateral Ratio
			periods: ["D", "W", "M"],
			healthStatusMetrics: { healthy: 10, average: 30}
		};
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
		},
		transactionConfig() {
			return this.$store.state.transactionStore.transactionConfig;
		},
		dateFilterComputed() {
			return this.$store.state.transactionStore.dateFilter;
		},
		transactionSearch() {
			return this.$store.state.transactionStore.search;
		},
		computedNuonPrice() {
			if (!this.nuonPrice) return 0;
			if (this.nuonPrice < 1) return this.nuonPrice.toFixed(9);
			if (this.nuonPrice > 1) return this.numberWithCommas(this.nuonPrice.toFixed(2));
			return 0;
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
			if (x >= 1e3 && x < 1e6) return + (x / 1e3).toFixed(1) + "K";
			if (x >= 1e6 && x < 1e9) return + (x / 1e6).toFixed(1) + "M";
			if (x >= 1e9 && x < 1e12) return + (x / 1e9).toFixed(1) + "B";
			if (x >= 1e12) return + (x / 1e12).toFixed(1) + "T";
		},
		fromWei(x) {
			if (!x) return 0;
			return Number(Web3.utils.fromWei(x)).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		getDollarValue(x, y) {
			return parseFloat(x || 0) * parseFloat(y || 0);
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
			}, 20000);
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
			}, 20000);
		},
		getRPCErrorMessage(x){
			if (!x.message) return null;
			const open = x.message.indexOf("{");
			if (open === -1) return null;
			const close = x.message.lastIndexOf("}");
			if (close === -1) return null;
			const jsonData = x.message.substring(open, close + 1);
			const j = JSON.parse(jsonData);
			const message = j.message;
			return message;
		},
		onFilterChange(x) {
			this.filterOption = x;
		},
		onDateFilterChange(x) {
			this.$store.commit("transactionStore/setDateFilter", x);
		},
		noExponents(exponent) {
			const data = exponent.split(/[eE]/);
			if (data.length === 1) return data[0];

			let z = "";
			const sign = this < 0 ? "-" : "";
			const str = data[0].replace(".", "");
			let mag = Number(data[1]) + 1;

			if (mag < 0) {
				z = sign + "0.";
				while (mag++) z += "0";
				return z + str.replace(/^-/, "");
			}
			mag -= str.length;
			while (mag--) z += "0";
			return str + z;
		},
		setTransactionSearch(x) {
			this.$store.commit("transactionStore/setSearch", x);
		},
		onPageChange(x) {
			this.currentPage = x;
		},
		isMobile() {
			if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				return true;
			} else {
				return false;
			}
		},
		twoDecimalPlaces(num) {
			let numStr = num.toString();
			let indexOfDecimal;
			if (numStr.includes(".")) {
				numStr += "000";
				indexOfDecimal = numStr.indexOf(".");
				numStr = numStr.slice(0, indexOfDecimal + 3);
			} else {
				numStr += ".00";
			}
			return numStr;
		},
		calcPercentChange(x, y) {
			const first = parseFloat(x);
			if (first === 0) return 0;
			const second = parseFloat(y);
			const val = ((second - first) / first) * 100;
			return val === "-0.00" ? "0.00" : this.twoDecimalPlaces(val);
		},
		getChangePercent(key, dataToUse, reverse=false) {
			if (!dataToUse) return 0;
			const dataLength = dataToUse.length;

			if (dataLength < 2) return 0;
			let first;
			let second;

			if (reverse) {
				first = dataToUse[1][key];
				second = dataToUse[0][key];
			} else {
				first = dataToUse[dataLength - 2][key];
				second = dataToUse[dataLength - 1][key];
			}
			if (key === "price") {
				first = first.price;
				second = second.price;
			}
			if (key === "collateralTokens") {
				first = first.reduce((acc, val) => acc + parseFloat(val.value), 0);
				second = second.reduce((acc, val) => acc + parseFloat(val.value), 0);
			}
			return this.calcPercentChange(first, second);
		},
		getPercentChangeBadgeClass(key, dataToUse, reverse=false) {
			const val = this.getChangePercent(key, dataToUse, reverse);
			if (parseFloat(val) === 0) return "price-same";
			return val < 0 ? "price-down" : "price-up";
		},
		formatSubOneDecimals(x) {
			const xStr = x.toString();
			let firstNonZeroNumIdx = 0;
			while (xStr[firstNonZeroNumIdx] === "0" || xStr[firstNonZeroNumIdx] === ".") {
				firstNonZeroNumIdx += 1;
				if (firstNonZeroNumIdx === 13) return "0";
			}
			return xStr.slice(0, firstNonZeroNumIdx + 1);
		},
		setCookie(key) {
			this.$cookies.set(key, "true");
		},
		getValueWithBN(amount, price) {
			return new BigNumber(amount).times(price).toString();
		}
	},
});
