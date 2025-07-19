import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, Download, AlertCircle } from "lucide-react";
import Footer from "@/components/ui/footer";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";
import type { StudentVerification } from "@shared/schema";

// Import GSAP and jsPDF from CDN
declare global {
  interface Window {
    gsap: any;
    jspdf: any;
  }
}

export default function Home() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const resultCardRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const {
    data: studentData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/verify", searchQuery],
    enabled: !!searchQuery,
  });

  // Load GSAP and jsPDF from CDN
  useEffect(() => {
    const loadScripts = async () => {
      // Load GSAP
      if (!window.gsap) {
        const gsapScript = document.createElement("script");
        gsapScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
        document.head.appendChild(gsapScript);
      }

      // Load jsPDF
      if (!window.jspdf) {
        const jspdfScript = document.createElement("script");
        jspdfScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        document.head.appendChild(jspdfScript);
      }
    };

    loadScripts();
  }, []);

  // Animate results when data loads
  useEffect(() => {
    if (studentData && resultCardRef.current && window.gsap) {
      window.gsap.fromTo(
        resultCardRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
      );
    }
  }, [studentData]);

  // Animate error messages
  useEffect(() => {
    if (error && errorRef.current && window.gsap) {
      window.gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3 },
      );
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a certificate number",
        variant: "destructive",
      });
      return;
    }
    setSearchQuery(certificateNumber.trim().toUpperCase());
  };

  const downloadPDF = () => {
    if (!window.jspdf || !studentData) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set page background color (light yellow)
    doc.setFillColor(248, 246, 124, 0.1);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

    // Add header background
    doc.setFillColor(248, 246, 124);
    doc.rect(0, 0, doc.internal.pageSize.width, 50, 'F');

    // Add border
    doc.setDrawColor(255, 193, 7);
    doc.setLineWidth(2);
    doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20);

    // Header Section
    doc.setTextColor(133, 77, 14); // Dark yellow/brown
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text('VLGE INSTITUTE PVT.LTD.', doc.internal.pageSize.width / 2, 25, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text('An ISO Certified Institution, DPIIT Recognised Startup(Govt of India)', doc.internal.pageSize.width / 2, 35, { align: 'center' });
    doc.text('Registered Under MSME & Registered By Govt of India(MCA)', doc.internal.pageSize.width / 2, 42, { align: 'center' });

    // Verification Title
    doc.setFillColor(16, 185, 129);
    doc.rect(15, 60, doc.internal.pageSize.width - 30, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text('CERTIFICATE VERIFICATION REPORT', doc.internal.pageSize.width / 2, 73, { align: 'center' });

    // Status Badge
    doc.setFillColor(34, 197, 94);
    doc.rect(15, 90, 60, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('✓ VERIFIED', 45, 98, { align: 'center' });

    // Student Details Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('Student Information:', 20, 120);

    // Create styled boxes for information
    const infoStartY = 135;
    const boxHeight = 15;
    const leftColumnX = 20;
    const rightColumnX = 110;
    const boxWidth = 80;

    const studentInfo = [
      { label: 'Certificate Number', value: studentData.certificateNumber, x: leftColumnX, y: infoStartY },
      { label: 'Student Name', value: studentData.studentName, x: rightColumnX, y: infoStartY },
      { label: 'Registration Number', value: studentData.registrationNumber, x: leftColumnX, y: infoStartY + 25 },
      { label: 'College', value: studentData.college, x: rightColumnX, y: infoStartY + 25 },
      { label: 'Date of Joining', value: studentData.dateOfJoining, x: leftColumnX, y: infoStartY + 50 },
      { label: 'Date of Issue', value: studentData.dateOfIssue, x: rightColumnX, y: infoStartY + 50 },
      { label: 'Domain', value: studentData.domain, x: leftColumnX, y: infoStartY + 75 },
      { label: 'Grade', value: studentData.grade, x: rightColumnX, y: infoStartY + 75 }
    ];

    studentInfo.forEach((info) => {
      // Light yellow background for each field
      doc.setFillColor(254, 252, 191);
      doc.rect(info.x, info.y - 5, boxWidth, boxHeight, 'F');
      
      // Border for each field
      doc.setDrawColor(248, 246, 124);
      doc.setLineWidth(1);
      doc.rect(info.x, info.y - 5, boxWidth, boxHeight);
      
      // Label
      doc.setTextColor(133, 77, 14);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(info.label.toUpperCase(), info.x + 2, info.y);
      
      // Value
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(info.value, info.x + 2, info.y + 7);
    });

    // Status section
    doc.setFillColor(220, 252, 231);
    doc.rect(20, infoStartY + 105, boxWidth, boxHeight, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.rect(20, infoStartY + 105, boxWidth, boxHeight);
    
    doc.setTextColor(133, 77, 14);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text('STATUS', 22, infoStartY + 110);
    
    doc.setTextColor(21, 128, 61);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(studentData.status, 22, infoStartY + 117);

    // Footer section
    doc.setFillColor(248, 246, 124);
    doc.rect(0, doc.internal.pageSize.height - 40, doc.internal.pageSize.width, 40, 'F');
    
    doc.setTextColor(133, 77, 14);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('VLGE INSTITUTE PVT.LTD.', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 30, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text('#104, K K NAGAR, TIRUTTANI, TIRUVALLUR(DIST), TN-631209', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 22, { align: 'center' });
    doc.text('Ph: +917708115754 | Email: info@valuelearn.in | Web: www.valuelearn.in', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 15, { align: 'center' });
    
    // Generation timestamp
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 5, { align: 'center' });
    
    // Save with styled filename
    doc.save(`VLGE_${studentData.certificateNumber}_Verification_Report.pdf`);
    
    toast({
      title: "Success",
      description: "Styled PDF certificate downloaded successfully",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="vlge-header-bg shadow-lg border-b-2 border-yellow-400 neon-glow-yellow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Institute Name */}
            <div className="flex items-center space-x-4">
              <div className="floating-animation">
                <img
                  src="/attached_assets/VL.png"
                  alt="VLGE Institute Logo"
                  className="header-logo neon-glow-gold"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-700 drop-shadow-sm">
                  VLGE INSTITUTE PVT.LTD.
                </h1>
                <p className="text-sm md:text-base font-semibold text-yellow-600">
                  VLGE INSTITUTE
                </p>
                <p className="text-xs md:text-sm font-medium text-yellow-600">
                  PRIVATE LIMITED
                </p>
              </div>
            </div>

            {/* Institute Details */}
            <div className="hidden lg:block text-right">
              <div className="text-xs text-yellow-700 space-y-1">
                <p className="font-bold text-green-700">
                  An ISO Certified Institution, DPIIT Recognised Startup(Govt of
                  India),
                </p>
                <p className="font-semibold">
                  Registered Under MSME(Govt of India)& Registered By Govt of
                  India(MCA)
                </p>
                <p className="font-medium text-yellow-800">
                  #104, K K NAGAR, TIRUTTANI, TIRUVALLUR(DIST),TN-631209
                </p>
                <div className="flex items-center justify-end space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-green-600">📞</span>
                    <span className="font-medium text-green-700">
                      +917708115754
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-600">✉️</span>
                    <span className="font-medium text-blue-700">
                      info@valuelearn.in
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-purple-600">🌐</span>
                    <span className="font-medium text-purple-700">
                      www.valuelearn.in
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Contact Info */}
            <div className="lg:hidden text-right">
              <div className="text-xs text-yellow-700 space-y-1">
                <p className="font-bold">ISO Certified Institution</p>
                <p className="font-medium">+917708115754</p>
                <p className="font-medium">www.valuelearn.in</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Search Section */}
        <Card className="card-shadow-lg mb-8 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-yellow-700 mb-3 drop-shadow-sm">
                Student Certificate Verification
              </h2>
              <p className="text-yellow-600 text-lg font-medium">
                Enter the certificate number to verify student credentials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="relative">
                <Label
                  htmlFor="certificateNumber"
                  className="block text-sm font-bold text-yellow-700 mb-3"
                >
                  Certificate Number
                </Label>
                <div className="relative">
                  <Input
                    id="certificateNumber"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    placeholder="Enter certificate number"
                    className="text-lg h-12 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 border-2 border-yellow-300 bg-white neon-glow-yellow"
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-3">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 h-12 bg-[#f8f67c] hover:bg-yellow-300 text-yellow-800 font-bold neon-glow-yellow hover:neon-glow-yellow-lg transform hover:scale-105 transition-all duration-300 shadow-lg border-2 border-yellow-400"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Certificate"
                )}
              </Button>
            </form>

            {/* Error Message */}
            {error && (
              <div
                ref={errorRef}
                className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg"
              >
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">
                    Certificate not found. Please check the number and try
                    again.
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {studentData && (
          <Card
            ref={resultCardRef}
            className="card-shadow-lg border-2 border-yellow-400 overflow-hidden bg-gradient-to-br from-yellow-50 to-white"
          >
            {/* Certificate Header */}
            <div className="bg-gradient-to-r from-green-100 to-yellow-100 px-8 py-6 border-b-2 border-yellow-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center neon-glow-success floating-animation">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-700 drop-shadow-sm">
                      Certificate Verified ✓
                    </h3>
                    <p className="text-yellow-700 font-bold">
                      Valid VLGE Institute Certificate
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-yellow-600 font-bold">
                    Status
                  </div>
                  <Badge className="bg-green-200 text-green-800 hover:bg-green-300 border-2 border-green-400 font-bold px-3 py-1 neon-glow-success">
                    {studentData.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Student Details */}
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="border-b-2 border-yellow-200 pb-4">
                    <Label className="text-sm font-bold text-yellow-700 uppercase tracking-wide">
                      Certificate Number
                    </Label>
                    <p className="text-lg font-bold text-yellow-800 mt-1 drop-shadow-sm">
                      {studentData.certificateNumber}
                    </p>
                  </div>

                  <div className="border-b-2 border-yellow-200 pb-4">
                    <Label className="text-sm font-bold text-yellow-700 uppercase tracking-wide">
                      Student Name
                    </Label>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                      {studentData.studentName}
                    </p>
                  </div>

                  <div className="border-b-2 border-yellow-200 pb-4">
                    <Label className="text-sm font-bold text-yellow-700 uppercase tracking-wide">
                      Registration Number
                    </Label>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                      {studentData.registrationNumber}
                    </p>
                  </div>

                  <div className="border-b-2 border-yellow-200 pb-4">
                    <Label className="text-sm font-bold text-yellow-700 uppercase tracking-wide">
                      College
                    </Label>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                      {studentData.college}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="border-b-2 border-yellow-200 pb-4">
                    <Label className="text-sm font-bold text-yellow-700 uppercase tracking-wide">
                      Date of Joining
                    </Label>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                      {studentData.dateOfJoining}
                    </p>
                  </div>

                  <div className="border-b-2 border-yellow-200 pb-4">
                    <Label className="text-sm font-bold text-yellow-700 uppercase tracking-wide">
                      Date of Issue
                    </Label>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                      {studentData.dateOfIssue}
                    </p>
                  </div>

                  <div className="border-b-2 border-yellow-200 pb-4">
                    <Label className="text-sm font-bold text-yellow-700 uppercase tracking-wide">
                      Domain
                    </Label>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                      {studentData.domain}
                    </p>
                  </div>

                  <div className="border-b-2 border-yellow-200 pb-4">
                    <Label className="text-sm font-bold text-yellow-700 uppercase tracking-wide">
                      Grade
                    </Label>
                    <p className="text-lg font-bold text-green-700 mt-1 drop-shadow-sm">
                      {studentData.grade}
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={downloadPDF}
                  className="bg-[#f8f67c] hover:bg-yellow-300 text-yellow-800 font-bold px-8 py-3 neon-glow-yellow hover:neon-glow-yellow-lg transform hover:scale-105 transition-all duration-300 shadow-lg border-2 border-yellow-400"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
