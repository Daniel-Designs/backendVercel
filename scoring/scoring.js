const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { puntuacion } = require("./FIS.json");

const average = (array) => array.reduce((a, b) => a + b, 0) / array.length;

const getScoresByLevel = (exercisesResults) =>
  exercisesResults.map((res) => {
    const score = res.results;
    let level = 1;
    if (res.exercise.levelID == "A") level = 3;
    if (res.exercise.levelID == "I") level = 2;
    return score * (level / 3);
  });

const productiveSkillScore = (exercisesResults) => {
  const scoresByLevel = getScoresByLevel(exercisesResults);
  return Math.round(average(scoresByLevel));
  // return average(scoresByLevel)*0.8 + chatsFeedback*0.2;
};

const grammarScore = (exercisesResults) => {
  const scoresByLevel = getScoresByLevel(exercisesResults);
  return Math.round(average(scoresByLevel));
};

const updateScore = async (skillID, user) => {
  const skills =
    skillID !== "S" && skillID !== "W" ? ["G", "L", "R", "V"] : [skillID];

  const allExercisesResuls = await prisma.userexercises.findMany({
    select: {
      results: true,
      exercise: {
        select: {
          levelID: true,
        },
      },
    },
    where: {
      exercise: {
        skillID: { in: skills },
      },
    },
  });

  const skillScore =
    skillID === "S" || skillID === "W"
      ? productiveSkillScore(allExercisesResuls)
      : grammarScore(allExercisesResuls);

  let data = {};
  if (skillID === "S") {
    data = {
      speakinglevel: skillScore,
      level: puntuacion[user.grammarlevel][skillScore][user.writinglevel],
    };
  } else if (skillID === "W") {
    data = {
      writinglevel: skillScore,
      level: puntuacion[user.grammarlevel][user.speakinglevel][skillScore],
    };
  } else {
    const data = {
      grammarlevel: skillScore,
      level: puntuacion[skillScore][user.speakinglevel][user.writinglevel],
    };
  }

  const updatedUserScore = await prisma.user.update({
    where: { iduser: Number(user.iduser) },
    data: data,
    select: {
      level: true,
      speakinglevel: true,
      writinglevel: true,
      grammarlevel: true,
    },
  });

  console.log("Scores updated: ");
  console.log(updatedUserScore);
};

module.exports = {
  updateScores: updateScore,
};
