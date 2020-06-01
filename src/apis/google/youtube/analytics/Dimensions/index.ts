const baseChannel: string[] = ['channel'];
const baseChannelTrafficSourceType = [
  ...baseChannel,
  'insightTrafficSourceType',
];
const baseChannelAgeGroup = [...baseChannel, 'ageGroup'];
const baseChannelGender = [...baseChannel, 'gender'];

const baseVideo: string[] = ['video'];
const baseVideoTrafficSourceType: string[] = [
  ...baseVideo,
  'insightTrafficSourceType',
];
const baseVideoAgeGroup: string[] = [...baseVideo, 'ageGroup'];
const baseVideoGender: string[] = [...baseVideo, 'gender'];

export default {
  baseChannel,
  baseChannelTrafficSourceType,
  baseChannelAgeGroup,
  baseChannelGender,
  baseVideo,
  baseVideoTrafficSourceType,
  baseVideoAgeGroup,
  baseVideoGender,
};
