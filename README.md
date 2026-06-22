# Wedding Invitation

Сайт свадебного приглашения на Vite, TypeScript и SCSS.

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Деплой

В проекте есть GitHub Actions workflow для публикации в GitHub Pages:

- `push` в `main`
- сборка через `npm run build`
- публикация содержимого `dist`

Для работы Pages в репозитории нужно включить `Settings -> Pages -> Source: GitHub Actions`.

## Структура

- `src/` — исходники сайта
- `src/index.html` — основной HTML
- `src/scripts/` — TypeScript-логика
- `src/styles/` — SCSS-стили
- `src/assets/` — изображения
- `.github/workflows/deploy.yml` — автодеплой в GitHub Pages
