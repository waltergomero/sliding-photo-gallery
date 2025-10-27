'use client';

import React, { useState, useCallback, useEffect } from 'react'
import heic2any from 'heic2any';
import { XMarkIcon, ArrowUpTrayIcon, PhotoIcon } from '@heroicons/react/24/outline'
import Compressor from 'compressorjs';
import {fetchCategories} from "@/actions/category-actions";
import {  useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';


type MediaType = 'image' | 'video';
interface PreviewMedia {
  file: File;
  compressedFile?: File; // Only for images
  url: string;
  id: string;
  caption: string;
  type: MediaType;
}

const UploadImages = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userId =   session?.user?.id;

  const [selectedMedia, setSelectedMedia] = useState<PreviewMedia[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
   const [categoryValue, setCategoryValue] = useState<string | null>(null);
   const [categoryText, setCategoryText] = useState<string | null>(null);

  type Category = { id: string | number; category_name: string };
  const [categories, setCategories] = useState<Category[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9)

  useEffect(() => {
      const getCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
      };
       getCategories();
      }, []);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      new Compressor(file, {
        quality: 0.95,
        maxWidth: 2016,
        maxHeight: 1512,
        success: (compressedFile) => {
          resolve(compressedFile as File)
        },
        error: (error) => {
          console.error('Compression error:', error)
          // If compression fails, return original file
          resolve(file)
        }
      })
    })
  }


  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const fileArr = Array.from(files);
    const imageFiles = fileArr.filter(file =>
      file.type.startsWith('image/') ||
      file.name.toLowerCase().endsWith('.heic')
    );
    const videoFiles = fileArr.filter(file => file.type.startsWith('video/'));

    setIsCompressing(true);
    try {
      const newMedia: PreviewMedia[] = [];
      // Handle images
      for (const file of imageFiles) {
        let processedFile = file;
        // Convert HEIC to JPEG
        if (file.name.toLowerCase().endsWith('.heic')) {
          try {
            const convertedBlob = await heic2any({
              blob: file,
              toType: 'image/jpeg',
              quality: 0.99
            });
            // heic2any returns a Blob or an array of Blobs
            const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
            processedFile = new File([blob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
          } catch (err) {
            console.error('HEIC conversion failed:', err);
            // fallback to original file
          }
        }
        const compressedFile = await compressImage(processedFile);
        newMedia.push({
          file: processedFile,
          compressedFile,
          url: URL.createObjectURL(compressedFile),
          id: generateId(),
          caption: '',
          type: 'image',
        });
      }
      // Handle videos
      for (const file of videoFiles) {
        newMedia.push({
          file,
          url: URL.createObjectURL(file),
          id: generateId(),
          caption: '',
          type: 'video',
        });
      }
      if (newMedia.length > 0) {
        setSelectedMedia(prev => [...prev, ...newMedia]);
      }
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsCompressing(false);
    }
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFileSelect(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    await handleFileSelect(e.dataTransfer.files);
  };

const removeMedia = useCallback((id: string) => {
  setSelectedMedia(prev => {
    const mediaToRemove = prev.find(m => m.id === id);
    if (mediaToRemove) {
      URL.revokeObjectURL(mediaToRemove.url);
    }
    return prev.filter(m => m.id !== id);
  });
}, []);

  const updateCaption = (id: string, caption: string) => {
    setSelectedMedia(prev =>
      prev.map(m => (m.id === id ? { ...m, caption } : m))
    );
  };

   const handleClick = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const dropdownName = e.target.options[e.target.selectedIndex].text;
        if(dropdownName){
          setCategoryText(dropdownName);
          setCategoryValue(e.target.value);
        } 
        else{
          setCategoryText(null);
          setCategoryValue(null);
        }
      };

  const clearAllMedia = () => {
    selectedMedia.forEach(m => URL.revokeObjectURL(m.url));
    setSelectedMedia([]);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (selectedMedia.length === 0) return;
    if (categoryText === null) {
      toast.error("Please select a category.");
      return;
    }
    setIsUploading(true);
    try {
      const API_PATH = "/api/admin/gallery/";
      for (const media of selectedMedia) {
        const extension = media.file.name.substr(media.file.name.lastIndexOf(".") + 1);
        const formData = new FormData();
        if (media.type === 'image' && media.compressedFile) {
          formData.append('image', media.compressedFile);
        }
        else if (media.type === 'video') {
          formData.append('video', media.file);
        }
        //formData.append(media.type === 'image' ? 'image' : 'video', media.file);
        formData.append('extension', extension);
        formData.append('caption', media.caption);
        formData.append("categoryId", categoryValue ?? "");
        formData.append("category_name", categoryText ?? "");
        formData.append("userId", userId ?? "");
        formData.append('type', media.type);
        const response = await fetch(API_PATH, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Upload failed');
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearAllMedia();
      if (fileInputRef.current) fileInputRef.current.value = '';

      router.push(`/admin/gallery/category/${categoryText}`);
    } catch (error) {
       console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.' + error);
    } finally {
      setIsUploading(false);
    }
  };

  // Cleanup URLs on unmount
  React.useEffect(() => {
    return () => {
      selectedMedia.forEach(m => URL.revokeObjectURL(m.url));
    };
  }, [selectedMedia]);

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-xxl-12">
          <div className="card">
            <div className="card-body">
            <div className="mb-3 col-md-2">
            <label htmlFor="category" className="form-label">Select Category: </label>
            <select
                name="category_id"
                onChange={handleClick}
                required
                className="form-select">
                <option value=""></option>
                {categories.map((category) => (
                <option key={category.id} value={category.id}>
                    {category.category_name}
                </option>
                ))}
            </select>
            </div>
              <div
                className={`border rounded pb-2 text-center ${
                  isDragOver 
                    ? 'border-primary bg-light' 
                    : 'border-2'
                }`}
                style={{ 
                  borderStyle: 'dashed',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <PhotoIcon style={{ width: '48px', height: '48px' }} className="text-muted mb-3" />
                {isCompressing ? (
                  <>
                    <div className="spinner-border text-primary mb-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h5 className="text-primary mb-2">
                      Processing files...
                    </h5>
                  </>
                ) : (
                  <>
                    <h5 className="text-dark mb-2">
                      Drop images or videos here or click to select
                    </h5>
                    <p className="text-muted mb-3">
                      Supports: JPG, JPEG, PNG, GIF, WebP, MP4, WebM, AVI
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.heic"
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                  id="file-input"
                  disabled={isCompressing}
                />
                <label
                  htmlFor="file-input"
                  className={`btn d-inline-flex align-items-center ${
                    isCompressing ? 'btn-secondary' : 'btn-primary'
                  }`}
                  style={{ 
                    cursor: isCompressing ? 'not-allowed' : 'pointer',
                    pointerEvents: isCompressing ? 'none' : 'auto'
                  }}
                >
                  <ArrowUpTrayIcon style={{ width: '16px', height: '16px' }} className="me-2" />
                  {isCompressing ? 'Processing...' : 'Choose Files'}
                </label>
              </div>

              {/* Preview Section */}
              {selectedMedia.length > 0 && (
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className="mb-0">
                      Preview ({selectedMedia.length} file{selectedMedia.length !== 1 ? 's' : ''})
                      {selectedMedia.filter(m => m.caption.trim()).length > 0 && (
                        <small className="text-success ms-2">
                          ({selectedMedia.filter(m => m.caption.trim()).length} with captions)
                        </small>
                      )}
                    </h5>
                    <button
                      type="button"
                      onClick={clearAllMedia}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Clear All
                    </button>
                  </div>
                  {/* Media Grid */}
                  <div className="row mb-2">
                    {selectedMedia.map((media) => (
                      <div key={media.id} className="col-md-2 col-sm-3 col-4 mb-1">
                        <div className="card h-100">
                          <div className="position-relative">
                            <div
                              className="card-img-top"
                              style={{
                                width: '100%',
                                aspectRatio: '1/1',
                                overflow: 'hidden',
                                background: '#f8f9fa',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {media.type === 'image' ? (
                                <img
                                  src={media.url}
                                  alt={media.file.name}
                                  className="img-fluid"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <video
                                  src={media.url}
                                  controls
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMedia(media.id)}
                              className="btn btn-danger btn-sm position-absolute"
                              style={{ 
                                top: '8px', 
                                right: '8px',
                                width: '28px',
                                height: '28px',
                                padding: '0',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <XMarkIcon style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                          <div className="card-body p-2 mt-2">
                            <div className="mb-0">
                              <textarea
                                className="form-control form-control-sm"
                                placeholder="Enter caption..."
                                value={media.caption}
                                onChange={(e) => updateCaption(media.id, e.target.value)}
                                rows={2}
                                style={{ 
                                  fontSize: '12px',
                                  resize: 'vertical',
                                  minHeight: '38px'
                                }}
                              />
                              {media.caption.length > 0 && (
                                <small className="text-muted" style={{ fontSize: '10px' }}>
                                  {media.caption.length} characters
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Upload Button */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploading || selectedMedia.length === 0}
                      className="btn btn-success btn-lg d-inline-flex align-items-center"
                    >
                      {isUploading ? (
                        <>
                          <div 
                            className="spinner-border spinner-border-sm me-2" 
                            role="status" 
                            aria-hidden="true"
                          ></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <ArrowUpTrayIcon style={{ width: '16px', height: '16px' }} className="me-2" />
                          Upload {selectedMedia.length} File{selectedMedia.length !== 1 ? 's' : ''}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadImages