"use client";

import { useState, useRef, ChangeEvent } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(null);
      
      // 生成预览URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("请选择一个文件");
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      // 模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 这里可以实现真实的上传逻辑
      // 例如:
      // const formData = new FormData();
      // formData.append("file", file);
      // const response = await fetch("/api/upload", { method: "POST", body: formData });
      
      setUploadStatus("文件上传成功!");
    } catch (error) {
      setUploadStatus("上传失败，请重试");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">文件上传</h1>
        
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-600 transition-colors">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            
            <label 
              htmlFor="fileInput" 
              className="cursor-pointer flex flex-col items-center text-gray-600 hover:text-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="mt-2 font-medium">点击选择文件</span>
              <span className="text-sm text-gray-500">支持所有文件类型</span>
            </label>
          </div>

          {previewUrl && file && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-2">文件预览:</h3>
              
              {file.type.startsWith("image/") ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full h-48 object-contain mx-auto rounded"
                />
              ) : (
                <div className="flex items-center p-4 bg-white rounded border">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              )}
              
              <div className="mt-3 text-sm text-gray-600">
                <p><span className="font-medium">文件名:</span> {file.name}</p>
                <p><span className="font-medium">文件大小:</span> {(file.size / 1024).toFixed(2)} KB</p>
                <p><span className="font-medium">文件类型:</span> {file.type || "未知"}</p>
              </div>
            </div>
          )}

          {uploadStatus && (
            <div className={`p-3 rounded text-center text-sm font-medium ${
              uploadStatus.includes("成功") 
                ? "bg-green-100 text-green-700" 
                : uploadStatus.includes("失败") 
                  ? "bg-red-100 text-red-700" 
                  : "bg-blue-100 text-blue-700"
            }`}>
              {uploadStatus}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                isUploading || !file
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } transition-colors`}
            >
              {isUploading ? "上传中..." : "上传文件"}
            </button>
            
            <button
              onClick={handleRemove}
              disabled={!file}
              className={`py-2 px-4 rounded-md font-medium ${
                !file
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              } transition-colors`}
            >
              清除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}