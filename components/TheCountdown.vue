<template>
	<div v-if="visible">
		<div v-if="!readyToClaim" class="countdown">
			<div class="countdown__block">
				<h3>{{days}}</h3>
				<p>D</p>
			</div>
			<div class="countdown__block">
				<h3>{{hours}}</h3>
				<p>H</p>
			</div>
			<div class="countdown__block">
				<h3>{{minutes}}</h3>
				<p>M</p>
			</div>
			<div class="countdown__block">
				<h3>{{seconds}}</h3>
				<p>S</p>
			</div>
		</div>
		<h3 v-if="readyToClaim">Claim now</h3>
	</div>
	<div v-else>
		<h3 class="countdown__placeholder">00<sup>D</sup> 00<sup>H</sup> 00<sup>M</sup> 00<sup>S</sup></h3>
	</div>
</template>

<script>
export default {
	name: "TheCountdown",
	props: {
		nextClaimDate: {
			type: Number,
			default: 0
		},
		visible: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
		};
	},
	computed: {
		readyToClaim() {
			// return this.$store.getters["stabilityFlashStore/getReadyToClaim"];
			return this.nextClaimDate * 1000 < new Date().getTime();
		},
	},
	mounted() {
		this.showRemaining();
	},
	methods: {
		formatNumber(number) {
			return number < 10 ? "0" + number : number;
		},
		showRemaining() {
			const timer = setInterval(() => {
				const now = new Date();
				const end = new Date(this.nextClaimDate * 1000);
				const distance = end.getTime() - now.getTime();

				if(distance < 0) {
					clearInterval(timer);
					this.$store.commit("stabilityFlashStore/setReadyToClaim", true);
					return;
				}

				const _days = 86400000;
				const _hours = 3600000;
				const _minutes = 60000;
				const _seconds = 1000;

				const days = Math.floor(distance / _days);
				const hours = Math.floor((distance % _days) / _hours);
				const minutes = Math.floor((distance % _hours) / _minutes);
				const seconds = Math.floor((distance % _minutes) / _seconds);

				this.days = this.formatNumber(days);
				this.hours = this.formatNumber(hours);
				this.minutes = this.formatNumber(minutes);
				this.seconds = this.formatNumber(seconds);
			}, 1000);
		}
	}
};
</script>
