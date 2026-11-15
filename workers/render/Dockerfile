# Trusted local sample renderer, not a generated-code security sandbox.
FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*
WORKDIR /renderer
COPY workers/render/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt && python -m playwright install --with-deps chromium
COPY workers/render/render_samples.py ./render_samples.py
RUN useradd --create-home --uid 10001 renderer && chmod -R a+rX /root/.cache/ms-playwright && cp -r /root/.cache/ms-playwright /opt/playwright && chmod -R a+rX /opt/playwright
ENV PLAYWRIGHT_BROWSERS_PATH=/opt/playwright
USER renderer
ENTRYPOINT ["python", "render_samples.py"]