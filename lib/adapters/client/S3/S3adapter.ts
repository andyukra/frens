export interface S3adapter {
	Upload(file: File): Promise<string>;
}