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
  const [showCoverDesigner, setShowCoverDesigner] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [files, setFiles] = useState<{ pdf: File | null }>({
    pdf: null,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const [genDescription, setGenDescription] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File too large. Please select a PDF under 10MB');
        return;
      }

      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please select a valid PDF file');
        return;
      }

      setFiles(prev => ({ ...prev, pdf: selectedFile }));
      toast.success('PDF uploaded successfully');
    }
  };

  const handleGenerateDescription = async (title, genre) => {
    setDescriptionLoading(true);
    try {
      const data = await generateDescription(title, genre);
      // setGenDescription(data.description);
      setForm(prev => ({ ...prev, description: data.description }));
      setForm(prev => ({ ...prev, keywords: data.keywords }));
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Failed to generate description. Please try again.');
      return '';
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
  };

  const handleCoverGenerated = (imageData: string) => {
    setCoverImage(imageData);
    setShowCoverDesigner(false);
    toast.success('Cover designed successfully');
  };

  const handleSubmit = async () => {
    // Validate form fields
    if (!form.title || !form.genre || !form.price) {
      toast.error('Please fill all required fields');
      setActiveTab('details');
      return;
    }

    if (!files.pdf) {
      toast.error('Please select a PDF file');
      setActiveTab('content');
      return;
    }

    if (!coverImage) {
      toast.error('Please design a book cover first');
      setActiveTab('cover');
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
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
            <div className="absolute right-4 top-4">
              <button
                type="button"
                className="rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-white px-6 pb-6 pt-6">
              <div className="sm:flex sm:items-start">
                <div className="text-center sm:text-left w-full">
                  <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-2">
                    Add New Book
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Fill in the details below to add your book to the collection
                  </p>

                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                      <button
                        onClick={() => setActiveTab('details')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        <Type className="h-4 w-4 inline mr-2" />
                        Details
                      </button>
                      <button
                        onClick={() => setActiveTab('content')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'content' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        <FileText className="h-4 w-4 inline mr-2" />
                        Content
                      </button>
                      <button
                        onClick={() => setActiveTab('cover')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'cover' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        <ImageIcon className="h-4 w-4 inline mr-2" />
                        Cover
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-2">
                    {activeTab === 'details' && (
                      <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="title"
                            id="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter book title"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <Label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                            Genre <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="genre"
                            id="genre"
                            value={form.genre}
                            onChange={handleChange}
                            placeholder="e.g. Fiction, Science, etc."
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <Label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                            Price ($) <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <DollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              type="number"
                              name="price"
                              id="price"
                              min="0"
                              step="0.01"
                              value={form.price}
                              onChange={handleChange}
                              className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">


                          <div className="flex justify-between items-center mb-2">
                            <Label
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-800 "
                            >
                              Description
                            </Label>
                            <button
                              onClick={() => handleGenerateDescription(form.title, form.genre)}
                              type="button"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium 
    bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md 
    hover:from-blue-600 hover:to-indigo-600 transition-all"
                              aria-label="Generate description"
                            >
                              {descriptionLoading ? (
                                <>
                                  <svg
                                    className="animate-spin h-4 w-4 text-white"
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
                                  AI Suggesting..
                                </>
                              ) : (
                                <>✨ AI Suggest</>
                              )}
                            </button>

                          </div>

                          <Textarea
                            id="description"
                            name="description"
                            rows={5}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="E.g. A thrilling mystery novel that explores the dark secrets of a small town..."
                            className="block w-full rounded-xl border border-gray-300 shadow-sm 
               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 
               sm:text-sm p-3"
                          />
                        </div>
<div className="sm:col-span-6">
                          <Label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                            Keywords
                          </Label>
                          <Input
                            type="text"
                            name="keywords"
                            id="keywords"
                            value={form.keywords}
                            onChange={handleChange}
                            placeholder="e.g. fiction, adventure, romance"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5"
                          />
                        </div>

                      </div>
                    )}

                  

                    {activeTab === 'content' && (
                      <div className="sm:col-span-6">
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Book PDF <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
                          <div className="space-y-1 text-center">
                            {files.pdf ? (
                              <div className="flex flex-col items-center">
                                <FileCheck className="mx-auto h-12 w-12 text-green-500" />
                                <div className="flex items-center mt-4">
                                  <span className="ml-2 text-sm text-gray-700">{files.pdf.name}</span>
                                  <button
                                    type="button"
                                    onClick={removeFile}
                                    className="ml-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                  PDF successfully uploaded
                                </p>
                              </div>
                            ) : (
                              <>
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
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
                                <p className="text-xs text-gray-500">PDF up to 10MB</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'cover' && (
                      <div className="sm:col-span-6">
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Book Cover <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                          <div className="h-48 w-36 flex-shrink-0 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 shadow-sm">
                            {coverImage ? (
                              <img
                                src={coverImage}
                                alt="Book cover preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center text-gray-400 p-4">
                                <BookOpen className="h-10 w-10 mb-2" />
                                <p className="text-xs text-center">No cover designed yet</p>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">Design Your Book Cover</h4>
                            <p className="text-sm text-gray-500 mb-4">
                              Create an attractive cover for your book. The title and genre from the Details tab will be used.
                            </p>
                            <button
                              type="button"
                              onClick={() => setShowCoverDesigner(true)}
                              className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              <Palette className="mr-2 h-4 w-4" />
                              {coverImage ? 'Edit Cover Design' : 'Design Cover'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:px-6">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="mt-3 sm:mt-0"
                >
                  Cancel
                </Button>

                {activeTab !== 'details' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab(activeTab === 'cover' ? 'content' : 'details')}
                    disabled={loading}
                  >
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex space-x-2">
                {activeTab !== 'cover' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab(activeTab === 'details' ? 'content' : 'cover')}
                    disabled={loading}
                  >
                    Next
                  </Button>
                )}

                {activeTab === 'cover' && (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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