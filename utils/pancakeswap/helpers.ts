import { Token } from "@pancakeswap/sdk";
import { TokenInfo, Tags } from "@uniswap/token-lists";

interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
  projectLink?: string
  logoURI?: string
}

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

class WrappedTokenInfo extends Token {
	public readonly tokenInfo: TokenInfo;

	public readonly tags: TagInfo[];

	constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
		super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name);
		this.tokenInfo = tokenInfo;
		this.tags = tags;
	}

	public get logoURI(): string | undefined {
		return this.tokenInfo.logoURI;
	}
}

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
