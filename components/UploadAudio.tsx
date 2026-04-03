'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast"
import { FileAudio, FileVideo, Upload, X, Loader2, ArrowRight } from 'lucide-react';

let ffmpeg: any = null;

interface MonitoredFile {
  name: string;
  size: number;
  lastModified: string;
}

const UploadAudio: React.FC<{ onUploadSuccess: () => void }> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [monitoredFiles, setMonitoredFiles] = useState<MonitoredFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMonitoredFiles();
    const interval = setInterval(fetchMonitoredFiles, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMonitoredFiles = async () => {
    try {
      const response = await fetch('/api/monitored-files');
      if (response.ok) {
        const files: MonitoredFile[] = await response.json();
        setMonitoredFiles(files);
      }
    } catch (error) {
      console.error('Error fetching monitored files:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCompressedFile(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCompressedFile(null);
    }
  };

  const handleMonitoredFileSelect = async (fileName: string) => {
    try {
      const response = await fetch(`/api/monitored-files/${encodeURIComponent(fileName)}`);
      if (response.ok) {
        const blob = await response.blob();
        const file = new File([blob], fileName, { type: blob.type });
        setSelectedFile(file);
        setCompressedFile(null);
      }
    } catch (error) {
      console.error('Error selecting monitored file:', error);
      toast({
        title: 'File Selection Failed',
        description: 'An error occurred while selecting the file.',
        variant: 'destructive',
      });
    }
  };

  const loadFFmpeg = async () => {
    if (!ffmpeg) {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      ffmpeg = new FFmpeg();
    }
    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }
  };

  const compressAudio = async () => {
    if (!selectedFile) return;
    setIsCompressing(true);
    try {
      await loadFFmpeg();
      const { fetchFile } = await import('@ffmpeg/util');
      await ffmpeg.writeFile('input_audio', await fetchFile(selectedFile));
      await ffmpeg.exec([
        '-i', 'input_audio',
        '-ar', '16000',
        '-ac', '1',
        '-b:a', '16k',
        'output_audio.mp3'
      ]);

      const data = await ffmpeg.readFile('output_audio.mp3');
      const compressedBlob = new Blob([data], { type: 'audio/mpeg' });
      const compressed = new File([compressedBlob], `compressed_${selectedFile.name}`, {
        type: 'audio/mpeg',
      });

      setCompressedFile(compressed);
      toast({
        title: 'Compression Successful',
        description: `File size reduced to ${(compressed.size / (1024 * 1024)).toFixed(2)} MB`,
      });
    } catch (error) {
      console.error('Compression error:', error);
      toast({
        title: 'Compression Failed',
        description: 'An error occurred while compressing the audio.',
        variant: 'destructive',
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleTranscribe = async () => {
    const fileToUpload = compressedFile || selectedFile;
    if (!fileToUpload) return;

    setIsTranscribing(true);
    const formData = new FormData();
    formData.append('audio', fileToUpload);
    formData.append('fullPath', fileToUpload.name);

    try {
      await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      toast({
        title: 'Transcription Started',
        description: 'Your file is being transcribed.',
      });
      onUploadSuccess();
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: 'Transcription Failed',
        description: 'An error occurred while transcribing.',
        variant: 'destructive',
      });
    } finally {
      setIsTranscribing(false);
      setSelectedFile(null);
      setCompressedFile(null);
    }
  };

  const getFileSizeMB = (file: File | null): number => {
    return file ? file.size / (1024 ** 2) : 0;
  };

  const isVideo = selectedFile?.type.startsWith('video/');
  const isCompressionNeeded = selectedFile && getFileSizeMB(selectedFile) > 24;
  const isTranscribeDisabled =
    (selectedFile && getFileSizeMB(selectedFile) > 24 && (!compressedFile || getFileSizeMB(compressedFile) > 24)) ||
    isCompressing ||
    isTranscribing;

  const clearFile = () => {
    setSelectedFile(null);
    setCompressedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="border border-[#e5e5e5] rounded-xl overflow-hidden bg-white">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#e5e5e5] bg-[#fafafa]">
        <div className="flex items-center gap-2">
          <Upload className="w-3.5 h-3.5 text-[#999]" />
          <span className="text-[13px] font-medium text-[#0a0a0a]">Upload recording</span>
        </div>
        <div className="flex items-center gap-1.5">
          {['MP3', 'WAV', 'M4A', 'MP4', 'WEBM', 'MOV'].map(fmt => (
            <span key={fmt} className="text-[10px] font-medium text-[#999] bg-white border border-[#eee] px-1.5 py-0.5 rounded">
              {fmt}
            </span>
          ))}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />

      {/* Drop zone or file preview */}
      <div className="p-5">
        {!selectedFile ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-[#0a0a0a] bg-[#fafafa]' : 'border-[#ddd] hover:border-[#aaa]'
            }`}
          >
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center mb-2">
                  <FileAudio className="w-5 h-5 text-[#888]" />
                </div>
                <span className="text-[12px] text-[#999]">Audio</span>
              </div>
              <div className="text-[12px] text-[#ccc] font-medium">or</div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center mb-2">
                  <FileVideo className="w-5 h-5 text-[#888]" />
                </div>
                <span className="text-[12px] text-[#999]">Video</span>
              </div>
            </div>
            <p className="text-[13px] text-[#666]">
              Drag and drop your file here, or <span className="text-[#0a0a0a] font-medium underline underline-offset-2">browse</span>
            </p>
            <p className="text-[11px] text-[#bbb] mt-1.5">
              Audio track will be extracted from video files automatically
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Selected file */}
            <div className="flex items-center gap-3 border border-[#e5e5e5] rounded-lg px-4 py-3 bg-[#fafafa]">
              <div className="w-8 h-8 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0">
                {isVideo
                  ? <FileVideo className="w-4 h-4 text-[#666]" />
                  : <FileAudio className="w-4 h-4 text-[#666]" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#0a0a0a] truncate">{selectedFile.name}</p>
                <p className="text-[11px] text-[#999]">
                  {getFileSizeMB(selectedFile).toFixed(2)} MB
                  {isVideo && <span className="ml-2 text-[#bbb]">Audio will be extracted</span>}
                </p>
              </div>
              <button onClick={clearFile} className="p-1 rounded hover:bg-[#eee] transition-colors text-[#999] hover:text-[#666]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compressed file */}
            {compressedFile && (
              <div className="flex items-center gap-2 text-[12px] text-[#666] bg-[#f0fdf4] border border-[#dcfce7] rounded-lg px-4 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Compressed to {getFileSizeMB(compressedFile).toFixed(2)} MB
              </div>
            )}

            {/* Size warning */}
            {isCompressionNeeded && !compressedFile && (
              <div className="flex items-center gap-2 text-[12px] text-[#92400e] bg-[#fffbeb] border border-[#fef3c7] rounded-lg px-4 py-2.5">
                File exceeds 24 MB — compress before transcribing.
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              {isCompressionNeeded && !compressedFile && (
                <button
                  onClick={compressAudio}
                  disabled={isCompressing}
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-[#0a0a0a] border border-[#e5e5e5] px-4 py-2 rounded-md hover:bg-[#fafafa] transition-colors disabled:opacity-50"
                >
                  {isCompressing
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Compressing...</>
                    : 'Compress file'
                  }
                </button>
              )}
              <button
                onClick={handleTranscribe}
                disabled={isTranscribeDisabled || !selectedFile}
                className="inline-flex items-center gap-2 text-[13px] font-medium bg-[#0a0a0a] text-white px-5 py-2 rounded-md hover:bg-[#333] transition-colors disabled:opacity-40 ml-auto"
              >
                {isTranscribing
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Transcribing...</>
                  : <><span>Transcribe</span><ArrowRight className="w-3.5 h-3.5" /></>
                }
              </button>
            </div>
          </div>
        )}

        {/* Monitored files */}
        {monitoredFiles.length > 0 && !selectedFile && (
          <div className="mt-5 pt-5 border-t border-[#eee]">
            <p className="text-[11px] font-medium text-[#999] uppercase tracking-wider mb-3">Monitored files</p>
            <div className="space-y-1.5">
              {monitoredFiles.map((file) => (
                <button
                  key={file.name}
                  onClick={() => handleMonitoredFileSelect(file.name)}
                  className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-md hover:bg-[#fafafa] border border-transparent hover:border-[#eee] transition-all"
                >
                  <FileAudio className="w-4 h-4 text-[#bbb] flex-shrink-0" />
                  <span className="text-[13px] text-[#444] truncate flex-1">{file.name}</span>
                  <span className="text-[11px] text-[#bbb] flex-shrink-0">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadAudio;
