import { AxiosRequestHeaders } from "axios";

// Define the ApiResponse type with an index signature
export interface PolymarketAPIResponse {
	apiKey: string;
	secret: string;
	passphrase: string;
}

export interface ApiKeyRaw {
    apiKey: string;
    secret: string;
    passphrase: string;
}

export interface ApiKeyCreds {
	key: string;
	secret: string;
	passphrase: string;
}

export interface ApiCreds {
	key: string;
	secret: string;
	passphrase: string;
}

export interface L2HeaderArgs {
	method: string;
	requestPath: string;
	body?: string;
}

// EIP712 sig verification
export interface L1PolyHeader extends AxiosRequestHeaders {
	POLY_ADDRESS: string;
	POLY_SIGNATURE: string;
	POLY_TIMESTAMP: string;
	POLY_NONCE: string;
}

// API key verification
export interface L2PolyHeader extends AxiosRequestHeaders {
	POLY_ADDRESS: string;
	POLY_SIGNATURE: string;
	POLY_TIMESTAMP: string;
	POLY_API_KEY: string;
	POLY_PASSPHRASE: string;
}
