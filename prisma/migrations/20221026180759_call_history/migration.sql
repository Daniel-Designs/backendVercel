-- AlterTable
CREATE SEQUENCE "calls_idcall_seq";
ALTER TABLE "calls" ALTER COLUMN "idcall" SET DEFAULT nextval('calls_idcall_seq'),
ALTER COLUMN "timestmp" SET DEFAULT CURRENT_TIMESTAMP;
ALTER SEQUENCE "calls_idcall_seq" OWNED BY "calls"."idcall";
