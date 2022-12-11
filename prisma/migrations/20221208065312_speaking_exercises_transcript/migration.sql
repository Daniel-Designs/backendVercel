-- CreateTable
CREATE TABLE "exercisetranscripts" (
    "idexercise" INTEGER NOT NULL,
    "iduser" INTEGER NOT NULL,
    "transcript" TEXT NOT NULL,

    CONSTRAINT "pk_exercisetranscripts" PRIMARY KEY ("idexercise","iduser")
);

-- AddForeignKey
ALTER TABLE "exercisetranscripts" ADD CONSTRAINT "fk_userexercises_exercise" FOREIGN KEY ("idexercise") REFERENCES "exercise"("idexercise") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercisetranscripts" ADD CONSTRAINT "fk_userexercises_user" FOREIGN KEY ("iduser") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;
