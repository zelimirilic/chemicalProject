# chemsoft

## Pre-setup  **only for development
Copy files .env.development.sample, .env.production.sample and vue.config.sample.js 
and rename copies to .env.development, .env.production and vue.config.js.
If needed, replace iChemistry with your iChemistry root name (e.g. iChemistryTrunk).
Do not commit any of these files ever.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```


### Install https  **only for development
Download mkcert from: https://github.com/FiloSottile/mkcert
Run:
mkcert -install
mkcert -pkcs12 -p12-file localhost.pfx localhost
mkcert -cert-file localhost.crt -key-file localhost.key localhost 127.0.0.1 ::1

Copy localhost.crt and localhost.key to chemsoft folder

Change vue.config.js based on vue.config.sample.js

pass:changeit


### Compiles library for iChemistryV3
IChemistry is using components build in this project. To be in position to use those components you have to run npm comand:
```
npm run build:library
```


### Steps to do for installing and building Chemsoft for Production
GO TO Dev02 
 on project source  (RC, product01, stable...) locate folder..\iChemistry Web\iChemistry Albatross\iChemistry Web\Scripts\chemsoft
To set up a production it is necessary to have vue.config.js file with only one line of code.
```
module.exports = {
	publicPath: process.env.NODE_ENV === "production" ? "/Scripts/chemsoft/dist/" : "/"
};
```

This will work fine for https://dev01 or https://product01. If you have a root link like https://dev01/something/ then your public path should use:
```
module.exports = {
	publicPath: process.env.NODE_ENV === "production" ? "/something/Scripts/chemsoft/dist/" : "/"
};
```
And you will probably need to create env.production file
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Sometimes Jenkins cannot finish npm install or npm build commands and that has to be done manually.
In that case, go to chemsoft folder of a project on dev02, find node_modules folder and delete it. After that open terminal (cmd) and run:
```
npm install
npm run build
```
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
If everithing looks ok on build, but you get errors on Chemsoft loading, open Network tab in Chrome and check for red things. If there are some, inspect it and try to check url of files. Usually they have wrong link and that meens that publickPath is not properlly set.


### Steps to do for installing and runing Chemsoft in local environment
Before you start you must first finish ### Install https ### part. For local environment you need to create a .env.development file based on .env.development.samle file:
```
VUE_APP_URL=https://localhost/iChemistry/
VUE_APP_ROUTE_URL=/
```
where VUE_APP_URL is a url to your back-end.

After that run:
```
npm install
npm start
```
ONLY IN LOCAL ENVIRONMENT
Add additional parameter VUE_APP_PLAIN_URL=https://localhost to env.development and env.production files.

### Steps to do for installing and runing IChemistry in local environment
You need to finish all steps from ### Steps to do for installing and runing Chemsoft in local environment ### part and instead of `npm start` run:
```
npm install
npm run start:v3
```


### prettier
http://json.schemastore.org/prettierrc