# Indiapicture

## Getting Started

1. Make sure you have NodeJS newer version 12, and NPM version 6.9.
(For windows you can download - https://nodejs.org/en/download/)
2. Check node and npm version After Install check `Node -v`  and `npm -v`
3. Open terminal
4. Clone the repo: `https://github.com/mahattamultimedia/indiapicture_website_frontend.git`
5. run `npm i` to install node packages.
6. start with `ng serve`
7. App should be running in `https://localhost:4200`

## Build

1. Run `ng build` to build project (dist folder creatd in project directory)
2. Run `ng build --prod --aot`  to build for production.
3. Run `ng build --configuration beta --aot` to build for beta
4. Run `ng build --configuration dev1 --aot` to build for dev1

## Notes

1. To change the api urls `src/app/app.service`
2. To chnage the slider of home/editorial/video page `src/assets/data/home-slider.json` `src/assets/data/editorial-slider.json` `src/assets/data/video-slider.json`
3. To change the categories of home, Image - `src/assets/data/home-banner.json`, Video - `src/assets/data/video-slider.json`
4. To change the categories of editorial, Image - `src/assets/data/editorial-banner.json`
5. Update `src/assets/data/categories.json` to update collection price and on addition on new collection

