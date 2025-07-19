import { z } from "zod";

// MongoDB schema interface
export interface StudentVerification {
  _id?: string;
  certificateNumber: string;
  studentName: string;
  registrationNumber: string;
  college: string;
  dateOfJoining: string;
  dateOfIssue: string;
  domain: string;
  status: string;
  grade: string;
}

export const insertStudentVerificationSchema = z.object({
  certificateNumber: z.string().min(1),
  studentName: z.string().min(1),
  registrationNumber: z.string().min(1),
  college: z.string().min(1),
  dateOfJoining: z.string().min(1),
  dateOfIssue: z.string().min(1),
  domain: z.string().min(1),
  status: z.string().min(1),
  grade: z.string().min(1),
});

export type InsertStudentVerification = z.infer<typeof insertStudentVerificationSchema>;
