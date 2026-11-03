"""データ提供元（credits）の生成物 src/data/credits.json を、analytics の取り込み登録簿から作る。

正本は phishing-blocker/analytics の src/phishing_analytics/ingest_sources.py
（IngestSource.credit と credits()）。表示文は登録簿どおりで、ここでは加工しない。

使い方（analytics のチェックアウトの場所を渡す。main の最新を使うこと）:
    python3 -I scripts/export-credits.py /path/to/analytics > src/data/credits.json
"""
import json
import sys
from pathlib import Path

root = Path(sys.argv[1]).resolve()
sys.path.insert(0, str(root / "src"))
from phishing_analytics.ingest_sources import credits  # noqa: E402

print(json.dumps(credits(), ensure_ascii=False, indent=2))
