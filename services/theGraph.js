import axios from "axios";
import dayjs from "dayjs";
const THE_GRAPH_URL = "https://graphiql-nuon.hydrogenx.live/subgraphs/name/nuon";

export const getCollateralTVLDayData = () => axios.post(THE_GRAPH_URL, {
	query: `
		query collateralDayDatas {
			collateralDayDatas {
				id
				formattedDate
				date
				price
				totalValue
				value
				collateralTokens {
					id
					date
					amount
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
