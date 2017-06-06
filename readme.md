# srnd.org

## File Locations

In general, fully compiled resources will be in the `public/assets` folder, while sources will be in the `resources`
folder. More specifically, you can find resources:

- Images, scripts: `public/assets`
- Stylesheets: `resources/assets/sass`
- Pages/templates: `resources/views`
- Translation strings: `resources/lang`


## Translations

Translations are managed by Transifex. You should only ever edit `en` translations here; edits to other languages will
be overwritten when you `tx pull`. When you've made changes to translations, `tx push`, then use the Transifex UI to
order translations to other languages. (Or translate them using the web UI yourself if you're really good.)

## Press Photos/Videos

Press assets should be uploaded to the `assets.srnd.org` s3 bucket, and will automatically appear on the press page
when present.

Images should be in the `press/images/` folder. There are two subfolders, `sml` for small (500x333px) images, and
`lg` for originals. Both versions must be present, and must have the exact same file name. You can use a command like
this to convert automatically:

```
convert "*.jpg" -resize "500x333^" -gravity center -crop 500x333+0+0 +repage -set filename:base "%[base]" "../../sml/Presentations and Awards/%[filename:base].jpg"
```

Videos should be in the `press/videos/` folder. Similar to the images, there are two subfolders, `thumb` for thumbnails
(500x333px), and `video` for source videos. Video should be encoded and saved as `.mp4`, HD resolution and high quality.
