import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { X, FileText, Palette, BookOpen } from 'lucide-react';
import { addBook, Book } from '../../api/book';
import CoverDesigner from './Cover';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded?: () => void;
}

type BackgroundType = 'color' | 'image';

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onBookAdded }) => {
  const [form, setForm] = useState({
    title: '',
    genre: '',
    price: 0,
    description: '',
    backgroundColor: '#FFFFFF',
    keywords: ''
  });
  const [showCoverDesigner, setShowCoverDesigner] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('color');
  const [files, setFiles] = useState<{ pdf: File | null }>({
    pdf: null,
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFiles(prev => ({ ...prev, pdf: selectedFile }));
    }
  };

  const removeFile = () => {
    setFiles(prev => ({ ...prev, pdf: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCoverGenerated = (imageData: string) => {
    setCoverImage(imageData);
    setShowCoverDesigner(false);
  };

  const handleSubmit = async () => {
    // Validate form fields
    if (!form.title || !form.genre || !form.price) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!files.pdf) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!coverImage) {
      toast.error('Please design a book cover first');
      return;
    }

    setLoading(true);
    
    try {
      // Create a new FormData instance
      const formData = new FormData();

      // Append text fields
      formData.append('title', form.title);
      formData.append('genre', form.genre);
      formData.append('price', form.price.toString());
      if (form.description) formData.append('description', form.description);
      if (form.keywords) formData.append('keywords', form.keywords);

      // Append PDF file
      if (files.pdf) {
        formData.append('pdf', files.pdf);
      }

      // Convert base64 to blob and append cover image
      const base64Response = await fetch(coverImage);
      const blob = await base64Response.blob();
      const coverFile = new File(
        [blob], 
        'cover.png', 
        { type: 'image/png' }
      );
      formData.append('coverImage', coverFile);

      // Log form data for debugging
      console.log('FormData content:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Make the API call
      console.log('Sending request to server...');
      const response = await addBook(formData);
      
      if (response.data) {
        toast.success(`Book "${form.title}" added successfully!`);
        if (onBookAdded) onBookAdded();
        onClose();
      }
    } catch (error: any) {
      console.error('Error adding book:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add book. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div>
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Add New Book
              </h3>
              <div className="mt-2">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <Input
                        type="text"
                        name="title"
                        id="title"
                        value={form.title}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                      Genre <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <Input
                        type="text"
                        name="genre"
                        id="genre"
                        value={form.genre}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price ($) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <Input
                        type="number"
                        name="price"
                        id="price"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <Textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                      Keywords (comma separated)
                    </label>
                    <div className="mt-1">
                      <Input
                        type="text"
                        name="keywords"
                        id="keywords"
                        value={form.keywords}
                        onChange={handleChange}
                        placeholder="fiction, mystery, thriller"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Book PDF <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">Max 10MB</span>
                    </div>
                    <div className="mt-1 flex items-center">
                      <div className="flex-1">
                        {files.pdf ? (
                          <div className="flex items-center justify-between rounded-md border border-gray-300 px-3 py-2">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <span className="ml-2 text-sm text-gray-700">{files.pdf.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={removeFile}
                              className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                            <div className="space-y-1 text-center">
                              <div className="flex justify-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                              </div>
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="pdf-upload"
                                  className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    ref={fileInputRef}
                                    id="pdf-upload"
                                    name="pdf-upload"
                                    type="file"
                                    className="sr-only"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PDF up to 10MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Book Cover <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">Required</span>
                    </div>
                    <div className="mt-1">
                      <div className="flex items-center space-x-4">
                        <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt="Book cover preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                              <BookOpen className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <button
                            type="button"
                            onClick={() => setShowCoverDesigner(true)}
                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <Palette className="mr-2 h-4 w-4" />
                            {coverImage ? 'Edit Cover' : 'Design Cover'}
                          </button>
                          <p className="mt-2 text-xs text-gray-500">
                            Create a custom book cover with title, author, and genre
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Add Book'}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCoverDesigner && (
        <CoverDesigner
          isOpen={showCoverDesigner}
          onClose={() => setShowCoverDesigner(false)}
          onCoverGenerated={handleCoverGenerated}
        />
      )}
    </div>
  );
};

export default AddBookModal;