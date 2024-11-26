-- CreateTable
CREATE TABLE "AdminTransaction" (
    "id" TEXT NOT NULL,
    "tansactionId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminTransaction_id_key" ON "AdminTransaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AdminTransaction_tansactionId_key" ON "AdminTransaction"("tansactionId");

-- AddForeignKey
ALTER TABLE "AdminTransaction" ADD CONSTRAINT "AdminTransaction_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
