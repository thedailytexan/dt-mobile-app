# API Notes

## WordPress Primary Categories

| Category | ID | Slug | Description |
| :--- | :--- | :--- | :--- |
| **News** | `218` | `news` | Campus, city, politics, administration, etc. |
| **Sports** | `226` | `sports` | All athletics coverage and analysis. |
| **Life&Arts** | `235` | `life-n-arts` | Culture, entertainment, features, reviews. |
| **Projects** | `22312` | `projects` | Longer-term or special reporting projects. |
| **Opinion** | `222` | `opinion` | Columns, editorials, letters. |
| **Multimedia** | `256` | `multimedia` | Videos, photo stories, audio pieces. |
| **Texan en Español** | `15894` | `texan-en-espanol` | Spanish-language coverage. |
| **Flipbooks / Print** | `12916` | `dt-mag` | Digital versions of the print paper. |
| **Obituaries** | `15253` | `obituaries` | Memorial pieces. |

## Sub-Categories & Specific Sections

| Category | ID | Slug | Parent |
| :--- | :--- | :--- | :--- |
| **Shorts** | `24867` | `shorts` | Multimedia (`256`) |
| **Club Sports** | `22986` | `club-sports` | Sports (`226`) |
| **Editorials** | `13104` | `editorials` | Opinion (`222`) |
| **Columns** | `223` | `columns` | Opinion (`222`) |

## Useful API Endpoints

- **All Categories**: `https://thedailytexan.com/wp-json/wp/v2/categories?per_page=100`
- **Posts in Category**: `https://thedailytexan.com/wp-json/wp/v2/posts?categories={ID}`
