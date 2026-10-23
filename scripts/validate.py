"""Check index completeness, local Markdown targets, and downloaded PDF hashes."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main():
    papers = json.loads((ROOT / 'data/papers.json').read_text())
    assert len({p['id'] for p in papers}) == len(papers), 'Duplicate paper IDs'
    assert len({p['url'] for p in papers}) == len(papers), 'Duplicate source URLs'
    fields = ['id', 'title', 'year', 'venue', 'category', 'priority', 'url', 'method', 'relevance', 'limitation', 'review_level']
    for p in papers:
        assert all(p.get(f) for f in fields), f"Missing metadata: {p['id']}"
        assert p['priority'] in {'P0', 'P1', 'P2'}
    for file in ROOT.rglob('*.md'):
        if '.git' in file.parts:
            continue
        for target in re.findall(r'\]\(([^)]+)\)', file.read_text()):
            if target.startswith(('https://', 'http://', '#', 'mailto:')):
                continue
            assert (file.parent / target.split('#')[0]).exists(), f'Broken local link: {file}: {target}'
    for m in json.loads((ROOT / 'data/pdf_manifest.json').read_text()):
        content = (ROOT / m['path']).read_bytes()
        assert content.startswith(b'%PDF-')
        assert hashlib.sha256(content).hexdigest() == m['sha256'], f"Hash mismatch: {m['path']}"
    repos = json.loads((ROOT / 'data/repositories.json').read_text())
    assert all(re.fullmatch(r'[a-f0-9]{40}', r['commit']) for r in repos)
    print(f'OK: {len(papers)} papers; {len(repos)} repository commits; local links and PDF hashes valid')


if __name__ == '__main__':
    main()
