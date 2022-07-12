<template>
	<div class="votes-chart">
		<div v-for="(choice, idx) in choices" :key="idx" class="votes-chart__row">
			<div class="votes-chart__labels">
				<p>{{ choice }}</p>
				<p>{{ score(idx) }}</p>
				<p>{{ resPercent(idx) }}</p>
			</div>
			<div class="votes-chart__chart">
				<div class="votes-chart__chart--fill" :style="`width: ${resPercent(idx)}`"></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "VotesChart",
	props: {
		scores: {
			type: Array,
			required: true
		},
		choices: {
			type: Array,
			required: true
		},
		proposalState: {
			type: String,
			required: true
		}
	},
	computed: {
		scoresTotal() {
			return this.scores.reduce((acc, val) => acc + (val || 0), 0);
		}
	},
	methods: {
		resPercent(idx) {
			return (((this.scores[idx] || 0) / (this.scoresTotal || 1)) * 100).toFixed(2) + "%";
		},
		score(idx) {
			return this.scores[idx] ? `${this.abbreviateNumber(this.scores[idx].toFixed(2))}${this.proposalState !== "active" ? " nuMINT" : ""}` : 0;
		}
	}
};
</script>
