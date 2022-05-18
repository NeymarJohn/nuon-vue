import { ChainId } from "@pancakeswap/sdk";
import addresses from "~/constants/pancakeswap/contracts";
import { CHAIN_ID } from "~/constants/pancakeswap/networks";

export const getAddress = (address: Record<number, string>): string => {
	const chainId = parseInt(CHAIN_ID);
	return address[chainId] ? address[chainId] : address[ChainId.MAINNET];
};

export const getMasterChefAddress = () => {
	return getAddress(addresses.masterChef);
};

export const getMulticallAddress = () => {
	return getAddress(addresses.multiCall);
};
