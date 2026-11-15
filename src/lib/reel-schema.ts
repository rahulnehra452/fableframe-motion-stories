import { z } from 'zod';
export const submissionSchema = z.object({
  prompt: z.string().trim().min(12).max(1200),
  duration: z.union([z.literal(12), z.literal(15), z.literal(18)]),
  voice: z.enum(['XrExE9yKIg1WjnnlVkGX', 'JBFqnCBsd6RMkjVDRZzb', 'EXAVITQu4vr4xnSDxMaL']),
  captions: z.boolean(), music: z.boolean(),
});
export const storyboardSchema = z.object({
  title: z.string().min(1).max(100), narration: z.string().min(1).max(700),
  duration: z.number().min(12).max(18),
  characters: z.array(z.object({ name: z.string(), anatomy: z.string(), colors: z.array(z.string()).min(2), proportions: z.string(), expression: z.string() })).min(1).max(4),
  palette: z.array(z.string()).min(3).max(10), payoff: z.string(),
  scenes: z.array(z.object({ start: z.number().nonnegative(), end: z.number().positive(), action: z.string(), description: z.string(), camera: z.string() })).min(3).max(4),
}).superRefine((story, ctx) => {
  story.scenes.forEach((scene, i) => {
    const previous = story.scenes[i - 1];
    if (scene.end <= scene.start || scene.end > story.duration || Math.abs(scene.start - (previous?.end ?? 0)) > 0.01) ctx.addIssue({ code: 'custom', message: 'Scenes must be positive, contiguous, and within the duration', path: ['scenes', i] });
  });
  if (Math.abs((story.scenes.at(-1)?.end ?? 0) - story.duration) > 0.01) ctx.addIssue({ code: 'custom', message: 'Timeline must cover the entire video', path: ['scenes'] });
});
export function alignNarration(duration: number, speechDuration: number) {
  if (speechDuration > duration - 0.35) throw new Error('Narration needs revision; never clip speech to fit.');
  return { offset: 0.15, tail: duration - speechDuration - 0.15 };
}