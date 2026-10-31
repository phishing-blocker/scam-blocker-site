# scam-blocker-site

`scam-blocker.re-x.info` のサイトです。怪しい電話や偽サイトから家族を守るアプリ「おるで」の案内ページを置きます。

## ページ

| パス | 内容 | 公開 |
| --- | --- | --- |
| `/` | トップ（サイト名と各ページへのリンク） | する |
| `/after-call` | Tips カード「電話のあとの確認に答える」の「詳しく見る」先。モバイル側の `AFTER_CALL_HELP_URL` には `https://scam-blocker.re-x.info/after-call` を入れる | する |
| `/.well-known/assetlinks.json` | Android App Links 用（パッケージ `info.re_x.scam_blocker`、Play アプリ署名鍵の SHA-256） | する |
| `/privacy` | プライバシーポリシー | しない（下書きのみ） |

`/privacy` は下書きを [docs/privacy-draft.md](docs/privacy-draft.md) に置いています。出所と未公開の理由は同ファイルに書いています。確定したら `public/privacy/index.html` を作って公開します。

## 置き方

公開するファイルは `public/` の中です。ビルドはしません（そのまま配信できる HTML / CSS / JSON です）。

## 公開（Cloudflare Pages）

Cloudflare Pages のプロジェクト `scam-blocker-site` に `public/` を配信し、カスタムドメイン `scam-blocker.re-x.info` を割り当てます。

デプロイは GitHub Actions（`.github/workflows/deploy.yml`、main への push と手動実行）で行います。プロジェクト作成、`public/` の配信、カスタムドメイン `scam-blocker.re-x.info` の割り当て（Pages へのドメイン追加と CNAME）までワークフローに含めています。

資格情報は GitHub シークレットで渡します。値はリポジトリに書きません。

| シークレット名 | 中身 |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API トークン（Account: Cloudflare Pages = Edit、Zone `re-x.info`: DNS = Edit / Zone = Read） |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare アカウント ID |

未登録の間はデプロイのステップが失敗します（資格情報の登録待ち）。
