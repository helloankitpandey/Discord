-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'IDLE', 'DO_NOT_DISTRUB', 'INVISIBLE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNo" VARCHAR(10) NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNo_key" ON "User"("phoneNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
