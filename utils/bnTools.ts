import Web3 from "web3";
import BN from "bn.js";

export function toWei(value: string | null | undefined): string {
	return Web3.utils.toWei(`${value || 0}`);
}

export function fromWei(value: BN | string | null | undefined): string {
	const bigNum = Web3.utils.toBN(value?.toString() || "0");
	return Web3.utils.fromWei(bigNum);
}
export function compareStringBigNumbers(a: string, b: string): number {
	const bigA = Web3.utils.toBN(a);
	const bigB =  Web3.utils.toBN(b);
	return bigA.cmp(bigB);
}
