import axios from "axios";
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
