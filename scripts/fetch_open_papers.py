"""Fetch three verified CC BY 4.0 PDFs without changing the original files."""
import hashlib
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = [('P01', '2411.14499v4'), ('P08', '2410.09252v2'), ('P10', '2606.27780v3')]


def main():
    metadata = {m['arxiv_id']: m for m in json.loads((ROOT / 'data/arxiv_metadata.json').read_text())}
    manifest = []
    for pid, version in SOURCES:
        meta = metadata[version.split('v')[0]]
        license_url = 'https://creativecommons.org/licenses/by/4.0/'
        if not any(u.replace('http:', 'https:') == license_url for u in meta['license_urls']):
            raise ValueError(f'CC BY license was not verified: {version}')
        url = 'https://arxiv.org/pdf/' + version
        path = ROOT / 'papers' / f'{pid}_{version}.pdf'
        if path.exists():
            content = path.read_bytes()
        else:
            with urllib.request.urlopen(url, timeout=60) as response:
                content = response.read()
        if not content.startswith(b'%PDF-') or len(content) < 10000:
            raise ValueError(f'Invalid PDF response: {version}')
        path.write_bytes(content)
        manifest.append({'id': pid, 'title': meta['title'][0], 'authors': meta['authors'],
                         'version': version, 'source': url, 'license': license_url,
                         'modified': False, 'path': str(path.relative_to(ROOT)),
                         'sha256': hashlib.sha256(content).hexdigest(), 'bytes': len(content),
                         'retrieved_at': '2026-10-23'})
        print(f'{pid}: {len(content)} bytes')
    (ROOT / 'data/pdf_manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    lines = ['# 收录的开放论文 PDF', '', '以下原始 PDF 根据其 arXiv 页面标明的 CC BY 4.0 收录，保留原件，未修改内容。原作者保留著作权。许可允许在署名等条件下分享。', '',
             '许可证：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。其余论文请使用论文卡片中的原始链接。', '']
    for m in manifest:
        lines += [f"## {m['id']} · {m['title']}", '', f"- 作者：{'; '.join(m['authors'])}",
                  f"- 文件：[{Path(m['path']).name}]({Path(m['path']).name})",
                  f"- 原始来源：[{m['version']}]({m['source']})",
                  f"- 许可：[CC BY 4.0]({m['license']})；修改：无；获取日期：{m['retrieved_at']}。",
                  f"- SHA-256：`{m['sha256']}`", '']
    (ROOT / 'papers/README.md').write_text('\n'.join(lines), encoding='utf-8')


if __name__ == '__main__':
    main()
