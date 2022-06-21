import axios from "axios";
const THE_GRAPH_URL = "https://graphiql-nuon.hydrogenx.tk/subgraphs/name/nuon";

export const getCollateralTVLDayData =  () => axios.post(THE_GRAPH_URL, {
	query: `
		query collateralDayDatas {
			collateralDayDatas {
				id
				formattedDate
				date
				price
				totalValue
				value
			}
		}`
});
export const getTVLWeekhData = axios.post(THE_GRAPH_URL, {
	query: `
		query collateralDayDatas {
			collateralDayDatas {
				amount
				date
				id
				txCount
				value
			}
		}`
});
export const getTVLMonthData = axios.post(THE_GRAPH_URL, {
	query: `
		query collateralDayDatas {
			collateralDayDatas {
				amount
				date
				id
				txCount
				value
			}
		}`
});
