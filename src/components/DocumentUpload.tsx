import { useState, useRef } from "react";
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "success" | "error";
  progress: number;
}

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const maxFileSize = 10 * 1024 * 1024; // 10MB

const documentCategories = [
  { id: "passport", label: "Passport Copy", required: true },
  { id: "photo", label: "Passport Photo", required: true },
  { id: "employment", label: "Employment Letter", required: false },
  { id: "invitation", label: "Invitation Letter", required: false },
  { id: "financial", label: "Financial Documents", required: false },
  { id: "other", label: "Other Supporting Documents", required: false },
];

export function DocumentUpload() {
  const [applicationRef, setApplicationRef] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return "Invalid file type. Please upload PDF, JPG, PNG, or DOC files.";
    }
    if (file.size > maxFileSize) {
      return "File size exceeds 10MB limit.";
    }
    return null;
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev =>
          prev.map(f =>
            f.id === fileId ? { ...f, progress: 100, status: "success" } : f
          )
        );
      } else {
        setFiles(prev =>
          prev.map(f =>
            f.id === fileId ? { ...f, progress: Math.min(progress, 99) } : f
          )
        );
      }
    }, 200);
  };

  const handleFiles = (fileList: FileList) => {
    if (!applicationRef) {
      toast({
        title: "Application Reference Required",
        description: "Please enter your application reference number first.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Category Required",
        description: "Please select a document category.",
        variant: "destructive",
      });
      return;
    }

    Array.from(fileList).forEach(file => {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "Upload Error",
          description: error,
          variant: "destructive",
        });
        return;
      }

      const newFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
      };

      setFiles(prev => [...prev, newFile]);
      simulateUpload(newFile.id);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = () => {
    const successfulUploads = files.filter(f => f.status === "success");
    if (successfulUploads.length === 0) {
      toast({
        title: "No Files to Submit",
        description: "Please upload at least one document.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Documents Submitted Successfully",
      description: `${successfulUploads.length} document(s) have been submitted for application ${applicationRef}.`,
    });

    // Reset form
    setFiles([]);
    setApplicationRef("");
    setSelectedCategory("");
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-8 shadow-md min-h-[500px] flex flex-col">
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Upload className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-2xl text-foreground">Document Upload</h3>
          <p className="text-sm text-muted-foreground">Submit supporting documents for your application</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Application Reference */}
        <div>
          <Label htmlFor="app-ref">Application Reference Number *</Label>
          <Input
            id="app-ref"
            placeholder="e.g., GIS-2024-123456"
            value={applicationRef}
            onChange={(e) => setApplicationRef(e.target.value)}
            className="mt-1.5"
          />
        </div>

        {/* Document Category */}
        <div>
          <Label>Document Category *</Label>
          <div className="grid grid-cols-2 gap-2 mt-1.5">
            {documentCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 text-left rounded-lg border text-sm transition-all ${
                  selectedCategory === cat.id
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border hover:border-primary/50 text-muted-foreground"
                }`}
              >
                {cat.label}
                {cat.required && <span className="text-destructive ml-1">*</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(",")}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="font-medium text-foreground mb-1">
            {isDragging ? "Drop files here" : "Drag & drop files or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, JPG, PNG, DOC up to 10MB each
          </p>
        </div>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label>Uploaded Files ({files.length})</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map(file => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <File className="w-8 h-8 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      {file.status === "uploading" && (
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {file.status === "uploading" && (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    )}
                    {file.status === "success" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {file.status === "error" && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={files.filter(f => f.status === "success").length === 0}
          className="w-full"
        >
          Submit Documents
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Your documents are encrypted and securely stored. They will only be accessed by authorized GIS personnel.
        </p>
      </div>
    </div>
  );
}
