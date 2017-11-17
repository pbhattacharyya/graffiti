# graffiti

A Chrome extension to replace hate speech with art from LGBTQ+ artists. 🌈

### Development

- Duplicate the `env.sample.js` file and rename it to `env.js`
- Create an account and a new application for the [Unplash API](https://unsplash.com/developers)
- Copy your Application ID from the Unsplash API and set it as the value to `GRAFFITI_EXT_UNSPLASH_CLIENT_ID` in your `env.js` file

The code is written in Typescript, so you need to compile it before testing the extension. To do that using [node.js](https://nodejs.org/en/):

```
// Install Typescript
npm install -g typescript

// Build the project
tsc -p graffiti/.vscode
```

After that you can upload the extension by opening Chrome, going to chrome://extensions/, clicking on "Load unpacked extension...", and selecting the graffiti folder.

### Thanks

- Hate Speech Lexicon from [t-davidson/hate-speech-and-offensive-language](https://github.com/t-davidson/hate-speech-and-offensive-language/blob/master/lexicons/hatebase_dict.csv)
- [Unsplash API](https://unsplash.com/developers)
