import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { X, FileText, Palette, BookOpen, Upload, DollarSign, Type, FileCheck, ImageIcon } from 'lucide-react';
import { addBook, generateDescription } from '../../api/book';
import CoverDesigner from './Cover';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded?: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onBookAdded }) => {
  const [form, setForm] = useState({
    title: '',
    genre: '',
    price: 0,
    description: '',
    keywords: ''
  });
  const [formErrors, setFormErrors] = useState({
    title: '',
    genre: '',
    price: '',
    pdf: '',
    cover: ''
  });
  const [showCoverDesigner, setShowCoverDesigner] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [files, setFiles] = useState<{ pdf: File | null }>({
    pdf: null,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [descriptionLoading, setDescriptionLoading] = useState(false);

  if (!isOpen) return null;

  const validateDetailsTab = () => {
    const errors = {
      title: '',
      genre: '',
      price: '',
      pdf: '',
      cover: ''
    };
    
    let isValid = true;
    
    if (!form.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }
    
    if (!form.genre.trim()) {
      errors.genre = 'Genre is required';
      isValid = false;
    }
    
    if (!form.price || form.price <= 0) {
      errors.price = 'Price must be greater than 0';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const validateContentTab = () => {
    const errors = {
      title: '',
      genre: '',
      price: '',
      pdf: '',
      cover: ''
    };
    
    let isValid = true;
    
    if (!files.pdf) {
      errors.pdf = 'PDF file is required';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const validateCoverTab = () => {
    const errors = {
      title: '',
      genre: '',
      price: '',
      pdf: '',
      cover: ''
    };
    
    let isValid = true;
    
    if (!coverImage) {
      errors.cover = 'Cover image is required';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    // Clear previous error
    setFormErrors(prev => ({ ...prev, pdf: '' }));
    
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, pdf: 'File too large. Please select a PDF under 20MB' }));
        toast.error('File too large. Please select a PDF under 20MB');
        return;
      }

      if (selectedFile.type !== 'application/pdf') {
        setFormErrors(prev => ({ ...prev, pdf: 'Please select a valid PDF file' }));
        toast.error('Please select a valid PDF file');
        return;
      }

      setFiles(prev => ({ ...prev, pdf: selectedFile }));
      toast.success('PDF uploaded successfully');
    }
  };

  const handleGenerateDescription = async (title, genre) => {
    if (!title.trim() || !genre.trim()) {
      toast.error('Please enter title and genre first');
      return;
    }
    
    setDescriptionLoading(true);
    try {
      const data = await generateDescription(title, genre);
      setForm(prev => ({ ...prev, description: data.description }));
      setForm(prev => ({ ...prev, keywords: data.keywords }));
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Failed to generate description. Please try again.');
    }
    finally {
      setDescriptionLoading(false);
    }
  };

  const removeFile = () => {
    setFiles(prev => ({ ...prev, pdf: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Clear error when file is removed
    setFormErrors(prev => ({ ...prev, pdf: '' }));
  };

  const handleCoverGenerated = (imageData: string) => {
    setCoverImage(imageData);
    setShowCoverDesigner(false);
    // Clear error when cover is generated
    setFormErrors(prev => ({ ...prev, cover: '' }));
    toast.success('Cover designed successfully');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'content' && !validateDetailsTab()) {
      toast.error('Please fix the errors before proceeding');
      return;
    }
    
    if (tab === 'cover' && !validateContentTab()) {
      toast.error('Please upload a PDF file before proceeding');
      return;
    }
    
    setActiveTab(tab);
  };

  const handleSubmit = async () => {
    if (!validateDetailsTab() || !validateContentTab() || !validateCoverTab()) {
      toast.error('Please fix all errors before submitting');
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

      // Make the API call
      const response = await addBook(formData);

      if (response.data) {
        toast.success(`Book "${form.title}" added successfully!`);
        if (onBookAdded) onBookAdded();
        onClose();

        // Reset form
        setForm({
          title: '',
          genre: '',
          price: 0,
          description: '',
          keywords: ''
        });
        setCoverImage(null);
        setFiles({ pdf: null });
        setFormErrors({
          title: '',
          genre: '',
          price: '',
          pdf: '',
          cover: ''
        });
      }
    } catch (error: any) {
      console.error('Error adding book:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add book. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-center min-h-full p-4 text-center">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
            <div className="absolute right-4 top-4">
              <button
                type="button"
                className="rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-white px-6 pb-4 pt-5 max-h-[80vh] overflow-y-auto">
              <div className="sm:flex sm:items-start">
                <div className="text-center sm:text-left w-full">
                  <h3 className="text-xl font-bold leading-6 text-gray-900 mb-1">
                    Add New Book
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Fill in the details below to add your book to the collection
                  </p>

                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-6">
                      <button
                        onClick={() => handleTabChange('details')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        <Type className="h-4 w-4 inline mr-1" />
                        Details
                      </button>
                      <button
                        onClick={() => handleTabChange('content')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'content' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        <FileText className="h-4 w-4 inline mr-1" />
                        Content
                      </button>
                      <button
                        onClick={() => handleTabChange('cover')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'cover' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        <ImageIcon className="h-4 w-4 inline mr-1" />
                        Cover
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-2">
                    {activeTab === 'details' && (
                      <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="title"
                            id="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter book title"
                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 ${formErrors.title ? 'border-red-500' : ''}`}
                          />
                          {formErrors.title && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                          )}
                        </div>

                        <div className="sm:col-span-3">
                          <Label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                            Genre <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="genre"
                            id="genre"
                            value={form.genre}
                            onChange={handleChange}
                            placeholder="e.g. Fiction, Science, etc."
                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 ${formErrors.genre ? 'border-red-500' : ''}`}
                          />
                          {formErrors.genre && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.genre}</p>
                          )}
                        </div>

                        <div className="sm:col-span-3">
                          <Label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($) <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                              type="number"
                              name="price"
                              id="price"
                              min="0"
                              step="0.01"
                              value={form.price}
                              onChange={handleChange}
                              className={`block w-full rounded-md border-gray-300 pl-9 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 ${formErrors.price ? 'border-red-500' : ''}`}
                              placeholder="0.00"
                            />
                          </div>
                          {formErrors.price && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                          )}
                        </div>

                        <div className="sm:col-span-6">
                          <div className="flex justify-between items-center mb-1">
                            <Label
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-800"
                            >
                              Description
                            </Label>
                            <button
                              onClick={() => handleGenerateDescription(form.title, form.genre)}
                              type="button"
                              disabled={!form.title.trim() || !form.genre.trim() || descriptionLoading}
                              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium 
                                ${!form.title.trim() || !form.genre.trim() || descriptionLoading
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all'}`}
                              aria-label="Generate description"
                            >
                              {descriptionLoading ? (
                                <>
                                  <svg
                                    className="animate-spin h-3 w-3 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                  </svg>
                                  Generating...
                                </>
                              ) : (
                                <>✨ AI Suggest</>
                              )}
                            </button>
                          </div>

                          <Textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="E.g. A thrilling mystery novel that explores the dark secrets of a small town..."
                            className="block w-full rounded-lg border border-gray-300 shadow-sm 
               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 
               sm:text-sm p-2"
                          />
                        </div>
                        
                        <div className="sm:col-span-6">
                          <Label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
                            Keywords
                          </Label>
                          <Input
                            type="text"
                            name="keywords"
                            id="keywords"
                            value={form.keywords}
                            onChange={handleChange}
                            placeholder="e.g. fiction, adventure, romance"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'content' && (
                      <div className="sm:col-span-6">
                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                          Book PDF <span className="text-red-500">*</span>
                        </Label>
                        <div className={`mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-dashed rounded-md ${formErrors.pdf ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                          <div className="space-y-1 text-center">
                            {files.pdf ? (
                              <div className="flex flex-col items-center">
                                <FileCheck className="mx-auto h-10 w-10 text-green-500" />
                                <div className="flex items-center mt-2">
                                  <span className="ml-2 text-sm text-gray-700 truncate max-w-xs">{files.pdf.name}</span>
                                  <button
                                    type="button"
                                    onClick={removeFile}
                                    className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  PDF successfully uploaded
                                </p>
                              </div>
                            ) : (
                              <>
                                <FileText className="mx-auto h-10 w-10 text-gray-400" />
                                <div className="flex text-sm text-gray-600 justify-center">
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
                                <p className="text-xs text-gray-500">PDF up to 20MB</p>
                              </>
                            )}
                          </div>
                        </div>
                        {formErrors.pdf && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.pdf}</p>
                        )}
                      </div>
                    )}

                    {activeTab === 'cover' && (
                      <div className="sm:col-span-6">
                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                          Book Cover <span className="text-red-500">*</span>
                        </Label>
                        <div className={`flex flex-col items-center md:flex-row md:items-start gap-4 p-3 rounded-lg ${formErrors.cover ? 'bg-red-50' : ''}`}>
                          <div className="h-40 w-32 flex-shrink-0 overflow-hidden rounded-md border-2 border-dashed border-gray-300 bg-gray-50 shadow-sm">
                            {coverImage ? (
                              <img
                                src={coverImage}
                                alt="Book cover preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center text-gray-400 p-3">
                                <BookOpen className="h-8 w-8 mb-1" />
                                <p className="text-xs text-center">No cover designed yet</p>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">Design Your Book Cover</h4>
                            <p className="text-xs text-gray-500 mb-3">
                              Create an attractive cover for your book. The title and genre from the Details tab will be used.
                            </p>
                            <button
                              type="button"
                              onClick={() => setShowCoverDesigner(true)}
                              className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              <Palette className="mr-1 h-3 w-3" />
                              {coverImage ? 'Edit Cover Design' : 'Design Cover'}
                            </button>
                          </div>
                        </div>
                        {formErrors.cover && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.cover}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex flex-col-reverse sm:flex-row sm:justify-between">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="mt-2 sm:mt-0 text-sm py-1.5 h-9"
                >
                  Cancel
                </Button>

                {activeTab !== 'details' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab(activeTab === 'cover' ? 'content' : 'details')}
                    disabled={loading}
                    className="text-sm py-1.5 h-9"
                  >
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex space-x-2 mb-2 sm:mb-0">
                {activeTab !== 'cover' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleTabChange(activeTab === 'details' ? 'content' : 'cover')}
                    disabled={loading}
                    className="text-sm py-1.5 h-9"
                  >
                    Next
                  </Button>
                )}

                {activeTab === 'cover' && (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm py-1.5 h-9"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </>
                    ) : 'Publish Book'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCoverDesigner && (
        <CoverDesigner
          isOpen={showCoverDesigner}
          onClose={() => setShowCoverDesigner(false)}
          onCoverGenerated={handleCoverGenerated}
          initialTitle={form.title}
          initialGenre={form.genre}
        />
      )}
    </>
  );
};

export default AddBookModal;