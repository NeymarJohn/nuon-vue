import { ChainId } from "@pancakeswap/sdk";
import { Address } from "~/constants/pancakeswap/types";
import addresses from "~/constants/pancakeswap/contracts";
import { BSC_CHAIN_ID } from "~/constants/pancakeswap/networks";

export const getAddress = (address: Address): string | undefined => {
	const chainId = parseInt(BSC_CHAIN_ID);
	return address[chainId as keyof typeof address] ? address[chainId as keyof typeof address] : address[ChainId.MAINNET];
};

export const getMasterChefAddress = () => {
	return getAddress(addresses.masterChef);
};

export const getMulticallAddress = () => {
	return getAddress(addresses.multiCall);
};
