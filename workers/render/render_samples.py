"""Render TRUSTED example animations via Canvas to a streaming FFmpeg encoder.

Never pass generated code here. Untrusted code requires a separately deployed
network-isolated, secret-free OS sandbox. This workflow is local sample rendering.
"""
import argparse
import asyncio
import json
import math
import struct
import subprocess
import wave
from pathlib import Path
from playwright.async_api import async_playwright


def soundtrack(path: Path, duration: float):
    """Original quiet pentatonic motif; no third-party soundtrack assets."""
    sample_rate = 44100
    notes = [261.63, 329.63, 392.0, 523.25, 440.0, 392.0, 329.63, 293.66]
    with wave.open(str(path), 'wb') as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(sample_rate)
        block = bytearray()
        for i in range(int(duration * sample_rate)):
            t = i / sample_rate
            phase = t % 1.5
            frequency = notes[int(t / 1.5) % len(notes)]
            envelope = (1 - math.exp(-phase * 35)) * math.exp(-phase * 2.8)
            fade = min(1, t / .6, max(0, (duration - t) / 1.2))
            sound = math.sin(2 * math.pi * frequency * t) + .22 * math.sin(2 * math.pi * frequency * 2 * t)
            block.extend(struct.pack('<h', int(sound * envelope * fade * 2100)))
        output.writeframes(block)


def probe(path: Path, width: int, height: int, duration: int):
    info = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)]))
    video = next(s for s in info['streams'] if s['codec_type'] == 'video')
    audio = next((s for s in info['streams'] if s['codec_type'] == 'audio'), None)
    assert video['width'] == width and video['height'] == height
    assert video['codec_name'] == 'h264' and video['pix_fmt'] == 'yuv420p'
    assert video['avg_frame_rate'] == '30/1'
    assert abs(float(info['format']['duration']) - duration) < .2
    assert audio and audio['codec_name'] == 'aac'
    return info


async def render(args):
    import base64
    args.output.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 1800})
        page = await context.new_page()
        await page.goto(args.origin, wait_until='networkidle')
        await page.evaluate('''async () => {
            const toolkit = await import('/src/lib/illustration.ts');
            window.sampleRender = toolkit.renderStory;
            const canvas = document.createElement('canvas');
            window.sampleCanvas = canvas;
        }''')
        for story in args.stories:
            path = args.output / f'{story}.mp4'
            audio = args.output / f'{story}-ambient.wav'
            soundtrack(audio, args.duration)
            command = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-vcodec', 'mjpeg', '-i', 'pipe:0', '-i', str(audio), '-map', '0:v:0', '-map', '1:a:0', '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-color_range', 'tv', '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-t', str(args.duration), '-movflags', '+faststart', str(path)]
            encoder = subprocess.Popen(command, stdin=subprocess.PIPE)
            try:
                for frame in range(args.duration * 30):
                    image = await page.evaluate('''([story,t,w,h]) => {
                        const canvas = window.sampleCanvas;
                        if (canvas.width !== w) canvas.width = w;
                        if (canvas.height !== h) canvas.height = h;
                        window.sampleRender(canvas.getContext('2d'), t, w, h, story);
                        return canvas.toDataURL('image/jpeg', .92).split(',')[1];
                    }''', [story, frame / 30, args.width, args.height])
                    if encoder.stdin is None:
                        raise RuntimeError('Encoder pipe missing')
                    encoder.stdin.write(base64.b64decode(image))
                    if frame in [0, 180, 360]:
                        png = await page.evaluate("() => window.sampleCanvas.toDataURL('image/png').split(',')[1]")
                        (args.output / f'{story}-frame-{frame}.png').write_bytes(base64.b64decode(png))
                encoder.stdin.close()
                if encoder.wait(timeout=60) != 0:
                    raise RuntimeError('FFmpeg failed')
            except BaseException:
                encoder.kill()
                encoder.wait()
                raise
            info = probe(path, args.width, args.height, args.duration)
            (args.output / f'{story}.metadata.json').write_text(json.dumps(info, indent=2))
            audio.unlink(missing_ok=True)
            print(f'VERIFIED {path.name}: {args.width}x{args.height}, 30 fps, H.264, AAC, {args.duration}s, {path.stat().st_size} bytes', flush=True)
        await browser.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--origin', default='http://localhost:8080')
    parser.add_argument('--output', type=Path, default=Path('/tmp/fableframe-renders'))
    parser.add_argument('--stories', nargs='+', choices=['moon', 'boat', 'cloud'], default=['moon', 'boat', 'cloud'])
    parser.add_argument('--width', type=int, default=1080)
    parser.add_argument('--height', type=int, default=1920)
    parser.add_argument('--duration', type=int, choices=[12, 15, 18], default=15)
    asyncio.run(render(parser.parse_args()))