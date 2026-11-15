import type { StoryKind } from './illustration';
export type ExampleStory = { id: StoryKind; title: string; category: string; prompt: string; narration: string; duration: number };
export const stories: ExampleStory[] = [
  { id: 'moon', title: 'The moon collector', category: 'A LITTLE MAGIC', prompt: 'A tiny, fluffy rabbit steals the moon, puts it inside a jar, and realizes the stars are looking for it.', narration: 'One little rabbit wanted the moon all to himself. He tucked it in a jar. But when the stars came looking, he discovered that some wonders are better shared.', duration: 15 },
  { id: 'boat', title: 'A leaf, a little adventure', category: 'INTO THE WILD', prompt: 'A curious little fox sets sail in a fallen leaf, following a dragonfly down a quiet river toward a brand-new adventure.', narration: 'The little fox had never sailed before. But a fallen leaf made a very fine boat. Following a dragonfly, he discovered that the smallest adventures can lead somewhere wonderful.', duration: 15 },
  { id: 'cloud', title: 'Somewhere above the clouds', category: 'DAYDREAMS', prompt: 'A honey-colored bear rides a pink cloud, flying a tiny coral kite and collecting daydreams above the sleepy world.', narration: 'High above the sleepy world, a little bear sailed on a cloud. His kite caught the breeze, and for one lovely moment, every daydream felt just a little closer.', duration: 15 },
];
export const voices = [
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', detail: 'Warm & gentle' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', detail: 'Calm storyteller' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', detail: 'Bright & expressive' },
];
export const generationStages = ['Planning story', 'Recording narration', 'Drawing scenes', 'Validating animation', 'Rendering frames', 'Finishing video'];