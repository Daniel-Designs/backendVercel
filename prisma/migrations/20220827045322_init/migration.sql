-- CreateTable
CREATE TABLE "admins" (
    "idadmin" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "passwrd" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,

    CONSTRAINT "pk_admins_idadmin" PRIMARY KEY ("idadmin")
);

-- CreateTable
CREATE TABLE "block" (
    "idblock" SERIAL NOT NULL,
    "blocker" INTEGER NOT NULL,
    "blockeduser" INTEGER NOT NULL,
    "datec" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "pk_favorites_idfavs_0" PRIMARY KEY ("idblock")
);

-- CreateTable
CREATE TABLE "calls" (
    "idcall" INTEGER NOT NULL,
    "idchat" INTEGER NOT NULL,
    "timestmp" TIMESTAMP(0) NOT NULL,
    "idcaller" INTEGER NOT NULL,
    "timeduration" INTEGER,

    CONSTRAINT "pk_calls" PRIMARY KEY ("idcall","idchat")
);

-- CreateTable
CREATE TABLE "chat" (
    "idchat" SERIAL NOT NULL,
    "usero" INTEGER NOT NULL,
    "usert" INTEGER NOT NULL,
    "datecreated" DATE NOT NULL DEFAULT CURRENT_DATE,
    "timelastmsg" DATE NOT NULL,

    CONSTRAINT "pk_chat_idchat" PRIMARY KEY ("idchat")
);

-- CreateTable
CREATE TABLE "exercise" (
    "idexercise" SERIAL NOT NULL,
    "createdby" INTEGER NOT NULL,
    "exercisetype" SMALLINT NOT NULL,
    "topic" INTEGER NOT NULL,
    "exlevel" SMALLINT NOT NULL DEFAULT 1,
    "exbody" VARCHAR(150) NOT NULL,
    "exstate" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "pk_exercise_idexercise" PRIMARY KEY ("idexercise")
);

-- CreateTable
CREATE TABLE "exercisetopic" (
    "idtopic" SERIAL NOT NULL,
    "desctopic" VARCHAR(100) NOT NULL,

    CONSTRAINT "pk_exercisetopic_idtopic" PRIMARY KEY ("idtopic")
);

-- CreateTable
CREATE TABLE "exercisetype" (
    "idtypeex" SMALLSERIAL NOT NULL,
    "typedesc" VARCHAR(50) NOT NULL,

    CONSTRAINT "pk_exercisetype_idtypeex" PRIMARY KEY ("idtypeex")
);

-- CreateTable
CREATE TABLE "favorites" (
    "idfavs" SERIAL NOT NULL,
    "sourceuser" INTEGER NOT NULL,
    "favuser" INTEGER NOT NULL,
    "datec" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "pk_favorites_idfavs" PRIMARY KEY ("idfavs")
);

-- CreateTable
CREATE TABLE "interest" (
    "idinterest" SERIAL NOT NULL,
    "interstdesc" VARCHAR(50) NOT NULL,

    CONSTRAINT "pk_interest_idinterest" PRIMARY KEY ("idinterest")
);

-- CreateTable
CREATE TABLE "labelnote" (
    "idlabel" INTEGER NOT NULL,
    "labeldesc" VARCHAR(50) NOT NULL,

    CONSTRAINT "pk_labelnote_idlabel" PRIMARY KEY ("idlabel")
);

-- CreateTable
CREATE TABLE "message" (
    "idmsg" SERIAL NOT NULL,
    "idchat" INTEGER NOT NULL,
    "idauthor" INTEGER NOT NULL,
    "msgfather" INTEGER,
    "timestmp" TIMESTAMP(0) NOT NULL,
    "body" VARCHAR(150) NOT NULL,

    CONSTRAINT "pk_message" PRIMARY KEY ("idmsg","idchat")
);

-- CreateTable
CREATE TABLE "note" (
    "idnote" SERIAL NOT NULL,
    "author" INTEGER NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "body" VARCHAR(600) NOT NULL,
    "datecreated" DATE NOT NULL DEFAULT CURRENT_DATE,
    "datelastmod" DATE NOT NULL,
    "label" INTEGER,

    CONSTRAINT "pk_note_idnote" PRIMARY KEY ("idnote")
);

-- CreateTable
CREATE TABLE "reasonreport" (
    "idreason" INTEGER NOT NULL,
    "reasondesc" VARCHAR(150) NOT NULL,

    CONSTRAINT "pk_reasonreport_idreason" PRIMARY KEY ("idreason")
);

-- CreateTable
CREATE TABLE "reporttype" (
    "idtyper" SMALLINT NOT NULL,
    "typerdesc" VARCHAR(100) NOT NULL,

    CONSTRAINT "pk_reporttype_idtyper" PRIMARY KEY ("idtyper")
);

-- CreateTable
CREATE TABLE "sex" (
    "idsex" SMALLSERIAL NOT NULL,
    "sexdesc" VARCHAR(50) NOT NULL,

    CONSTRAINT "pk_sex_idsex" PRIMARY KEY ("idsex")
);

-- CreateTable
CREATE TABLE "state" (
    "idstate" SMALLINT NOT NULL,
    "statedesc" VARCHAR(50) NOT NULL,

    CONSTRAINT "pk_states_idstate" PRIMARY KEY ("idstate")
);

-- CreateTable
CREATE TABLE "systemreport" (
    "idsysreport" SERIAL NOT NULL,
    "generatedby" INTEGER NOT NULL,
    "typer" SMALLINT NOT NULL,
    "dateg" DATE NOT NULL DEFAULT CURRENT_DATE,
    "document" VARCHAR(150) NOT NULL,

    CONSTRAINT "pk_systemreport_idsysreport" PRIMARY KEY ("idsysreport")
);

-- CreateTable
CREATE TABLE "transcription" (
    "idtranscript" SERIAL NOT NULL,
    "idcall" INTEGER NOT NULL,
    "content" VARCHAR(200) NOT NULL,

    CONSTRAINT "pk_transcription" PRIMARY KEY ("idtranscript","idcall")
);

-- CreateTable
CREATE TABLE "user" (
    "iduser" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "emailr" VARCHAR(100),
    "secfacode" VARCHAR(50),
    "age" SMALLINT NOT NULL,
    "level" SMALLINT NOT NULL DEFAULT 0,
    "sex" SMALLINT,
    "bio" VARCHAR(500),
    "pfp" VARCHAR(100),
    "hours" SMALLINT,
    "state" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "pk_tbl_iduser" PRIMARY KEY ("iduser")
);

-- CreateTable
CREATE TABLE "userexercises" (
    "idexercise" INTEGER NOT NULL,
    "iduser" INTEGER NOT NULL,
    "rdate" DATE NOT NULL DEFAULT CURRENT_DATE,
    "results" SMALLINT NOT NULL,

    CONSTRAINT "pk_userexercises" PRIMARY KEY ("idexercise","iduser")
);

-- CreateTable
CREATE TABLE "userinterest" (
    "iduser" INTEGER NOT NULL,
    "idinterest" INTEGER NOT NULL,

    CONSTRAINT "pk_userinterest" PRIMARY KEY ("iduser","idinterest")
);

-- CreateTable
CREATE TABLE "userreport" (
    "idreport" INTEGER NOT NULL,
    "reporter" INTEGER NOT NULL,
    "reporteduser" INTEGER NOT NULL,
    "reason" INTEGER NOT NULL,
    "datec" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "pk_userreport_idreport" PRIMARY KEY ("idreport")
);

-- CreateIndex
CREATE UNIQUE INDEX "unq_calls_idcall" ON "calls"("idcall");

-- CreateIndex
CREATE UNIQUE INDEX "unq_message_idmsg" ON "message"("idmsg");

-- AddForeignKey
ALTER TABLE "block" ADD CONSTRAINT "fk_block_user" FOREIGN KEY ("blocker") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "block" ADD CONSTRAINT "fk_block_userb" FOREIGN KEY ("blockeduser") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "fk_calls_chat" FOREIGN KEY ("idchat") REFERENCES "chat"("idchat") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "fk_calls_user" FOREIGN KEY ("idcaller") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "fk_chat_usero" FOREIGN KEY ("usero") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "fk_chat_usert" FOREIGN KEY ("usert") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "fk_exercise_admins" FOREIGN KEY ("createdby") REFERENCES "admins"("idadmin") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "fk_exercise_exercisetopic" FOREIGN KEY ("topic") REFERENCES "exercisetopic"("idtopic") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "fk_exercise_exercisetype" FOREIGN KEY ("exercisetype") REFERENCES "exercisetype"("idtypeex") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "fk_favorites_user" FOREIGN KEY ("sourceuser") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "fk_favorites_userf" FOREIGN KEY ("favuser") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "fk_message_chat" FOREIGN KEY ("idchat") REFERENCES "chat"("idchat") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "fk_message_message" FOREIGN KEY ("msgfather") REFERENCES "message"("idmsg") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "fk_message_user" FOREIGN KEY ("idauthor") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "fk_note_labelnote" FOREIGN KEY ("label") REFERENCES "labelnote"("idlabel") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "fk_note_user" FOREIGN KEY ("author") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "systemreport" ADD CONSTRAINT "fk_systemreport_admins" FOREIGN KEY ("generatedby") REFERENCES "admins"("idadmin") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "systemreport" ADD CONSTRAINT "fk_systemreport_reporttype" FOREIGN KEY ("typer") REFERENCES "reporttype"("idtyper") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transcription" ADD CONSTRAINT "fk_call" FOREIGN KEY ("idtranscript") REFERENCES "calls"("idcall") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "fk_user_sex" FOREIGN KEY ("sex") REFERENCES "sex"("idsex") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "fk_user_state" FOREIGN KEY ("state") REFERENCES "state"("idstate") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userexercises" ADD CONSTRAINT "fk_userexercises_exercise" FOREIGN KEY ("idexercise") REFERENCES "exercise"("idexercise") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userexercises" ADD CONSTRAINT "fk_userexercises_user" FOREIGN KEY ("iduser") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userinterest" ADD CONSTRAINT "fk_userinterest_interest" FOREIGN KEY ("idinterest") REFERENCES "interest"("idinterest") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userinterest" ADD CONSTRAINT "fk_userinterest_user" FOREIGN KEY ("iduser") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userreport" ADD CONSTRAINT "fk_userreport_reasonreport" FOREIGN KEY ("reason") REFERENCES "reasonreport"("idreason") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userreport" ADD CONSTRAINT "fk_userreport_user" FOREIGN KEY ("reporter") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userreport" ADD CONSTRAINT "fk_userreport_userr" FOREIGN KEY ("reporteduser") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;
