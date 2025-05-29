import { s3, write } from "bun";

// Bun.s3 reads environment variables for credentials
// https://bun.sh/docs/api/s3

const bucket_root = Bun.env.bucket_root;

// Upload to S3
export const upload = async (name: string, file: Blob) => {
	const path = `${bucket_root}/${name}`;
	const metadata = s3.file(path);
	await write(metadata, file);
	return path;
};

// Presign a URL (synchronous - no network request needed)
export const public_url = async (path: string) => {
	const metadata = s3.file(path);
	return metadata.presign({
		acl: "public-read",
		expiresIn: 60 * 60 * 24, // 1 day
	});
};

// Delete the file
export const delete_file = async (path: string) => {
	const metadata = s3.file(path);
	await metadata.delete();
};
