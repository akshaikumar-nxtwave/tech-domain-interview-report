/*
  Warnings:

  - You are about to drop the column `final_feedback` on the `candidate_interviews` table. All the data in the column will be lost.
  - You are about to drop the column `final_non_tech` on the `candidate_interviews` table. All the data in the column will be lost.
  - You are about to drop the column `final_non_tech_score` on the `candidate_interviews` table. All the data in the column will be lost.
  - You are about to drop the column `meeting_recording` on the `candidate_interviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."candidate_interviews" DROP COLUMN "final_feedback",
DROP COLUMN "final_non_tech",
DROP COLUMN "final_non_tech_score",
DROP COLUMN "meeting_recording",
ADD COLUMN     "backend_feedback" TEXT,
ADD COLUMN     "be_communication" TEXT,
ADD COLUMN     "be_communication_rating" DECIMAL(3,1),
ADD COLUMN     "be_meeting_recording" TEXT,
ADD COLUMN     "be_project_explanation_rating" DECIMAL(3,1),
ADD COLUMN     "fr_communication" TEXT,
ADD COLUMN     "fr_communication_rating" DECIMAL(3,1),
ADD COLUMN     "fr_meeting_recording" TEXT,
ADD COLUMN     "fr_project_explanation_rating" DECIMAL(3,1);
