import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';

interface CoverDesignerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialGenre?: string;
  onCoverGenerated: (imageData: string) => void;
}

const CoverDesigner: React.FC<CoverDesignerProps> = ({ isOpen, onClose, onCoverGenerated ,initialGenre,initialTitle}) => {
  // Text states
  const [title, setTitle] = useState(initialTitle || 'Book Title');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('Author Name');
  const [genre, setGenre] = useState(initialGenre || 'Fiction');
  
  // Style states
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#1e40af');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [textPosition, setTextPosition] = useState('center');
  const [textAlignment, setTextAlignment] = useState('center');
  const [textShadow, setTextShadow] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(30);
  
  // Layout
  const [aspectRatio, setAspectRatio] = useState('2:3');
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset to default values or keep existing ones based on your preference
    }
  }, [isOpen]);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Please select an image under 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackgroundImage(event.target.result as string);
        }
      };
      reader.onerror = () => {
        toast.error('Failed to load image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setBackgroundImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateCoverImage = useCallback(async () => {
    if (!coverRef.current) return null;

    try {
      const canvas = await html2canvas(coverRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating cover:', error);
      return null;
    }
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !author.trim()) {
      toast.error('Please fill in title and author fields');
      return;
    }

    const imageData = await generateCoverImage();
    if (imageData) {
      onCoverGenerated(imageData);
      onClose();
      toast.success('Cover generated successfully!');
    } else {
      toast.error('Failed to generate cover image');
    }
  };

  const getTextPositionClass = () => {
    switch (textPosition) {
      case 'top': return 'justify-start';
      case 'center': return 'justify-center';
      case 'bottom': return 'justify-end';
      default: return 'justify-center';
    }
  };

  const getTextAlignmentClass = () => {
    switch (textAlignment) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-center';
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '1:1': return 'aspect-square';
      case '2:3': return 'aspect-[2/3]';
      case '3:4': return 'aspect-[3/4]';
      case '4:3': return 'aspect-[4/3]';
      default: return 'aspect-square';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Design Your Book Cover</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Controls Panel */}
          <div className="w-full md:w-1/3 overflow-y-auto p-6 bg-gray-50">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Book Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter book title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter subtitle (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                    <input
                      type="text"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Book genre"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Text Styling</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-10 h-10 cursor-pointer rounded border border-gray-300"
                      />
                      <span className="ml-2 text-sm">{textColor.toUpperCase()}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="sans-serif">Sans Serif</option>
                      <option value="serif">Serif</option>
                      <option value="monospace">Monospace</option>
                      <option value="cursive">Cursive</option>
                      <option value="fantasy">Fantasy</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Position</label>
                    <select
                      value={textPosition}
                      onChange={(e) => setTextPosition(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Alignment</label>
                    <select
                      value={textAlignment}
                      onChange={(e) => setTextAlignment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="textShadow"
                      checked={textShadow}
                      onChange={(e) => setTextShadow(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="textShadow" className="ml-2 block text-sm text-gray-700">
                      Text Shadow
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Background</h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => {
                        setBackgroundColor(e.target.value);
                        setBackgroundImage(null);
                      }}
                      className="w-10 h-10 cursor-pointer rounded border border-gray-300"
                    />
                    <span className="ml-2 text-sm">{backgroundColor.toUpperCase()}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleBackgroundChange}
                      className="hidden"
                      id="background-upload"
                    />
                    <label
                      htmlFor="background-upload"
                      className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Upload Image
                    </label>
                    {backgroundImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="ml-2 inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overlay Opacity: {overlayOpacity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Adjust the darkness of the overlay for better text readability
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Layout</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="2:3">2:3 (Standard Book)</option>
                    <option value="3:4">3:4</option>
                    <option value="4:3">4:3</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-full md:w-2/3 overflow-auto p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md mx-auto">
              <div 
                ref={coverRef}
                className={`w-full ${getAspectRatioClass()} rounded-lg shadow-lg flex flex-col overflow-hidden relative`}
                style={{
                  backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
                  backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Overlay for text readability */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity/100})`,
                  }}
                />
                
                {/* Text content */}
                <div 
                  className={`flex-1 flex flex-col p-8 z-10 ${getTextPositionClass()} items-${textAlignment === 'center' ? 'center' : textAlignment === 'left' ? 'start' : 'end'}`}
                >
                  <div className={`${getTextAlignmentClass()} w-full`}>
                    <h2 
                      className="text-3xl font-bold mb-2"
                      style={{
                        color: textColor,
                        fontFamily,
                        textShadow: textShadow ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'
                      }}
                    >
                      {title}
                    </h2>
                    {subtitle && (
                      <h3 
                        className="text-xl font-semibold mb-3"
                        style={{
                          color: textColor,
                          fontFamily,
                          textShadow: textShadow ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'
                        }}
                      >
                        {subtitle}
                      </h3>
                    )}
                    <p 
                      className="text-xl mb-1"
                      style={{
                        color: textColor,
                        fontFamily,
                        textShadow: textShadow ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'
                      }}
                    >
                      by {author}
                    </p>
                    <p 
                      className="text-lg italic"
                      style={{
                        color: textColor,
                        fontFamily,
                        textShadow: textShadow ? '1px 1px 3px rgba(0,0,0,0.5)' : 'none'
                      }}
                    >
                      {genre}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 text-center">
                Cover Preview ({aspectRatio} aspect ratio)
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Generate Cover
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverDesigner;