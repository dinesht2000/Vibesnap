export const compressVideo = async (
  file: File,
  maxWidth: number = 1280,
  maxHeight: number = 720,
  maxBitrate: number = 2000000, // 2 Mbps
  maxFileSizeMB: number = 50
): Promise<File> => {
  return new Promise((resolve) => {
    const fileSizeMB = file.size / (1024 * 1024);
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    let metadataLoaded = false;

    video.onloadedmetadata = () => {
      if (metadataLoaded) return;
      metadataLoaded = true;
      
      const needsResize = video.videoWidth > maxWidth || video.videoHeight > maxHeight;
      const needsCompression = fileSizeMB > maxFileSizeMB || needsResize;
      
      URL.revokeObjectURL(url);

      if (!needsCompression) {
        resolve(file);
        return;
      }

      compressVideoWithMediaRecorder(file, maxWidth, maxHeight, maxBitrate)
        .then(resolve)
        .catch((error) => {
          console.warn("Video compression failed, using original file:", error);
          resolve(file);
        });
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      console.warn("Failed to load video metadata, using original file");
      resolve(file);
    };

    video.src = url;
    video.load();
    
    setTimeout(() => {
      if (!metadataLoaded) {
        URL.revokeObjectURL(url);
        console.warn("Video metadata load timeout, using original file");
        resolve(file);
      }
    }, 5000);
  });
};


//Internal function to compress video using MediaRecorder API

const compressVideoWithMediaRecorder = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  maxBitrate: number
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const url = URL.createObjectURL(file);

    if (!ctx) {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to get canvas context"));
      return;
    }

    let mediaRecorder: MediaRecorder | null = null;
    const chunks: Blob[] = [];
    let animationFrameId: number | null = null;
    let isRecording = false;

    const cleanup = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        try {
          mediaRecorder.stop();
        } catch (e) {
          console.error("Error stopping media recorder:", e);
        }
      }
      video.pause();
      video.src = "";
      URL.revokeObjectURL(url);
    };

    video.onloadedmetadata = () => {
      let width = video.videoWidth;
      let height = video.videoHeight;
      const aspectRatio = width / height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          width = Math.min(width, maxWidth);
          height = width / aspectRatio;
          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        } else {
          height = Math.min(height, maxHeight);
          width = height * aspectRatio;
          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
        }
      }

      canvas.width = width;
      canvas.height = height;


      video.width = width;
      video.height = height;
      video.muted = true; 
      video.playsInline = true;

      const stream = canvas.captureStream(30);
      const mimeType = getSupportedMimeType();
      const options: MediaRecorderOptions = {
        mimeType,
        videoBitsPerSecond: maxBitrate,
      };

      if (!MediaRecorder.isTypeSupported(mimeType)) {
        cleanup();
        reject(new Error(`MediaRecorder does not support ${mimeType}`));
        return;
      }

      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (error) {
        console.error("Error creating media recorder:", error);
        cleanup();
        reject(new Error("MediaRecorder not supported or invalid options"));
        return;
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        cleanup();
        
        if (chunks.length === 0) {
          reject(new Error("No video data recorded"));
          return;
        }

        const blob = new Blob(chunks, { type: mimeType });
        const fileExtension = mimeType.includes("webm") ? "webm" : "mp4";
        const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, `.${fileExtension}`), {
          type: mimeType,
          lastModified: Date.now(),
        });

        resolve(compressedFile);
      };

      mediaRecorder.onerror = (event) => {
        cleanup();
        reject(new Error("MediaRecorder error: " + (event as any).error));
      };

      // Draw video frames to canvas
      const drawFrame = () => {
        if (!isRecording) return;
        
        if (video.ended || video.paused) {
          if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
          return;
        }

        ctx.drawImage(video, 0, 0, width, height);
        animationFrameId = requestAnimationFrame(drawFrame);
      };

      video.onplay = () => {
        if (!isRecording && mediaRecorder && mediaRecorder.state === "inactive") {
          isRecording = true;
          mediaRecorder.start();
          drawFrame();
        }
      };

      video.onended = () => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      };

      video.onerror = () => {
        cleanup();
        reject(new Error("Failed to load video"));
      };

      video.play().catch((error) => {
        cleanup();
        reject(new Error("Failed to play video: " + error.message));
      });
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Failed to load video"));
    };

    video.src = url;
    video.load();
  });
};


const getSupportedMimeType = (): string => {
  const types = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return "video/webm";
};

