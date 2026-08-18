# Hanukkiot — A Collection

A website for a family collection of 73 hanukkiot (Hanukkah menorahs): a Foreword,
an Introduction, seven chapters, and a titled, illustrated story for every piece.

## What's in this folder

```
index.html          the whole site (one page)
styles.css           all styling
script.js             loads content.json and builds the page
content.json         Foreword, Introduction, chapters, and all 73 titles/captions
images/thumbs/       web-sized images for the gallery grid (~700px wide)
images/full/         larger images for the lightbox view (~1600px wide)
```

Everything is plain HTML/CSS/JS — no build step, no dependencies to install.

## Putting it on GitHub Pages

You don't need to use the command line for this — everything below can be done
in the browser on github.com.

1. **Create a repository.**
   Go to [github.com/new](https://github.com/new). Give it a name (e.g.
   `hanukkiot-collection`), leave it Public, and click **Create repository**.

2. **Upload the files.**
   On your new repository's page, click **Add file → Upload files**. Drag
   in *everything inside this folder* (`index.html`, `styles.css`, `script.js`,
   `content.json`, and the whole `images` folder). Scroll down and click
   **Commit changes**.
   - Tip: dragging the `images` folder itself (not its contents one by one)
     preserves the `images/thumbs/` and `images/full/` structure.

3. **Turn on GitHub Pages.**
   Go to your repository's **Settings** tab → **Pages** (left sidebar).
   Under "Build and deployment," set **Source** to `Deploy from a branch`,
   set **Branch** to `main` and the folder to `/ (root)`, then click **Save**.

4. **Visit your site.**
   GitHub will show a message like "Your site is live at
   `https://yourusername.github.io/hanukkiot-collection/`" — it usually
   takes a minute or two to go live the first time.

## Editing the text later

All the writing — Foreword, Introduction, chapter intros, and every title
and caption — lives in `content.json` in one place. You can open it in any
text editor, make changes, and re-upload just that file (GitHub will let
you edit it directly in the browser too, via the pencil icon on the file's
page). No need to touch the HTML/CSS.

## Editing or adding images

Images are matched to captions by their 3-digit number (e.g. `042.jpg`
in both `images/thumbs/` and `images/full/` corresponds to item "042" in
`content.json`). To add a 74th piece, add a new item to `content.json`
with number `074`, and drop `074.jpg` into both image folders.
