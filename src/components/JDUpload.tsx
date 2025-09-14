import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, X, Eye, CheckCircle, AlertCircle, Search, Filter, Plus } from 'lucide-react';
import mammoth from 'mammoth';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { createClient } from '@supabase/supabase-js';

GlobalWorkerOptions.workerSrc = pdfWorker;

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  file: File;
}

interface ExtractedInfo {
  name: string;
  skills: string[];
  education: string[];
  projects: string[];
  experience: string[];
  contact: {
    email: string;
    phone: string;
  };
}

const fileCategories = [
  { name: "All Files", count: 0 },
  { name: "PDF", count: 0 },
  { name: "DOCX", count: 0 },
  { name: "TXT", count: 0 }
];

const JDUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All Files");
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo[]>([]);
  const [extracting, setExtracting] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, DOCX, or TXT files only.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFiles = useCallback(async (fileList: FileList) => {
    const validFiles: File[] = [];
    
    Array.from(fileList).forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    // Simulate upload process
    for (const file of validFiles) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        file: file
      };

      setFiles(prev => [...prev, uploadedFile]);
      
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully.`,
      });
    }

    setUploading(false);
  }, [toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    if (previewFile?.id === id) {
      setPreviewFile(null);
      setPreviewContent(null);
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
        setPreviewBlobUrl(null);
      }
    }
  };

  const handlePreviewFile = async (file: UploadedFile) => {
    setPreviewFile(file);
    setPreviewContent(null);
    
    // Clean up previous blob URL
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }

    // Read file content for preview
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewContent(e.target?.result as string);
      };
      reader.readAsText(file.file);
    } else if (file.type === 'application/pdf') {
      // Create blob URL for PDF
      const blobUrl = URL.createObjectURL(file.file);
      setPreviewBlobUrl(blobUrl);
      setPreviewContent('pdf-ready');
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const arrayBuffer = await file.file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setPreviewContent(result.value);
      } catch (error) {
        console.error('Error reading Word document:', error);
        setPreviewContent('Error: Could not read Word document content.');
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeColor = (type: string): string => {
    switch (type) {
      case 'application/pdf':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'text/plain':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getFileTypeLabel = (type: string): string => {
    switch (type) {
      case 'application/pdf':
        return 'PDF';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'DOCX';
      case 'text/plain':
        return 'TXT';
      default:
        return 'FILE';
    }
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const strings = (content.items as any[]).map((item: any) => item.str);
        fullText += strings.join(' ') + '\n';
      }
      return fullText;
    } catch (e) {
      console.error('PDF extraction failed', e);
      return '';
    }
  };

  const extractInfoFromText = (text: string): ExtractedInfo => {
    const lines = text.toLowerCase().split('\n').map(line => line.trim());
    const originalLines = text.split('\n').map(line => line.trim());
    
    // Extract name (usually in first few lines or after "name:" pattern)
    let name = '';
    for (let i = 0; i < Math.min(5, originalLines.length); i++) {
      const line = originalLines[i];
      if (line && !line.includes('@') && !line.includes('phone') && 
          !line.includes('email') && line.length > 2 && line.length < 50) {
        name = line;
        break;
      }
    }
    
    // Extract email
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emailMatch = text.match(emailRegex);
    const email = emailMatch ? emailMatch[0] : '';
    
    // Extract phone
    const phoneRegex = /[\+]?[1-9]?[\d\s\-\(\)]{8,15}/g;
    const phoneMatch = text.match(phoneRegex);
    const phone = phoneMatch ? phoneMatch[0] : '';
    
    // Extract skills
    const skillKeywords = ['skills', 'technical skills', 'technologies', 'programming languages'];
    const skills: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (skillKeywords.some(keyword => lines[i].includes(keyword))) {
        // Look for skills in next few lines
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const line = originalLines[j];
          if (line && !lines[j].includes('experience') && !lines[j].includes('education')) {
            // Split by common delimiters
            const lineSkills = line.split(/[,;•·\-\|]/).map(s => s.trim()).filter(s => s.length > 1);
            skills.push(...lineSkills);
          }
        }
        break;
      }
    }
    
    // Extract education
    const educationKeywords = ['education', 'academic', 'degree', 'university', 'college'];
    const education: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (educationKeywords.some(keyword => lines[i].includes(keyword))) {
        for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
          const line = originalLines[j];
          if (line && line.length > 10) {
            education.push(line);
          }
        }
        break;
      }
    }
    
    // Extract projects
    const projectKeywords = ['projects', 'project experience', 'key projects'];
    const projects: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (projectKeywords.some(keyword => lines[i].includes(keyword))) {
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const line = originalLines[j];
          if (line && line.length > 15) {
            projects.push(line);
          }
        }
        break;
      }
    }
    
    // Extract experience
    const experienceKeywords = ['experience', 'work experience', 'employment', 'career'];
    const experience: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (experienceKeywords.some(keyword => lines[i].includes(keyword))) {
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const line = originalLines[j];
          if (line && line.length > 15) {
            experience.push(line);
          }
        }
        break;
      }
    }
    
    return {
      name: name || 'Not found',
      skills: skills.slice(0, 10), // Limit to first 10 skills
      education: education.slice(0, 3),
      projects: projects.slice(0, 5),
      experience: experience.slice(0, 5),
      contact: { email, phone }
    };
  };

  const handleSubmitCV = async () => {
    if (files.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload CV files before submitting.",
        variant: "destructive",
      });
      return;
    }

    setExtracting(true);
    const newExtractedInfo: ExtractedInfo[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('cv_file', file.file);

        const { data, error } = await supabase.functions.invoke('extract-cv', {
          body: formData,
        });

        if (error) {
          throw new Error(error.message || 'Failed to extract CV information');
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        newExtractedInfo.push(data);
      }

      setExtractedInfo(newExtractedInfo);
      
      toast({
        title: "CV Information Extracted!",
        description: `Successfully extracted information from ${files.length} CV file(s) using AI.`,
      });
    } catch (error) {
      console.error('Error extracting CV information:', error);
      toast({
        title: "Extraction Error",
        description: error instanceof Error ? error.message : "Failed to extract information from one or more files.",
        variant: "destructive",
      });
    } finally {
      setExtracting(false);
    }
  };

  // Update category counts
  const updatedCategories = fileCategories.map(cat => ({
    ...cat,
    count: cat.name === "All Files" ? files.length :
           cat.name === "PDF" ? files.filter(f => f.type === 'application/pdf').length :
           cat.name === "DOCX" ? files.filter(f => f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document').length :
           cat.name === "TXT" ? files.filter(f => f.type === 'text/plain').length : 0
  }));

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16">
          <div className="lg:w-2/3 mb-8 lg:mb-0">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Professional Job Description
              <br />
              <span className="text-primary">Upload System</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Upload, manage, and preview your job descriptions efficiently. 
              Supports{" "}
              <span className="text-primary font-medium">PDF</span>,{" "}
              <span className="text-primary font-medium">DOCX</span>, and{" "}
              <span className="text-primary font-medium">TXT</span> formats.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 lg:w-80 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Upload Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Files</span>
                <Badge variant="secondary">{files.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Size</span>
                <Badge variant="secondary">
                  {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={uploading ? "destructive" : "default"} className="bg-primary">
                  {uploading ? "Uploading..." : "Ready"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm mb-8 hover-scale">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Upload className="w-6 h-6 text-primary" />
              Upload Job Descriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">
                  Drop your files here or click to browse
                </h3>
                <p className="text-muted-foreground">
                  Supports PDF, DOCX, and TXT files up to 10MB each
                </p>
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button
                size="lg"
                className="mt-6 bg-primary hover:bg-primary/90"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? 'Processing...' : 'Choose Files'}
              </Button>
            </div>

            {uploading && (
              <div className="mt-6 flex items-center justify-center space-x-3 text-primary animate-fade-in">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span className="text-lg">Processing upload...</span>
              </div>
            )}
            <div className="mt-4 text-xs text-muted-foreground">
              Tip: For best results, upload a searchable PDF (not scanned) or a DOCX file.
            </div>
          </CardContent>
        </Card>

        {/* File Categories */}
        {files.length > 0 && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-muted-foreground font-mono text-sm">// File Types</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {updatedCategories.map((category) => (
                  <Badge
                    key={category.name}
                    variant={selectedCategory === category.name ? "default" : "secondary"}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name}
                    <span className="ml-2 text-xs opacity-70">{category.count}</span>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                  <Plus className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm">
                  Sort by Date
                </Button>
                <Button variant="outline" size="sm">
                  Sort by Size
                </Button>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="w-4 h-4" />
                Search Files
              </Button>
            </div>

            {/* Submit Button */}
            <div className="mb-8 flex justify-center">
              <Button
                onClick={handleSubmitCV}
                disabled={extracting || files.length === 0}
                size="lg"
                className="bg-primary hover:bg-primary/90 px-8 py-3"
              >
                {extracting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Extracting Information...
                  </>
                ) : (
                  'Extract CV Information'
                )}
              </Button>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <Card key={file.id} className="group bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 cursor-pointer overflow-hidden hover-scale">
                  <CardContent className="p-0">
                    {/* File Preview Area */}
                    <div className="aspect-[4/3] bg-muted/20 border-b border-border/50 relative overflow-hidden">
                      <div className="absolute inset-4 bg-background/10 rounded-lg border border-border/30 flex items-center justify-center">
                        <File className="w-16 h-16 text-primary/60" />
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className={getFileTypeColor(file.type)}>
                          {getFileTypeLabel(file.type)}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* File Info */}
                    <div className="p-6">
                      <div className="text-xs text-muted-foreground mb-2 font-mono">
                        {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-primary transition-colors truncate">
                        {file.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreviewFile(file)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Extracted Information Display */}
            {extractedInfo.length > 0 && (
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-foreground mb-8">Extracted CV Information</h2>
                <div className="space-y-8">
                  {extractedInfo.map((info, index) => (
                    <Card key={index} className="bg-gradient-card border-border/50 shadow-glow">
                      <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                          <CheckCircle className="w-6 h-6 text-primary" />
                          CV #{index + 1} - {info.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Personal Information */}
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                            <div className="space-y-2 text-sm">
                              <div><strong>Name:</strong> {info.name}</div>
                              <div><strong>Email:</strong> {info.contact.email || 'Not found'}</div>
                              <div><strong>Phone:</strong> {info.contact.phone || 'Not found'}</div>
                            </div>
                          </div>

                          {/* Skills */}
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                              {info.skills.length > 0 ? (
                                info.skills.map((skill, skillIndex) => (
                                  <Badge key={skillIndex} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">No skills found</span>
                              )}
                            </div>
                          </div>

                          {/* Education */}
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Education</h3>
                            <div className="space-y-2">
                              {info.education.length > 0 ? (
                                info.education.map((edu, eduIndex) => (
                                  <div key={eduIndex} className="text-sm text-muted-foreground">
                                    • {edu}
                                  </div>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">No education found</span>
                              )}
                            </div>
                          </div>

                          {/* Projects */}
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Projects</h3>
                            <div className="space-y-2">
                              {info.projects.length > 0 ? (
                                info.projects.map((project, projectIndex) => (
                                  <div key={projectIndex} className="text-sm text-muted-foreground">
                                    • {project}
                                  </div>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">No projects found</span>
                              )}
                            </div>
                          </div>

                          {/* Experience */}
                          <div className="lg:col-span-2">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Experience</h3>
                            <div className="space-y-2">
                              {info.experience.length > 0 ? (
                                info.experience.map((exp, expIndex) => (
                                  <div key={expIndex} className="text-sm text-muted-foreground">
                                    • {exp}
                                  </div>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">No experience found</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* File Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>File Preview</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <File className="w-12 h-12 text-primary" />
                    <div>
                      <h3 className="text-lg font-medium text-foreground">{previewFile.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Badge variant="outline" className={getFileTypeColor(previewFile.type)}>
                          {getFileTypeLabel(previewFile.type)}
                        </Badge>
                        <span>{formatFileSize(previewFile.size)}</span>
                        <span>Uploaded: {previewFile.uploadDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/50 overflow-hidden h-[60vh]">
                    {previewContent ? (
                      <div className="overflow-auto h-full">
                        {previewFile.type === 'text/plain' && (
                          <pre className="p-4 text-sm font-mono whitespace-pre-wrap bg-muted/30 text-foreground h-full">
                            {previewContent}
                          </pre>
                        )}
                        {previewFile.type === 'application/pdf' && previewBlobUrl && (
                          <iframe
                            src={previewBlobUrl}
                            className="w-full h-full border-0"
                            title="PDF Preview"
                          />
                        )}
                        {previewFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
                          <pre className="p-4 text-sm whitespace-pre-wrap bg-muted/30 text-foreground h-full">
                            {previewContent}
                          </pre>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <span className="text-muted-foreground">Loading preview...</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default JDUpload;