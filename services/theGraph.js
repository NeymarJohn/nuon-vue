import axios from "axios";
import dayjs from "dayjs";
const THE_GRAPH_URL = "https://graphiql-nuon.hydrogenx.live/subgraphs/name/nuon/usdc";
const UNISWAP_THE_GRAPH_URL = "https://graphiql-nuon.hydrogenx.live/subgraphs/name/nuon/uniswap";

export const getCollateralTVLDayData = () => axios.post(THE_GRAPH_URL, {
	query: `
		query collateralDayDatas {
			collateralDayDatas {
				id
				date
				value
				collateralTokens {
					id
					date
					amount
					value
					token {
						id
						symbol
						tokenAddress
					}
				}
			}
		}`
});
export const getTokenPricesDayData = () => axios.post(THE_GRAPH_URL, {
	query:`
		query {
			tokenPriceDayDatas {
				prices {
					price
					id
					symbol
					time
					tokenAddress
				}
				date
				id
			}
	}`
});

export const getTotalSupplyWithToken = (token) => axios.post(THE_GRAPH_URL, {
	query:`
		query {
			totalSupplyDayDatas(where: {token: "${token}"})  {
				id
				date
				marketVal
				token
				value
				price {
					price
					tokenAddress
					time
				}
			}
	}`
});

export const getUserTransactionHistory = (filters) => {
	const variables = {
		location: filters.location || "collateral",
		user: filters.user,
		query: filters.query || ""
	};
	if (filters.lastDays) {
		variables.startDate = Math.floor(new Date(dayjs().subtract(filters.lastDays, "day")).getTime() / 1000);
	} else {
		variables.startDate = 0;
	}

	return axios.post(THE_GRAPH_URL, {
		query:`
			query getUserTransactions($user: String!, $query: String!, $startDate: Int!, $location: String! ){
				userTransactions(orderBy: date, orderDirection: desc, 
					where: {
						date_gte: $startDate, 
						transactionType_contains_nocase: $query, 
						location: $location, 
						user: $user
					}) {
						id
						date
						transactionType
						location
						user
						amount
						totalAmount
					}
			}`,
		variables
	});
};

export const getUserCollateralHistory = (filters) => {
	const variables = {
		user: filters.user,
		first: filters.first || 10
	};
	return axios.post(THE_GRAPH_URL, {
		query:`
			query getUserCollateralHistory($user: String!, $first: Int!) {
				userCollateralHistories(
					where: {user: $user}
					orderBy: dateTime
					orderDirection: desc
					first: $first
				) {
					id
					user
					mintedNuon
					collateralRatio
					dateTime
				}
			}`,
		variables
	});
};

export const getUserCollateralHistoryData = (filters) => {
	const variables = {
		user: filters.user
	};
	return axios.post(THE_GRAPH_URL, {
		query:`
			query getUserCollateralHistory($user: String!) {
				userCollateralHistories(
					orderBy: dateTime
					orderDirection: desc
					where: {user: $user}
				) {
					id
					user
					mintedNuon
					collateralRatio
					dateTime
					collateralTokens {
						amount
						value
						collateralToken {
							symbol
							tokenAddress
						}
					}
				}
			}`,
		variables
	});
};

export const getTokenData = (token) => {
	const variables = {
		token: token.toLowerCase()
	};
	return axios.post(UNISWAP_THE_GRAPH_URL, {
		query:`
			query getTokenData($token: String) {
				token(id: $token) {
					id
					tokenDayData(orderDirection: desc, orderBy: date) {
						priceUSD
						dailyVolumeUSD
						dailyVolumeToken
						dailyVolumeETH
						dailyTxns
						totalLiquidityUSD
						totalLiquidityToken
						date
						totalLiquidityETH
					}
				}
		}`,
		variables
	});
};

export const getCollateralTransactionHistory = (filters) => {
	const variables = {
		user: filters.user,
		query: filters.query || ""
	};
	if (filters.lastDays) {
		variables.startDate = Math.floor(new Date(dayjs().subtract(filters.lastDays, "day")).getTime() / 1000);
	} else {
		variables.startDate = 0;
	}

	return axios.post(THE_GRAPH_URL, {
		query:`
			query getCollateralHubTransactions($user: String!, $query: String!, $startDate: Int! ){
				collateralHubTransactions(orderBy: date, orderDirection: desc, 
					where: {
						date_gte: $startDate, 
						transactionType_contains_nocase: $query, 
						user: $user
					}) {
						id
						date
						transactionType
						depositToken {
							symbol
							tokenAddress
						}
						user
						input
						output
					}
			}`,
		variables
	});
};
export const getSwapTransactionHistory = (filters) => {
	const variables = {
		user: filters.user,
		query: filters.query || ""
	};
	if (filters.lastDays) {
		variables.startDate = Math.floor(new Date(dayjs().subtract(filters.lastDays, "day")).getTime() / 1000);
	} else {
		variables.startDate = 0;
	}

	return axios.post(UNISWAP_THE_GRAPH_URL, {
		query:`
			query getSwapTransactions($user: String!, $query: String!, $startDate: Int! ) {
				swaps(orderBy: timestamp, orderDirection: desc, 
					where: {
						timestamp_gte: $startDate, 
						from: $user
					}) {
					amount0In
					amount0Out
					amount1In
					amount1Out
					amountUSD
					from
					id
					logIndex
					sender
					timestamp
					to
					transaction {
						id
					}
					pair {
						token0 {
							symbol
						}
						token1 {
							symbol
						}
					}
				}
			}`,
		variables
	});
};

export const getStakingTransactionHistory = (filters) => {
	const variables = {
		user: filters.user,
		query: filters.query || ""
	};
	if (filters.lastDays) {
		variables.startDate = Math.floor(new Date(dayjs().subtract(filters.lastDays, "day")).getTime() / 1000);
	} else {
		variables.startDate = 0;
	}

	return axios.post(THE_GRAPH_URL, {
		query:`
			query getStakingTransactions($user: String!, $query: String!, $startDate: Int! ) {
				boardroomTransactions(orderBy: date, orderDirection: desc, 
					where: {
						date_gte: $startDate, 
						user: $user
					}) {
						id
						date
						amount
						totalAmount
						transactionType
						user
				}
			}`,
		variables
	});
};

export const getRewardTransactionHistory = (filters) => {
	const variables = {
		user: filters.user,
		query: filters.query || ""
	};
	if (filters.lastDays) {
		variables.startDate = Math.floor(new Date(dayjs().subtract(filters.lastDays, "day")).getTime() / 1000);
	} else {
		variables.startDate = 0;
	}

	return axios.post(THE_GRAPH_URL, {
		query:`
			query getRewardTransactions($user: String!, $query: String!, $startDate: Int! ) {
				rewardTransactions(orderBy: dateTime, orderDirection: desc, where: {
					dateTime_gte: $startDate, 
					user: $user
				}) {
					id
					dateTime
					amount
					user
				}
			}`,
		variables
	});
};



