interface PostImageProps {
  imageUrl: string;
  alt?: string;
}

export default function PostImage({ imageUrl, alt = "Post" }: PostImageProps) {
  return (
    <div className="mb-4">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full rounded-lg object-cover"
      />
    </div>
  );
}

