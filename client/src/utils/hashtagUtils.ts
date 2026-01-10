export const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#[\w]+/g;
  return content.match(hashtagRegex) || [];
};

export const getContentWithoutHashtags = (content: string): string => {
  return content.replace(/#[\w]+/g, "").trim();
};

export const getHashtagsString = (content: string): string => {
  const hashtags = extractHashtags(content);
  return hashtags.join(" ");
};
