import { Token } from "@pancakeswap/sdk";
import BigNumber from "bignumber.js";
import { SerializedToken, WrappedTokenInfo } from "~/constants/pancakeswap/types";

export const BIG_TEN = new BigNumber(10);
export const BIG_ZERO = new BigNumber(0);
export const BIG_ONE = new BigNumber(1);
export const BIG_TWO = new BigNumber(2);
export const BIG_NINE = new BigNumber(9);

export function serializeToken(token: Token): SerializedToken {
	return {
		chainId: token.chainId,
		address: token.address,
		decimals: token.decimals,
		symbol: token.symbol,
		name: token.name,
		projectLink: token.projectLink,
		logoURI: token instanceof WrappedTokenInfo ? token.logoURI : undefined,
	};
}

export function deserializeToken(serializedToken: SerializedToken): Token {
	if (serializedToken.logoURI) {
		return new WrappedTokenInfo(
			{
				chainId: serializedToken.chainId,
				address: serializedToken.address,
				decimals: serializedToken.decimals,
				symbol: serializedToken.symbol!,
				name: serializedToken.name!,
				logoURI: serializedToken.logoURI,
			},
			[],
		);
	}
	return new Token(
		serializedToken.chainId,
		serializedToken.address,
		serializedToken.decimals,
		serializedToken.symbol,
		serializedToken.name,
		serializedToken.projectLink,
	);
}
