import { S3adapter } from "./S3adapter";
import { v2 as cloudinary } from "cloudinary";
//CLOUDYNARI CREDENTIALS
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default function (): S3adapter {
  return {
    Delete: async (code: string): Promise<void> => {
      const srcCode = code.replace(/.{4}$/, "");
      cloudinary.uploader.destroy(srcCode, (err, _) => {
        if (err) throw new Error('Problemas con cloudinary');
      });
    },
    getSignature: (timestamp: number): string => {
      return cloudinary.utils.api_sign_request(
        { timestamp },
        process.env.CLOUDINARY_SECRET,
      );
    },
  };
}
