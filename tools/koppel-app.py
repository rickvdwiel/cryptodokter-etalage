#!/usr/bin/env python3
"""Koppel het app-manifest en de service worker in index.html. Eenmalig en idempotent."""
from pathlib import Path

path = Path("index.html")
text = path.read_text(encoding="utf-8")
icon = '<link rel="apple-touch-icon" href="apple-touch-icon.png">'
manifest = """<link rel="manifest" href="/manifest.json">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="cryptodokter.nl">"""
if 'rel="manifest"' not in text:
    if text.count(icon) != 1:
        raise SystemExit("apple-touch-icon niet uniek")
    text = text.replace(icon, icon + "\n" + manifest, 1)
sw = """<script>
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(function () {});
  });
}
</script>
"""
if "serviceWorker.register" not in text:
    if text.count("</body>") != 1:
        raise SystemExit("body niet uniek")
    text = text.replace("</body>", sw + "</body>", 1)
path.write_text(text, encoding="utf-8")
