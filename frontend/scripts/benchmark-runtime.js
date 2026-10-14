import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = process.env.URL || 'http://127.0.0.1:4173/';

async function runScenarioBenchmark() {
  console.log(`Starting runtime performance benchmark on ${TARGET_URL}...`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-extensions',
    ],
  });

  const page = await browser.newPage();

  // Inject performance instrumentation before page load
  await page.evaluateOnNewDocument(() => {
    window.__perf = {
      gbcCount: 0,
      rafCount: 0,
      longTasks: [],
    };

    const origGBC = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function () {
      window.__perf.gbcCount++;
      return origGBC.apply(this, arguments);
    };

    let rafTracking = true;
    const trackRaf = () => {
      if (rafTracking) {
        window.__perf.rafCount++;
        requestAnimationFrame(trackRaf);
      }
    };
    requestAnimationFrame(trackRaf);

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__perf.longTasks.push({
            name: entry.name,
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime),
          });
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // PerformanceObserver fallback
    }
  });

  // Start DevTools Trace
  const tracePath = path.resolve(__dirname, '../perf/runtime-trace.json');
  await page.tracing.start({
    path: tracePath,
    screenshots: false,
    categories: [
      'devtools.timeline',
      'disabled-by-default-devtools.timeline',
      'disabled-by-default-devtools.timeline.frame',
      'blink.user_timing',
    ],
  });

  console.log('Navigating to target page...');
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });

  // Helper to reset and capture delta metrics
  async function snapshot(actionName, durationMs, actionFn) {
    console.log(`\n▶ Running Scenario: ${actionName} (${durationMs}ms)...`);
    await page.evaluate(() => {
      window.__perf.gbcCount = 0;
      window.__perf.rafCount = 0;
      window.__perf.longTasks = [];
    });

    const start = performance.now();
    if (actionFn) {
      await actionFn();
    } else {
      await new Promise((r) => setTimeout(r, durationMs));
    }
    const elapsed = Math.round(performance.now() - start);

    const metrics = await page.evaluate(() => {
      return {
        gbcCount: window.__perf.gbcCount,
        rafCount: window.__perf.rafCount,
        longTasksCount: window.__perf.longTasks.length,
        longTasksTotalDuration: window.__perf.longTasks.reduce((sum, t) => sum + t.duration, 0),
        longTasks: window.__perf.longTasks,
      };
    });

    metrics.scenario = actionName;
    metrics.elapsedMs = elapsed;
    console.log(`  ✓ Results: GBC calls: ${metrics.gbcCount} | rAF ticks: ${metrics.rafCount} | Long tasks: ${metrics.longTasksCount} (${metrics.longTasksTotalDuration}ms)`);
    return metrics;
  }

  const results = {};

  // Dismiss intro if present so we enter Hero section
  try {
    const skipBtn = await page.$('.skip-intro-btn');
    if (skipBtn) {
      console.log('Dismissing intro to reach Hero section...');
      await skipBtn.click();
      await new Promise((r) => setTimeout(r, 1200));
    }
  } catch (e) {
    // Already in main site
  }

  // (a) 10 s idle on Hero
  results['scenario_a_hero_idle_10s'] = await snapshot('Scenario A: 10s Idle on Hero', 10000);

  // (b) Scroll Hero -> Factory section
  results['scenario_b_scroll_hero_to_factory'] = await snapshot(
    'Scenario B: Scroll Hero -> Factory Section',
    3500,
    async () => {
      for (let i = 0; i < 35; i++) {
        await page.mouse.wheel({ deltaY: 120 });
        await new Promise((r) => setTimeout(r, 90));
      }
      await new Promise((r) => setTimeout(r, 500));
    }
  );

  // (c) Pointer movement over the factory scene
  results['scenario_c_pointer_factory_scene'] = await snapshot(
    'Scenario C: Pointer Movement Over 3D Factory Scene',
    3500,
    async () => {
      const box = await page.evaluate(() => {
        const el = document.querySelector('#how-it-works') || document.querySelector('.agentic-factory-3d');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, width: r.width, height: r.height };
      });

      if (box) {
        for (let i = 0; i < 40; i++) {
          const offsetX = Math.sin(i * 0.4) * 200;
          const offsetY = Math.cos(i * 0.4) * 120;
          await page.mouse.move(box.x + offsetX, box.y + offsetY);
          await new Promise((r) => setTimeout(r, 60));
        }
      }
    }
  );

  // (d) Interacting with WorksWheel then idling
  results['scenario_d_workswheel_interaction_then_idle'] = await snapshot(
    'Scenario D: Interacting with WorksWheel Then Idle',
    4000,
    async () => {
      await page.evaluate(() => {
        const el = document.getElementById('services-wheel');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
      await new Promise((r) => setTimeout(r, 400));

      // Simulate mouse drag or wheel interaction
      await page.mouse.wheel({ deltaY: 250 });
      await new Promise((r) => setTimeout(r, 300));
      await page.mouse.wheel({ deltaY: -250 });
      await new Promise((r) => setTimeout(r, 300));

      // Idle 3 seconds
      await new Promise((r) => setTimeout(r, 3000));
    }
  );

  // (e) Idle at bottom of page
  results['scenario_e_bottom_idle_5s'] = await snapshot(
    'Scenario E: Idle at Bottom of Page',
    5000,
    async () => {
      await page.evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      });
      await new Promise((r) => setTimeout(r, 5000));
    }
  );

  // Stop DevTools Tracing
  await page.tracing.stop();
  await browser.close();

  // Parse Chrome DevTools Performance Trace
  console.log('\nAnalyzing Chrome DevTools Trace JSON...');
  let traceData;
  try {
    const raw = fs.readFileSync(tracePath, 'utf8');
    traceData = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse trace JSON:', e);
  }

  let totalRecalcStyleMs = 0;
  let recalcStyleCount = 0;
  let totalLayoutMs = 0;
  let layoutCount = 0;
  let totalUpdateLayoutTreeMs = 0;
  let animationFrameFiredCount = 0;

  if (traceData && traceData.traceEvents) {
    for (const evt of traceData.traceEvents) {
      if (evt.name === 'RecalculateStyles' && evt.dur) {
        totalRecalcStyleMs += evt.dur / 1000;
        recalcStyleCount++;
      } else if (evt.name === 'Layout' && evt.dur) {
        totalLayoutMs += evt.dur / 1000;
        layoutCount++;
      } else if (evt.name === 'UpdateLayoutTree' && evt.dur) {
        totalUpdateLayoutTreeMs += evt.dur / 1000;
      } else if (evt.name === 'FireAnimationFrame') {
        animationFrameFiredCount++;
      }
    }
  }

  const traceSummary = {
    totalRecalcStyleMs: Math.round(totalRecalcStyleMs),
    recalcStyleCount,
    totalLayoutMs: Math.round(totalLayoutMs),
    layoutCount,
    totalUpdateLayoutTreeMs: Math.round(totalUpdateLayoutTreeMs),
    animationFrameFiredCount,
  };

  console.log('\n================ CHROME TRACE SUMMARY ================');
  console.log(`RecalculateStyles: ${traceSummary.totalRecalcStyleMs}ms (count: ${recalcStyleCount})`);
  console.log(`Layout (Forced/Reflows): ${traceSummary.totalLayoutMs}ms (count: ${layoutCount})`);
  console.log(`UpdateLayoutTree: ${traceSummary.totalUpdateLayoutTreeMs}ms`);
  console.log(`Animation Frame Fired: ${animationFrameFiredCount}`);
  console.log('======================================================\n');

  const finalOutput = {
    timestamp: new Date().toISOString(),
    scenarios: results,
    traceSummary,
  };

  const outJson = path.resolve(__dirname, '../perf/runtime-results.json');
  fs.writeFileSync(outJson, JSON.stringify(finalOutput, null, 2));
  console.log(`Saved benchmark results to ${outJson}`);

  return finalOutput;
}

runScenarioBenchmark().catch((e) => {
  console.error('Benchmark failed:', e);
  process.exit(1);
});
