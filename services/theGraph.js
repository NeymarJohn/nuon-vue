import axios from "axios";
import dayjs from "dayjs";
let theGraphName = "nuon";
if (process.env.NODE_ENV === "development") {
	theGraphName = "dev-nuon";
} 
if (process.env.NODE_ENV === "staging") {
	theGraphName ="staging-nuon";
}
let THE_GRAPH_URL = `https://graphiql-nuon.hydrogenx.live/subgraphs/name/${theGraphName}`;
let UNISWAP_THE_GRAPH_URL = `https://graphiql-nuon.hydrogenx.live/subgraphs/name/${theGraphName}/uniswap`;
export const setTheGraphUrl = (chainId) =>{
	if (chainId === "5") { // if Goerli testnet is set
		THE_GRAPH_URL ="https://api.thegraph.com/subgraphs/name/devvenus1202/nuon-goerli";
		UNISWAP_THE_GRAPH_URL =`https://graphiql-nuon.hydrogenx.live/subgraphs/name/goerli/${theGraphName}}/uniswap`;
	}
};
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

export const getUserTVLDayData = (filters) => {
	const variables = {
		user: filters.user
	};
	return axios.post(THE_GRAPH_URL, {
		query:`
			query getUserTVLDayDatas($user: String!) {
				userTVLDayDatas(
					orderBy: date
					orderDirection: desc
					where: {user: $user}
				) {
					mintedValue
					value
					user
					date
					id
					collateralRatio
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
						queryData_contains_nocase: $query, 
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
						queryData
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
						from: $user,
						queryData_contains_nocase: $query
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
						user: $user,
						queryData_contains_nocase: $query
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
					user: $user,
					queryData_contains_nocase: $query
				}) {
					transactionType
					id
					dateTime
					amount
					user
				}
			}`,
		variables
	});
};



