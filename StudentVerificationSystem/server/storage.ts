import mongoose from 'mongoose';
import { type StudentVerification, type InsertStudentVerification } from "@shared/schema";

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://bastoffcial:aI4fEcricKXwBZ4f@speedo.swuhr8z.mongodb.net/Book-Out';

// Mongoose schema
const studentVerificationSchema = new mongoose.Schema({
  certificateNumber: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  college: { type: String, required: true },
  dateOfJoining: { type: String, required: true },
  dateOfIssue: { type: String, required: true },
  domain: { type: String, required: true },
  status: { type: String, required: true },
  grade: { type: String, required: true }
}, { collection: 'Student_Verification' });

const StudentVerificationModel = mongoose.model('StudentVerification', studentVerificationSchema);

export interface IStorage {
  getStudentVerificationByCertificateNumber(certificateNumber: string): Promise<StudentVerification | undefined>;
  createStudentVerification(verification: InsertStudentVerification): Promise<StudentVerification>;
  getAllStudentVerifications(): Promise<StudentVerification[]>;
}

export class MongoStorage implements IStorage {
  private isConnected = false;

  constructor() {
    this.connect();
  }

  private async connect() {
    if (this.isConnected) return;
    
    try {
      await mongoose.connect(MONGODB_URI);
      this.isConnected = true;
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async getStudentVerificationByCertificateNumber(certificateNumber: string): Promise<StudentVerification | undefined> {
    await this.connect();
    try {
      const result = await StudentVerificationModel.findOne({ 
        certificateNumber: { $regex: new RegExp(`^${certificateNumber}$`, 'i') }
      }).lean();
      
      if (!result) return undefined;
      
      return {
        _id: result._id?.toString(),
        certificateNumber: result.certificateNumber,
        studentName: result.studentName,
        registrationNumber: result.registrationNumber,
        college: result.college,
        dateOfJoining: result.dateOfJoining,
        dateOfIssue: result.dateOfIssue,
        domain: result.domain,
        status: result.status,
        grade: result.grade
      };
    } catch (error) {
      console.error('Error fetching student verification:', error);
      return undefined;
    }
  }

  async createStudentVerification(insertVerification: InsertStudentVerification): Promise<StudentVerification> {
    await this.connect();
    const verification = new StudentVerificationModel(insertVerification);
    const saved = await verification.save();
    
    return {
      _id: saved._id?.toString(),
      certificateNumber: saved.certificateNumber,
      studentName: saved.studentName,
      registrationNumber: saved.registrationNumber,
      college: saved.college,
      dateOfJoining: saved.dateOfJoining,
      dateOfIssue: saved.dateOfIssue,
      domain: saved.domain,
      status: saved.status,
      grade: saved.grade
    };
  }

  async getAllStudentVerifications(): Promise<StudentVerification[]> {
    await this.connect();
    const results = await StudentVerificationModel.find({}).lean();
    
    return results.map(result => ({
      _id: result._id?.toString(),
      certificateNumber: result.certificateNumber,
      studentName: result.studentName,
      registrationNumber: result.registrationNumber,
      college: result.college,
      dateOfJoining: result.dateOfJoining,
      dateOfIssue: result.dateOfIssue,
      domain: result.domain,
      status: result.status,
      grade: result.grade
    }));
  }
}

export const storage = new MongoStorage();
