import { getVideoDurationInSeconds } from 'get-video-duration';

const LIMIT_DURATION_VIDEO = 30;

export const ValidationDurationVideo = async (filePath: string) => {
  const responseDurationVideo = await getVideoDurationInSeconds(filePath);

  if (responseDurationVideo > LIMIT_DURATION_VIDEO) {
    return false;
  }

  return true
};
