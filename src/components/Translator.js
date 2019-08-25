/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = 'onechat-1566682458777';
const location = 'global';
// const text = 'text to translate';

// Imports the Google Cloud Translation library
const {TranslationServiceClient} = require('@google-cloud/translate').v3beta1;

// Instantiates a client
const translationClient = new TranslationServiceClient();
async function translateText(text, src, tgt) {
  // Construct request
  const request = {
    parent: translationClient.locationPath(projectId, location),
    contents: [text],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: src,
    targetLanguageCode: tgt,
  };

  // Run request
  const [response] = await translationClient.translateText(request);

  for (const translation of response.translations) {
    console.log(`Translation: ${translation.translatedText}`);
  }
}

translateText();

export default translationClient;