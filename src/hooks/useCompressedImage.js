import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";

const useCompressedImage = (imageUrl, options = {}) => {
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) return;

    const compress = async () => {
      setLoading(true);

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const compressedBlob = await imageCompression(blob, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        ...options,
      });

      setSrc(URL.createObjectURL(compressedBlob));
      setLoading(false);
    };

    compress();
  }, [imageUrl]);

  return { src, loading };
};

export default useCompressedImage;
