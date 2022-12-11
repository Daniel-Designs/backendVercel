const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const uploadTranscript = async (transcript, callID, userID) => {
  const transcriptDB = await prisma.transcription.create({
    data: {
      idcall: callID,
      idauthor: userID,
      body: transcript,
    },
  });
  console.log(
    `Transcript ${transcriptDB.idtranscript} registered successfully`
  );
};

const uploadTranscriptSpeaking = async (transcript, exID, userID) => {
  const transcriptDB = await prisma.exercisetranscripts.upsert({
    where: {
      idexercise_iduser: { idexercise: exID, iduser: userID },
    },
    update: {
      transcript: transcript,
    },
    create: {
      idexercise: exID,
      iduser: userID,
      transcript: transcript,
    },
  });
  console.log(
    `Transcript for ${transcriptDB.idexercise} registered successfully`
  );
};

async function main() {
  function isNumeric(str) {
    if (typeof str != "string") return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }

  exports.startTranscript = async (req, res) => {
    const { containerName } = req.params;
    const { userID, callID } = req.body;

    if (!(userID && callID && containerName)) {
      return res.status(400).send("Missing user, call or container info");
    }

    const correctUserCall = await prisma.calls.findUnique({
      where: {
        idcall: Number(callID),
      },
      select: {
        chat: {
          select: {
            usero: true,
            usert: true,
          },
        },
      },
    });

    if (!correctUserCall) {
      return res.status(401).send("INVALID userID or callID");
    }

    if (
      !(
        correctUserCall.chat.usero === Number(userID) ||
        correctUserCall.chat.usert === Number(userID)
      )
    ) {
      return res.status(401).send("INVALID userID or callID");
    }
    let transcriptionID = "";
    let transcriptStatus = "";
    let transcribing = false;
    let interval = null;

    const subsKey = process.env.SPEECH_SUBSCRIPTIONKEY;

    const checkStatus = () => {
      transcribing = true;
      axios
        .get(`${transcriptionID}`, {
          headers: {
            "Ocp-Apim-Subscription-Key": subsKey,
          },
        })
        .then((res) => {
          console.log("CHECK STATUS", res.data.status);
          transcriptStatus = res.data.status;
          if (
            transcriptStatus === "Succeeded" ||
            transcriptStatus === "Failed"
          ) {
            clearInterval(interval);
            if (transcriptStatus === "Succeeded") getTranscript();
          }
        });
    };

    const parseTranscriptionPart = async (link) => {
      const text = await axios.get(link);
      console.log(text.data.combinedRecognizedPhrases[0].display);
      return text.data.combinedRecognizedPhrases[0].display;
    };

    const getTranscript = () => {
      transcribing = false;
      axios
        .get(`${transcriptionID}/files`, {
          headers: {
            "Ocp-Apim-Subscription-Key": subsKey,
          },
        })
        .then(async (res) => {
          let transcriptParts;
          //console.log("GET TRANSCRIPT: ", res.data);
          transcriptParts = res.data.values;
          let str = "";
          console.log("GET TRANSCRIPT:");
          await Promise.all(
            transcriptParts.map(async (part) => {
              if (part.kind === "Transcription") {
                str +=
                  (await parseTranscriptionPart(part.links.contentUrl)) + "\n";
              }
              return str;
            })
          ).then((res) => {
            uploadTranscript(res.join(""), callID, userID);
          });
          // console.log(res.data.combinedRecognizedPhrases[0].display);
        })
        .catch((e) => {
          console.error(e);
        });
    };

    axios
      .post(
        `https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions`,
        {
          contentContainerUrl: `https://storageptdos.blob.core.windows.net/${containerName}`,
          properties: {
            diarizationEnabled: false,
            wordLevelTimestampsEnabled: false,
            punctuationMode: "DictatedAndAutomatic",
          },
          locale: "en-US",
          displayName: `English transcription for container ${containerName}`,
        },
        {
          headers: {
            "Ocp-Apim-Subscription-Key": subsKey,
          },
        }
      )
      .then((response) => {
        console.log(response.data.self, response.data.status);
        transcriptionID = response.data.self;
        transcriptStatus = response.data.status;
      })
      .then(() => {
        interval = setInterval(checkStatus, 2500);
      })
      .catch((error) => {
        console.log(error);
      });

    res.status(200).send("FINAL");
  };

  exports.getTranscriptByCall = async (req, res) => {
    const { userID, callID } = req.params;

    if (!(userID && callID)) {
      res.status(400).send("User or call IDs missing");
    }

    if (!isNumeric(userID) || !isNumeric(callID)) {
      res.status(400).send("Wrong User or call IDs");
    }

    const transcript = await prisma.transcription.findMany({
      where: {
        idcall: Number(callID),
        idauthor: Number(userID),
      },
    });

    res.status(200).send(transcript);
  };

  exports.startTranscriptSpeaking = async (req, res) => {
    const { containerName } = req.params;
    const { userID, exID } = req.body;

    if (!(userID && exID && containerName)) {
      return res.status(400).send("Missing user, exercise or container info");
    }

    const correctUser = await prisma.user.findUnique({
      where: {
        iduser: Number(userID),
      },
    });

    const correctExercise = await prisma.exercise.findUnique({
      where: {
        idexercise: Number(exID),
      },
    });

    if (!correctUser || correctExercise.typeID !== "S") {
      return res.status(401).send("INVALID userID or exerciseID");
    }

    let transcriptionID = "";
    let transcriptStatus = "";
    let transcribing = false;
    let interval = null;

    const subsKey = process.env.SPEECH_SUBSCRIPTIONKEY;

    const checkStatus = () => {
      transcribing = true;
      axios
        .get(`${transcriptionID}`, {
          headers: {
            "Ocp-Apim-Subscription-Key": subsKey,
          },
        })
        .then((res) => {
          console.log("CHECK STATUS", res.data.status);
          transcriptStatus = res.data.status;
          if (
            transcriptStatus === "Succeeded" ||
            transcriptStatus === "Failed"
          ) {
            clearInterval(interval);
            if (transcriptStatus === "Succeeded") getTranscript();
          }
        });
    };

    const parseTranscriptionPart = async (link) => {
      const text = await axios.get(link);
      console.log(text.data.combinedRecognizedPhrases[0].display);
      return text.data.combinedRecognizedPhrases[0].display;
    };

    const getTranscript = () => {
      transcribing = false;
      axios
        .get(`${transcriptionID}/files`, {
          headers: {
            "Ocp-Apim-Subscription-Key": subsKey,
          },
        })
        .then(async (res) => {
          let transcriptParts;
          //console.log("GET TRANSCRIPT: ", res.data);
          transcriptParts = res.data.values;
          let str = "";
          console.log("GET TRANSCRIPT:");
          await Promise.all(
            transcriptParts.map(async (part) => {
              if (part.kind === "Transcription") {
                str +=
                  (await parseTranscriptionPart(part.links.contentUrl)) + "\n";
              }
              return str;
            })
          ).then((res) => {
            uploadTranscriptSpeaking(res.join(""), exID, userID);
          });
          // console.log(res.data.combinedRecognizedPhrases[0].display);
        })
        .catch((e) => {
          console.error(e);
        });
    };

    axios
      .post(
        `https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions`,
        {
          contentContainerUrl: `https://storageptdos.blob.core.windows.net/${containerName}`,
          properties: {
            diarizationEnabled: false,
            wordLevelTimestampsEnabled: false,
            punctuationMode: "DictatedAndAutomatic",
          },
          locale: "en-US",
          displayName: `English transcription for container ${containerName}`,
        },
        {
          headers: {
            "Ocp-Apim-Subscription-Key": subsKey,
          },
        }
      )
      .then((response) => {
        console.log(response.data.self, response.data.status);
        transcriptionID = response.data.self;
        transcriptStatus = response.data.status;
      })
      .then(() => {
        interval = setInterval(checkStatus, 2500);
      })
      .catch((error) => {
        console.log(error);
      });

    res.status(200).send("FINAL");
  };

  exports.getTranscriptByExercise = async (req, res) => {
    const { userID, exID } = req.params;

    if (!(userID && exID)) {
      res.status(400).send("User or exercise IDs missing");
    }

    if (!isNumeric(userID) || !isNumeric(exID)) {
      res.status(400).send("Wrong User or exercise IDs");
    }

    const transcript = await prisma.exercisetranscripts.findMany({
      where: {
        idexercise: Number(exID),
        iduser: Number(userID),
      },
    });

    res.status(200).send(transcript);
  };
}

main()
  .then(() => console.log("Done"))
  .catch((ex) => console.log(ex.message));
