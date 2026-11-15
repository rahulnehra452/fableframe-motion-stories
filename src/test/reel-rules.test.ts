import { describe, expect, it } from 'vitest';
import { submissionSchema, storyboardSchema, alignNarration } from '@/lib/reel-schema';
import { validateAnimation } from '@/lib/animation-validation';
import { random, ease } from '@/lib/illustration';
const input = { prompt: 'A rabbit collects the moon and shares it with the stars.', duration: 15, voice: 'XrExE9yKIg1WjnnlVkGX', captions: true, music: false };
const story = { title: 'The moon collector', narration: 'A rabbit learns to share.', duration: 15, characters: [{ name: 'Rabbit', anatomy: 'Long ears', colors: ['ivory', 'pink'], proportions: 'Large head', expression: 'Curious' }], palette: ['navy', 'gold', 'sage'], payoff: 'The moon returns', scenes: [{ start: 0, end: 5, action: 'Looks up', description: 'Moonlight', camera: 'Still' }, { start: 5, end: 10, action: 'Collects', description: 'Jar', camera: 'Still' }, { start: 10, end: 15, action: 'Shares', description: 'Stars', camera: 'Pull back' }] };
describe('Reel rules', () => {
  it('accepts exactly the requested 12, 15, and 18-second options', () => { for (const duration of [12,15,18]) expect(submissionSchema.safeParse({ ...input, duration }).success).toBe(true); expect(submissionSchema.safeParse({ ...input, duration: 16 }).success).toBe(false); });
  it('requires a contiguous 3–4-scene timeline', () => { expect(storyboardSchema.safeParse(story).success).toBe(true); expect(storyboardSchema.safeParse({ ...story, scenes: story.scenes.slice(0,2) }).success).toBe(false); expect(storyboardSchema.safeParse({ ...story, scenes: [{ ...story.scenes[0], end: 4 }, ...story.scenes.slice(1)] }).success).toBe(false); });
  it('rejects scenes beyond duration', () => { expect(storyboardSchema.safeParse({ ...story, scenes: [...story.scenes.slice(0,2), { ...story.scenes[2], end: 16 }] }).success).toBe(false); });
  it('never clips narration that cannot fit', () => { expect(alignNarration(15,14)).toEqual({ offset: .15, tail: .85 }); expect(() => alignNarration(15,15.1)).toThrow('never clip'); });
});
describe('Animation defense-in-depth', () => {
  it('accepts the required frame-independent interface', () => { expect(validateAnimation('function renderFrame(ctx,t,W,H){ctx.fillRect(0,0,W,H);}').valid).toBe(true); });
  it.each(['fetch("https://example.org")', 'window.location', 'eval("1")', 'new Function("return 1")', 'Math.random()', 'ctx["constructor"]', 'ctx["__proto__"]', 'while(true){}', 'setInterval(()=>{},1)', 'ctx[foo]', 'import("evil")'])('rejects dangerous code: %s', code => { expect(() => validateAnimation(`function renderFrame(ctx,t,W,H){${code};}`)).toThrow(); });
  it('rejects an incorrect interface', () => expect(() => validateAnimation('function renderFrame(c,time){return 1;}')).toThrow());
  it('rejects asynchronous functions', () => expect(() => validateAnimation('async function renderFrame(ctx,t,W,H){}')).toThrow());
});
describe('Deterministic drawing helpers', () => {
  it('has identical seeded sequences', () => { const a = random(91), b = random(91), other = random(92); const aa = Array.from({length:20},a), bb = Array.from({length:20},b); expect(aa).toEqual(bb); expect(aa[0]).not.toEqual(other()); });
  it('clamps easing at exact endpoints', () => { expect(ease(-1)).toBe(0); expect(ease(2)).toBe(1); expect(ease(.5)).toBe(.5); });
});