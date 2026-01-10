interface PostContentProps {
  content: string;
  hashtags: string;
}

export default function PostContent({ content, hashtags }: PostContentProps) {
  return (
    <>
      {content && (
        <p className="text-black mb-3 whitespace-pre-wrap">{content}</p>
      )}
      {hashtags && (
        <p className="text-blue-600 mb-3 font-medium">{hashtags}</p>
      )}
    </>
  );
}

