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
  const [transcribeStep, setTranscribeStep] = useState('');
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
    setTranscribeStep('Uploading file...');
    const formData = new FormData();
    formData.append('audio', fileToUpload);
    formData.append('fullPath', fileToUpload.name);

    // Simulate step progression while waiting for the API
    const steps = [
      { text: 'Transcribing audio...', delay: 2000 },
      { text: 'Analyzing transcript...', delay: 12000 },
      { text: 'Extracting insights...', delay: 20000 },
      { text: 'Saving to database...', delay: 28000 },
    ];
    const timers = steps.map(step =>
      setTimeout(() => setTranscribeStep(step.text), step.delay)
    );

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Transcription failed');
      }

      toast({
        title: 'Transcription Complete',
        description: 'Your meeting has been analyzed successfully.',
      });
      onUploadSuccess();
    } catch (error: any) {
      console.error('Transcription error:', error);
      toast({
        title: 'Transcription Failed',
        description: error.message || 'An error occurred while transcribing.',
        variant: 'destructive',
      });
    } finally {
      timers.forEach(clearTimeout);
      setIsTranscribing(false);
      setTranscribeStep('');
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
    <div className="border border-indigo-100/80 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg shadow-indigo-500/5">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-indigo-50 bg-gradient-to-r from-indigo-50/80 to-violet-50/80">
        <div className="flex items-center gap-2">
          <Upload className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[13px] font-medium text-indigo-700">Upload recording</span>
        </div>
        <div className="flex items-center gap-1.5">
          {['MP3', 'WAV', 'M4A', 'MP4', 'WEBM', 'MOV'].map(fmt => (
            <span key={fmt} className="text-[10px] font-medium text-indigo-500 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full">
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
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              isDragging ? 'border-indigo-400 bg-indigo-50/50 scale-[1.01]' : 'border-indigo-200/60 hover:border-indigo-300 hover:bg-indigo-50/30'
            }`}
          >
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mb-2">
                  <FileAudio className="w-5 h-5 text-indigo-500" />
                </div>
                <span className="text-[12px] text-indigo-400">Audio</span>
              </div>
              <div className="text-[12px] text-indigo-300 font-medium">or</div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-2">
                  <FileVideo className="w-5 h-5 text-violet-500" />
                </div>
                <span className="text-[12px] text-violet-400">Video</span>
              </div>
            </div>
            <p className="text-[13px] text-[#6b6b8a]">
              Drag and drop your file here, or <span className="text-indigo-600 font-medium underline underline-offset-2 decoration-indigo-300">browse</span>
            </p>
            <p className="text-[11px] text-[#a0a0be] mt-1.5">
              Audio track will be extracted from video files automatically
            </p>
          </div>
        ) : isTranscribing ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
            <p className="text-[14px] font-medium text-[#1a1637] mb-1">{transcribeStep}</p>
            <p className="text-[12px] text-[#8a8aa8]">This may take up to a minute depending on file size</p>
            <div className="flex items-center gap-2 mt-5">
              {['Uploading', 'Transcribing', 'Analyzing', 'Saving'].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                    transcribeStep.toLowerCase().includes(step.toLowerCase())
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-500 scale-125 shadow-md shadow-indigo-500/50'
                      : ['Uploading', 'Transcribing', 'Analyzing', 'Saving']
                          .indexOf(step) < ['Uploading', 'Transcribing', 'Analyzing', 'Saving']
                          .findIndex(s => transcribeStep.toLowerCase().includes(s.toLowerCase()))
                        ? 'bg-indigo-500'
                        : 'bg-indigo-200'
                  }`} />
                  {i < 3 && <div className="w-6 h-px bg-indigo-200" />}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
              {['Upload', 'Transcribe', 'Analyze', 'Save'].map((label) => (
                <span key={label} className="text-[10px] text-indigo-400 w-8 text-center">{label}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Selected file */}
            <div className="flex items-center gap-3 border border-indigo-100 rounded-xl px-4 py-3 bg-gradient-to-r from-indigo-50/50 to-violet-50/50">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-200 to-violet-200 flex items-center justify-center flex-shrink-0">
                {isVideo
                  ? <FileVideo className="w-4 h-4 text-violet-600" />
                  : <FileAudio className="w-4 h-4 text-indigo-600" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#1a1637] truncate">{selectedFile.name}</p>
                <p className="text-[11px] text-[#8a8aa8]">
                  {getFileSizeMB(selectedFile).toFixed(2)} MB
                  {isVideo && <span className="ml-2 text-violet-400">Audio will be extracted</span>}
                </p>
              </div>
              <button onClick={clearFile} className="p-1 rounded-lg hover:bg-indigo-100 transition-colors text-[#a0a0be] hover:text-indigo-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compressed file */}
            {compressedFile && (
              <div className="flex items-center gap-2 text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Compressed to {getFileSizeMB(compressedFile).toFixed(2)} MB
              </div>
            )}

            {/* Size warning */}
            {isCompressionNeeded && !compressedFile && (
              <div className="flex items-center gap-2 text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                File exceeds 24 MB — compress before transcribing.
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              {isCompressionNeeded && !compressedFile && (
                <button
                  onClick={compressAudio}
                  disabled={isCompressing}
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-indigo-700 border border-indigo-200 px-4 py-2 rounded-full hover:bg-indigo-50 transition-colors disabled:opacity-50"
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
                className="inline-flex items-center gap-2 text-[13px] font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2 rounded-full hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-40 ml-auto"
              >
                <span>Transcribe</span><ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Monitored files */}
        {monitoredFiles.length > 0 && !selectedFile && (
          <div className="mt-5 pt-5 border-t border-indigo-100/60">
            <p className="text-[11px] font-medium text-indigo-400 uppercase tracking-wider mb-3">Monitored files</p>
            <div className="space-y-1.5">
              {monitoredFiles.map((file) => (
                <button
                  key={file.name}
                  onClick={() => handleMonitoredFileSelect(file.name)}
                  className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all"
                >
                  <FileAudio className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                  <span className="text-[13px] text-[#4a4a6a] truncate flex-1">{file.name}</span>
                  <span className="text-[11px] text-indigo-300 flex-shrink-0">
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
