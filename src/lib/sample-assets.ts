import type { StoryKind } from './illustration';
import moon from '@/assets/moon.mp4.asset.json';
import boat from '@/assets/boat.mp4.asset.json';
import cloud from '@/assets/cloud.mp4.asset.json';
// All three outputs were locally verified with FFprobe before linking.
export const sampleAssets: Record<StoryKind, { url: string }> = { moon, boat, cloud };