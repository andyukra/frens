import { S3adapter } from "./S3adapter";
import { getSignature } from '@/app/actions/serverActions';

export default function cloudinaryClientAdapter(): S3adapter {
  return {
    Upload: async (file: File): Promise<string> => {
      //GET SIGNATURE
      const timestamp = Math.floor(Date.now() / 1000);
      const cloudyURl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/auto/upload`;
      const { errors, signature } = await getSignature(timestamp);
      if (errors) throw new Error(errors);
      if (!signature) throw new Error("No se puede subir la imágen");
      //UPLOAD
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);

      const response = await fetch(cloudyURl, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Fallo al subir la imágen");
      const { secure_url } = await response.json();
      return secure_url;
    },
  };
}
