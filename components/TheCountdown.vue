<template>
	<div v-if="visible" class="countdown">
		<label>{{ label }}</label>
		<div class="countdown__wrapper">
			<div class="countdown__block">
				<h3>{{hours | formatWithTwoDigit}}</h3>
				<p>H</p>
			</div>
			<div class="countdown__block">
				<h3>{{minutes | formatWithTwoDigit}}</h3>
				<p>M</p>
			</div>
			<div class="countdown__block">
				<h3>{{seconds | formatWithTwoDigit}}</h3>
				<p>S</p>
			</div>
		</div>
	</div>
	<div v-else>
		<h3 class="countdown__placeholder">00<sup>H</sup> 00<sup>M</sup>00<sup>S</sup></h3>
	</div>
</template>

<script>
export default {
	name: "TheCountdown",
	props: {
		label: {
			type: String,
			required: true
		},
		nextClaimDate: {
			type: Number,
			default: 0
		},
		visible: {
			type: Boolean,
			default: false
		},
		isLoop: {
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
	watch: {
		nextClaimDate() {
			const now = new Date();
			const end = new Date(this.nextClaimDate * 1000);
			const distance = end.getTime() - now.getTime();
			if (distance > 0) {
				this.setRemaingTime(distance);
			}
			this.showRemaining();
		}
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
					return;
				}
				this.setRemaingTime(distance);
			}, 1000);
		},
		setRemaingTime(distance) {
			const _days = 86400000;
			const _hours = 3600000;
			const _minutes = 60000;
			const _seconds = 1000;

			const hours = Math.floor((distance % _days) / _hours);
			const minutes = Math.floor((distance % _hours) / _minutes);
			const seconds = Math.floor((distance % _minutes) / _seconds);

			this.hours = this.formatNumber(hours);
			this.minutes = this.formatNumber(minutes);
			this.seconds = this.formatNumber(seconds);
		}
	}
};
</script>
