# Microsoft Translator Speech to Text Service
(Unofficial) NodeJS service wrapper for Microsoft Translator Speech API

`npm install ms-translator-speech-service`

This service wrapper supports the speech to text functionality of the Microsoft Translator API.

## Installation

1. Install [NodeJS](http://nodejs.org) on your computer
2. Create a new directory for your code project if you haven't already
2. Open a terminal and run `npm install ms-translator-speech-service` from your project directory

## Usage

You'll first need to [create a Microsoft Translator Speech API key](https://www.microsoft.com/en-us/translator/getstarted.aspx). You can do this while logged in to the Azure Portal.

The following code will get you up and running with the essentials:

```js
const translationService = require('ms-translator-speech-service');

const options = {
  subscriptionKey: '<your api key>',
  toLanguage: 'en',
  fromLanguage: 'en',
  features: {
    partial: false,
    timinginfo: true
  }
};

const translator = new translationService(options);

translator.start((error, service) => {
  if (!error) {
    console.log('translator service started.');
  }
});

```

See the [API section](#api-reference) of these docs for details on configuration and methods.

## Example

**Scenario: translating an existing audio speech file.** Remember to check the [Translation API docs](http://docs.microsofttranslator.com/speech-translate.html) for details on the audio data format needed.

```js
const translationService = require('ms-translator-speech-service');

// set up and connect to Translator API
const options = {
  subscriptionKey: '<your api key>',
  toLanguage: 'en',
  fromLanguage: 'en'
};

const translator = new translationService(options);

translator.start((error, service) => {
  if (error) return console.error(error);

  service.on('message', (message) => {
    const translation = JSON.parse(message.utf8Data);
    console.log(translation);
  });

  service.sendFile('/path/to/audio.wav');

});

```


## API Reference

### TranslatorService(options)

+ `options` _Object_
+ **Returns** `TranslatorService`

Creates a new instance of `TranslatorService`.

```js
const translator = new translationService(options);
```

Available options are below:

| name                      | type      | description                                                                                              | default | required |
|---------------------------|-----------|----------------------------------------------------------------------------------------------------------|---------|----------|
| `subscriptionKey`         | `String`  | your Translator API key                                                                                  | n/a     | yes      |
| `fromLang`                | `String`  | the language you want to translate from. See supported languages in the [official Microsoft Translator API docs](https://www.microsoft.com/en-us/translator/languages.aspx).                                                                  | `'en'`  | no       |
| `toLang`                  | `String`  | the language you want to translate to. See supported languages in the [official Microsoft Translator API docs](https://www.microsoft.com/en-us/translator/languages.aspx).                                                                    | `'en'`  | no       |
| `features`                | `Object`  | additional features needed from the API                                                                  | `{}`    | no       |
| `partial`    | `Boolean` | defined under the `features` option. Returns partial translation results in additional to final results. | `false` | no       |
| `timinginfo` | `Boolean` | defined under the `features` option. Returns timing info in translation results.                         | `false` | no       |


### translator.start(callback)

+ `callback` _Function_

Connects to the Speech API websocket on your behalf and returns the websocket instance once connected. Callback follows the errorback pattern.

```js
translator.start((error, service) => {
  if (!error) console.log('translator service started.');
});
```

### translator.stop(callback)

+ `callback` _Function_

Disconnects from the established websocket connection to the Speech API. Callback follows the errorback pattern.

```js
translator.stop((error) => {
  if (!error) console.log('translator service stopped.');
});
```

### service.send(buffer)

+ `buffer` _Buffer_

Sends an audio payload to the Speech API websocket connection. Audio payload is a native NodeJS Buffer.

See the 'Sending Audio' section of the [Translation API docs](http://docs.microsofttranslator.com/speech-translate.html) for details on the data format needed.

```js
service.send(myAudioBufferChunk);
```

### service.sendFile(filepath, callback)

+ `filepath` _String_
+ `callback` _Function_ (optional)

Streams an audio file from disk to the Speech API websocket connection. Optional callback follows errorback pattern.

See the 'Sending Audio' section of the [Translation API docs](http://docs.microsofttranslator.com/speech-translate.html) for details on the data format needed for the audio file.

```js
service.sendFile('/path/to/audiofile.wav', (error) => {
  if (!error) console.log('file sent.');
});
```

### service.on('message', callback)

+ `callback` _Function_

Event listener for incoming translation message payloads from the Speech API. Message payload is a JSON object.


```js
service.on('message', (message) => {
  console.log(message);
});

/*
 Example message payload:

 {"type": "utf8", "utf8Data": '{"type":"final","id":"0","recognition":"Hello world","translation":"Hello world"}'}

*/

```

### service.on('close', callback)

+ `callback` _Function_

Event listener for Speech API websocket connection closures.


```js
service.on('close', () => {
  console.log('Speech API connection closed');
});


```

### service.on('error', callback)

+ `callback` _Function_

Event listener for incoming Speech API websocket connection errors. 


```js
service.on('error', (error) => {
  console.log(error);
});


```

