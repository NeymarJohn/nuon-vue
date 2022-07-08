import Vue from "vue";
import Web3 from "web3";
import dayjs from "dayjs";

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
		users() {
			return this.$store.state.transactionStore.users;
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
		filteredData() {
			let data = this.users;

			if (this.dateFilterComputed && this.dateFilterComputed !== "All") {
				const days = parseInt(this.dateFilterComputed.split(" ")[1]);
				data = data.filter(d => new Date(d.date) > new Date(dayjs().subtract(days, "day").$d));
			}

			if (this.transactionSearch) {
				const lowerCaseSearch = this.transactionSearch.toLowerCase();
				data = data.filter(d =>
					d.txType.toLowerCase().includes(lowerCaseSearch) ||
					d.amount.includes(lowerCaseSearch) ||
					d.totalAmount.includes(lowerCaseSearch)
				);
			}

			return data;
		},
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
		getRPCErrorMessage(x){
			const open = x.message.indexOf("{");
			const close = x.message.lastIndexOf("}");
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
		getChangePercent(key, dataToUse) {
			if (!dataToUse) return 0;
			const dataLength = dataToUse.length;

			if (dataLength < 2) return 0;
			let first = dataToUse[dataLength - 2][key];
			let second = dataToUse[dataLength - 1][key];

			if (key === "price") {
				first = first.price;
				second = second.price;
			}
			return this.calcPercentChange(first, second);
		},
		getPercentChangeBadgeClass(key, dataToUse) {
			const val = this.getChangePercent(key, dataToUse);
			if (parseFloat(val) === 0) return "price-same";
			return val < 0 ? "price-down" : "price-up";
		}
	},
});
