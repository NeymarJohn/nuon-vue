import Web3 from "web3";
import { Unit } from "web3-utils";
import BN from "bn.js";

export function toWei(value: string | number | null | undefined , decimals: number = 18 ): string {
	const unit = getUnitFromDecimal(decimals);
	return Web3.utils.toWei(`${value || 0}`, unit);
}

export function fromWei(value: BN | string | null | undefined, decimals: number = 18): string  | number {
	const unit = getUnitFromDecimal(decimals);
	const bigNum = Web3.utils.toBN(value?.toString() || "0");
	return parseFloat(Web3.utils.fromWei(bigNum, unit));
}
export function compareStringBigNumbers(a: string, b: string): number {
	const bigA = Web3.utils.toBN(a);
	const bigB =  Web3.utils.toBN(b);
	return bigA.cmp(bigB);
}
export function toFixedFloorNumber(a: number, b :number = 2 ) : number {
	return Math.floor(a * Math.pow(10, b)) / Math.pow(10, b);
}

export function getUnitFromDecimal(a: number): Unit {
	const units: any = {
		1: "wei",
		3: "Kwei",
		6: "Mwei",
		9: "Gwei",
		12: "micro",
		15: "milli",
		18: "ether",
		21: "kether",
		24: "mether",
		27: "gether",
		30: "tether"
	};
	return units[a];
}
