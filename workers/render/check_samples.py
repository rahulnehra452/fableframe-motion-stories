"""Browser integration checks for trusted drawing and actual sample delivery."""
import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

async def main():
    output = Path('/tmp/browser/fableframe')
    output.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width':1280, 'height':1800}, accept_downloads=True)
        page = await context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        await page.goto('http://localhost:8080/', wait_until='networkidle')
        checks = await page.evaluate('''async () => {
          const {renderStory} = await import('/src/lib/illustration.ts');
          const c = document.createElement('canvas'); c.width=360; c.height=640;
          const ctx = c.getContext('2d');
          return ['moon','boat','cloud'].map(story => {
            renderStory(ctx,2,360,640,story); const a=c.toDataURL();
            const pixel=ctx.getImageData(0,0,360,640).data;
            const visible=Array.from(pixel).filter((v,i)=>i%4===3&&v>0).length;
            const varied=new Set(Array.from(pixel).filter((v,i)=>i%4!==3)).size;
            renderStory(ctx,2,360,640,story); const b=c.toDataURL();
            renderStory(ctx,7,360,640,story); const d=c.toDataURL();
            return {story,deterministic:a===b,moving:a!==d,visible,varied};
          });
        }''')
        for check in checks:
            assert check['deterministic'] and check['moving']
            assert check['visible'] == 360*640 and check['varied'] > 100
        print('DRAWING CHECKS:',json.dumps(checks))
        for story in ['moon','boat','cloud']:
            await page.goto(f'http://localhost:8080/examples/{story}', wait_until='networkidle')
            await page.wait_for_function('''() => {
                const v=document.querySelector('video');return v&&v.readyState>=1;
            }''', timeout=30000)
            meta = await page.locator('video').evaluate('(v)=>({w:v.videoWidth,h:v.videoHeight,d:v.duration})')
            assert meta['w']==1080 and meta['h']==1920 and abs(meta['d']-15)<.2
            await page.locator('video').evaluate('(v)=>{v.muted=true; return v.play();}')
            await page.wait_for_function("document.querySelector('video').currentTime>0.2")
            await page.locator('video').evaluate('(v)=>v.pause()')
            async with page.expect_download(timeout=30000) as download_event:
                await page.get_by_role('link',name='Download sample MP4').click()
            download=await download_event.value
            target=output/f'download-{story}.mp4'
            await download.save_as(target)
            data=target.read_bytes()
            assert len(data)>100000 and b'ftyp' in data[:32]
            print(f'DELIVERY CHECK: {story}, {meta}, {len(data)} bytes, {download.suggested_filename}')
        await page.screenshot(path=str(output/'verified-result.png'))
        await page.goto('http://localhost:8080/',wait_until='networkidle')
        await page.screenshot(path=str(output/'verified-studio.png'))
        for path in ['/examples','/creations','/account','/about','/terms','/privacy','/content-policy']:
            await page.goto('http://localhost:8080'+path,wait_until='networkidle')
            assert await page.locator('h1').count()==1
            assert 'Fableframe' in await page.title()
            assert await page.locator('meta[property="og:title"]').count()>0
        print('ALL CONTENT PAGES: titles, headings and open graph present')
        await page.set_viewport_size({'width':390,'height':844})
        await page.goto('http://localhost:8080/',wait_until='networkidle')
        await page.get_by_role('button',name='Bring my story to life').scroll_into_view_if_needed()
        await page.screenshot(path=str(output/'mobile-settings.png'))
        await page.get_by_role('button',name='Bring my story to life').click()
        assert 'No credits were charged' in await page.get_by_role('dialog').inner_text()
        await page.get_by_role('button',name='Close',exact=True).click()
        await page.locator('.preview-section').scroll_into_view_if_needed()
        await page.screenshot(path=str(output/'mobile-preview.png'))
        assert await page.evaluate('document.body.scrollWidth<=innerWidth')
        assert errors==[],errors
        print('RUNTIME ERRORS:',errors)
        await browser.close()

if __name__=='__main__':
    asyncio.run(main())