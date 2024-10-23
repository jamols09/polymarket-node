/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonRpcSigner } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { buildClobEip712Signature } from "../utils/eip712";
import type { ApiKeyCreds, L2HeaderArgs } from "../schema/interfaces";
import type { L2PolyHeader } from "../schema/interfaces";
import { buildPolyHmacSignature } from "../utils/hmac";

/**
 *  Creates L1 headers for Polymarket API requests
 * @param signer
 * @param chainId
 * @param nonce
 * @param timestamp
 * @returns
 */
export const createL1Headers = async (
	signer: Wallet | JsonRpcSigner,
	chainId: number,
	nonce: number,
	timestamp: number
): Promise<any> => {
	const signature = await buildClobEip712Signature(
		signer,
		chainId,
		nonce,
		timestamp
	);
	const address = await signer.getAddress();

	const headers = {
		POLY_ADDRESS: address,
		POLY_SIGNATURE: signature,
		POLY_TIMESTAMP: `${timestamp}`,
		POLY_NONCE: `${nonce}`,
	};
	return headers;
};

/**
 * Creates L2 headers for Polymarket API requests
 * @param signer
 * @param creds
 * @param l2HeaderArgs
 * @param timestamp
 * @returns
 */
export const createL2Headers = async (
	signer: Wallet | JsonRpcSigner,
	creds: ApiKeyCreds,
	l2HeaderArgs: L2HeaderArgs,
	timestamp?: number
): Promise<any> => {
	const address = await signer.getAddress();
	let ts = Math.floor(Date.now() / 1000);
	if (timestamp == undefined) {
		timestamp = ts;
	}

	const sig = buildPolyHmacSignature(
		creds.secret,
		l2HeaderArgs.method,
		l2HeaderArgs.requestPath,
		l2HeaderArgs.body,
		timestamp
	);

	const headers = {
		POLY_ADDRESS: address,
		POLY_SIGNATURE: sig,
		POLY_TIMESTAMP: `${timestamp}`,
		POLY_API_KEY: creds.key,
		POLY_PASSPHRASE: creds.passphrase,
	};

	return headers;
};
