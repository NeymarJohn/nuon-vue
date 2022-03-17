import { DAI_ADDRESS, HYDRO_ADDRESS, USX_ADDRESS } from "./addresses";
import paths from "./paths";

export const HX = {
	address: HYDRO_ADDRESS,
	symbol: "HX",
	name: "HYDRO TOKEN"
};

export const USX = {
	address: USX_ADDRESS,
	symbol: "USX",
	name: "USX TOKEN"
};

export const DAI = {
	address: DAI_ADDRESS,
	symbol: "DAI",
	name: "DAI STABLE COIN"
};

export const TOKENS_MAP:any = {
	HX,
	USX,
	DAI
};

export const getPath = (inputToken:string, outputToken:string) => {
	let path = paths[`${inputToken}_${outputToken}`];
	if (!path) path = [TOKENS_MAP[inputToken].address, TOKENS_MAP[outputToken].address];
	return path;
};
