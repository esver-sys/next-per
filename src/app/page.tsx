"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("Files changed:", e.target.files);
    
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileList = Array.from(selectedFiles);
      setFiles(fileList);
      setUploadStatus(null);
      
      // 生成预览URLs
      const urls = fileList.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadStatus("请选择至少一个文件");
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
      // files.forEach(file => formData.append("files", file));
      // const response = await fetch("/api/upload", { method: "POST", body: formData });
      
      setUploadStatus(`成功上传 ${files.length} 个文件!`);
    } catch (error) {
      setUploadStatus(`上传失败，请重试: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFiles([]);
    setPreviewUrls([]);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (folderInputRef.current) {
      folderInputRef.current.value = "";
    }
  };

  const triggerFolderSelect = () => {
    // 创建一个专门用于选择文件夹的input元素
    const folderInput = document.createElement('input');
    folderInput.setAttribute('type', 'file');
    folderInput.setAttribute('webkitdirectory', '');
    folderInput.addEventListener('change', (e) => {
      handleFileChange(e as unknown as ChangeEvent<HTMLInputElement>);
    }); 
    folderInput.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">文件上传</h1>
        
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-600 transition-colors">
            <input 
              type="file" 
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            
            <label 
              htmlFor="fileInput" 
              className="cursor-pointer flex flex-col items-center text-gray-600 hover:text-blue-500 mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="mt-2 font-medium">点击选择文件</span>
              <span className="text-sm text-gray-500">支持多文件选择</span>
            </label>
            
            <button
              onClick={triggerFolderSelect}
              className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors"
            >
              选择文件夹
            </button>
          </div>

          {previewUrls.length > 0 && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-2">文件预览 ({files.length} 个文件):</h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center p-3 bg-white rounded border">
                    {file.type.startsWith("image/") ? (
                      <Image 
                        src={previewUrls[index]} 
                        alt={`Preview ${index}`} 
                        width={64}
                        height={64}
                        unoptimized
                        className="h-16 w-16 object-cover rounded mr-3"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      <p className="text-xs text-gray-400">{file.type || "未知类型"}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 text-sm text-gray-600">
                <p><span className="font-medium">总计:</span> {files.length} 个文件</p>
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
              disabled={isUploading || files.length === 0}
              className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                isUploading || files.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } transition-colors`}
            >
              {isUploading ? "上传中..." : `上传文件 (${files.length})`}
            </button>
            
            <button
              onClick={handleRemove}
              disabled={files.length === 0}
              className={`py-2 px-4 rounded-md font-medium ${
                files.length === 0
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