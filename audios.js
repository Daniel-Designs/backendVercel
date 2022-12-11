// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

(function () {
  // <code>
  "use strict";

  // pull in the required packages.
  var sdk = require("microsoft-cognitiveservices-speech-sdk");
  var fs = require("fs");

  // replace with your own subscription key,
  // service region (e.g., "westus"), and
  // the name of the file you want to run
  // through the speech recognizer.
  var subscriptionKey = "fd4beb334d5545e2aea5b378e5f762f8";
  var serviceRegion = "eastus"; // e.g., "westus"
  var filename = "./media/examAudios/4-16.wav"; // 16000 Hz, Mono

  // create the push stream we need for the speech sdk.
  var pushStream = sdk.AudioInputStream.createPushStream();

  // open the file and push it to the push stream.
  fs.createReadStream(filename)
    .on("data", function (arrayBuffer) {
      pushStream.write(arrayBuffer.slice());
    })
    .on("end", function () {
      pushStream.close();
    });

  // we are done with the setup
  console.log("Now recognizing from: " + filename);

  // now create the audio-config pointing to our stream and
  // the speech config specifying the language.
  var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  var speechConfig = sdk.SpeechConfig.fromSubscription(
    subscriptionKey,
    serviceRegion
  );

  // setting the recognition language to English.
  speechConfig.speechRecognitionLanguage = "en-US";
  speechConfig.setProperty("DifferentiateGuestSpeakers", "true");

  // create the speech recognizer.
  var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  // start the recognizer and wait for a result.
  recognizer.recognizing = (s, e) => {
    // console.log(`RECOGNIZING: Text=${e.result.text}`);
  };

  recognizer.recognized = (s, e) => {
    if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
      console.log(`RECOGNIZED: Text=${e.result.text}`);
    } else if (e.result.reason == sdk.ResultReason.NoMatch) {
      console.log("NOMATCH: Speech could not be recognized.");
    }
  };

  recognizer.canceled = (s, e) => {
    console.log(`CANCELED: Reason=${e.reason}`);

    if (e.reason == sdk.CancellationReason.Error) {
      console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
      console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
      console.log(
        "CANCELED: Did you set the speech resource key and region values?"
      );
    }

    recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.sessionStopped = (s, e) => {
    console.log("\n    Session stopped event.");
    recognizer.stopContinuousRecognitionAsync();
  };
  // </code>
  recognizer.startContinuousRecognitionAsync();
})();
