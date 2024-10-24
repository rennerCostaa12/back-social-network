import * as ffmpeg from 'fluent-ffmpeg';

const LIMIT_DURATION_VIDEO = 30;

const getDuration = (filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        resolve(duration);
      }
    });
  });
};

export const ValidationDurationVideo = async (filePath: string) => {
  const responseDurationVideo = await getDuration(filePath);

  if (responseDurationVideo > LIMIT_DURATION_VIDEO) {
    return false;
  }

  return true;
};
