import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, X, Eye, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  file: File;
}

const JDUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
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
    }
  };

  const handlePreviewFile = async (file: UploadedFile) => {
    setPreviewFile(file);
    setPreviewContent(null);

    // Read file content for preview
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewContent(e.target?.result as string);
      };
      reader.readAsText(file.file);
    } else if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewContent(e.target?.result as string);
      };
      reader.readAsDataURL(file.file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewContent(e.target?.result as string);
      };
      reader.readAsDataURL(file.file);
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

  return (
    <div className="min-h-screen bg-gradient-primary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">JD Upload System</h1>
          <p className="text-lg opacity-90">Upload and manage your job descriptions efficiently</p>
        </div>

        {/* Upload Section */}
        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Upload Job Descriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  Drop your files here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOCX, and TXT files up to 10MB
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
                variant="secondary"
                className="mt-4"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Choose Files'}
              </Button>
            </div>

            {uploading && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-primary">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Processing upload...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Files List */}
        {files.length > 0 && (
          <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Uploaded Files ({files.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200 bg-card/50"
                  >
                    <div className="flex items-center space-x-3">
                      <File className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-medium text-foreground">{file.name}</h3>
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{file.uploadDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getFileTypeColor(file.type)}>
                        {getFileTypeLabel(file.type)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreviewFile(file)}
                      >
                        <Eye className="w-4 h-4" />
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
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Preview Modal */}
        {previewFile && (
          <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
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
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  {previewContent ? (
                    <div className="max-h-96 overflow-auto">
                      {previewFile.type === 'text/plain' && (
                        <pre className="p-4 text-sm font-mono whitespace-pre-wrap bg-muted/30 text-foreground">
                          {previewContent}
                        </pre>
                      )}
                      {previewFile.type === 'application/pdf' && (
                        <iframe
                          src={previewContent}
                          className="w-full h-96 border-0"
                          title="PDF Preview"
                        />
                      )}
                      {previewFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
                        <div className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-4">
                            <AlertCircle className="w-5 h-5" />
                            <span>Word documents require external viewer</span>
                          </div>
                          <a
                            href={previewContent}
                            download={previewFile.name}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                          >
                            <File className="w-4 h-4" />
                            <span>Download to view</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                      <span className="text-sm text-muted-foreground">Loading preview...</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JDUpload;