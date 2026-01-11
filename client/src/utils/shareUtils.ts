
export interface ShareData {
  title?: string;
  text: string;
  url?: string;
  files?: File[];
}
export const isWebShareSupported = (): boolean => {
  return typeof navigator !== "undefined" && "share" in navigator;
};

export const shareContent = async (data: ShareData): Promise<boolean> => {
  try {
    if (isWebShareSupported() && !data.files) {
      const shareData: ShareData = {
        title: data.title,
        text: data.text,
        url: data.url,
      };

      const cleanShareData: Record<string, string> = {};
      if (shareData.title) cleanShareData.title = shareData.title;
      if (shareData.text) cleanShareData.text = shareData.text;
      if (shareData.url) cleanShareData.url = shareData.url;

      await navigator.share(cleanShareData);
      return true;
    }
    const textToCopy = [
      data.title,
      data.text,
      data.url,
    ]
      .filter(Boolean)
      .join("\n\n");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(textToCopy);
      return true;
    }

    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      throw err;
    }
  } catch (error) {
    console.error("Error sharing content:", error);
    return false;
  }
};


export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      throw err;
    }
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
};


export const generatePostLink = (postId: string, userId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/feed?post=${postId}&user=${userId}`;
};

export const formatPostForSharing = (
  content: string,
  userName?: string,
  postUrl?: string
): string => {
  const lines: string[] = [];

  if (userName) {
    lines.push(`Check out this post by ${userName}:`);
    lines.push("");
  }

  lines.push(content);

  if (postUrl) {
    lines.push("");
    lines.push(`View on Kleo: ${postUrl}`);
  }

  return lines.join("\n");
};

export const shareToTwitter = (url: string, text: string): void => {
  const tweetText = encodeURIComponent(text);
  const tweetUrl = encodeURIComponent(url);
  window.open(
    `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`,
    "_blank",
    "width=550,height=420"
  );
};

export const shareToFacebook = (url: string): void => {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    "_blank",
    "width=550,height=420"
  );
};

export const shareToReddit = (url: string, title: string): void => {
  window.open(
    `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    "_blank",
    "width=550,height=420"
  );
};

export const shareToDiscord = async (url: string, text: string): Promise<void> => {
  const shareText = `${text}\n\n${url}`;
  await copyToClipboard(shareText);
};

export const shareToWhatsApp = (url: string, text: string): void => {
  const message = encodeURIComponent(`${text} ${url}`);
  window.open(`https://wa.me/?text=${message}`, "_blank");
};

export const shareToMessenger = (url: string): void => {
  window.open(
    `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}`,
    "_blank",
    "width=550,height=420"
  );
};

export const shareToTelegram = (url: string, text: string): void => {
  window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
};

export const shareToInstagram = async (url: string): Promise<void> => {
  await copyToClipboard(url);
};

