import { Controller, Get, Header } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

/**
 * Корень и health.txt — удобно открыть в браузере (не «пустая» вкладка).
 */
@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  root(): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>3D Stock API</title>
<style>body{font-family:system-ui,sans-serif;max-width:40rem;margin:2rem;line-height:1.5}</style></head><body>
<h1>3D Stock API</h1>
<p>Server is running. Useful links:</p>
<ul>
<li><a href="/health">/health</a> — JSON (если вкладка кажется пустой — «Просмотр кода страницы» или ссылка ниже)</li>
<li><a href="/health.txt">/health.txt</a> — plain text <code>ok</code></li>
<li><a href="/api/docs">/api/docs</a> — Swagger</li>
<li><a href="/assets">/assets</a> — каталог (JSON)</li>
</ul>
</body></html>`;
  }

  @Get('health.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  healthTxt(): string {
    return `ok\n3D Stock API\n${new Date().toISOString()}\n`;
  }
}
