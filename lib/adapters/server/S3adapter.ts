export interface S3adapter {
	Delete(code: string): Promise<void>;
	getSignature(timestamp: number): string;
}