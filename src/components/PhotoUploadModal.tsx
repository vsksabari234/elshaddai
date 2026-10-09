import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  Image as ImageIcon, 
  Trash2, 
  Sparkles, 
  MapPin, 
  Hammer, 
  Layers, 
  FolderCheck,
  Info
} from 'lucide-react';
import { savePhoto, getAllPhotos, deletePhoto, StoredPhoto } from '../services/photoStorage';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCategory?: string;
  targetProjectId?: string;
}

export const CATEGORIES = [
  { id: 'wardrobes', label: 'Wardrobes & Storage', icon: '🗄️', countTag: 'Wardrobe' },
  { id: 'kitchens', label: 'Modular Kitchens', icon: '🍳', countTag: 'Kitchen' },
  { id: 'tv-units', label: 'TV Units & Consoles', icon: '📺', countTag: 'TV Unit' },
  { id: 'doors', label: 'Entrance Doors & Frames', icon: '🚪', countTag: 'Door' },
  { id: 'beds', label: 'Hydraulic Beds & Headboards', icon: '🛏️', countTag: 'Bed' },
  { id: 'workshop', label: 'Workshop & Site Joinery', icon: '🪚', countTag: 'Site Work' },
  { id: 'furniture', label: 'Custom Furniture & Tables', icon: '🪑', countTag: 'Furniture' },
  { id: 'other', label: 'Pooja Mandirs & Partitions', icon: '🏛️', countTag: 'Special' },
];

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  targetCategory = 'wardrobes',
  targetProjectId,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(targetCategory);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [materials, setMaterials] = useState('');
  const [isHero, setIsHero] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Categorized management tab
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [existingPhotos, setExistingPhotos] = useState<StoredPhoto[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Load existing photos when modal opens
  useEffect(() => {
    if (isOpen) {
      loadExisting();
      if (targetCategory) setCategory(targetCategory);
    }
  }, [isOpen, targetCategory]);

  const loadExisting = async () => {
    const list = await getAllPhotos();
    setExistingPhotos(list);
  };

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      if (!title) {
        // Derive initial clean title from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) return;

    setIsSaving(true);
    const photoId = targetProjectId || `photo-${Date.now()}`;

    await savePhoto({
      id: photoId,
      title: title.trim() || 'Custom Woodwork Installation',
      category: category,
      description: description.trim(),
      location: location.trim(),
      materials: materials.trim(),
      dataUrl: previewUrl,
      uploadedAt: new Date().toISOString(),
      isHero: isHero,
    });

    setIsSaving(false);
    setSavedSuccess(true);
    await loadExisting();

    setTimeout(() => {
      setSavedSuccess(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle('');
      setDescription('');
      setLocation('');
      setMaterials('');
    }, 1500);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Remove this photo from the site?')) {
      await deletePhoto(id);
      await loadExisting();
    }
  };

  const filteredExisting = existingPhotos.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div
        className="relative bg-white text-[#1C110B] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#E8DECE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-b border-[#E8DECE] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A532B] mb-0.5">
              <Upload className="w-3.5 h-3.5" />
              <span>El Shaddai Interior Works Categorized Photo Manager</span>
            </div>
            <h3 id="upload-modal-title" className="font-serif-wood text-xl sm:text-2xl font-bold text-[#1C110B]">
              Add Real Project Photos
            </h3>
            <p className="text-xs text-[#554C43]">
              Upload authentic site photos directly by category with real project details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#6B6258] hover:text-[#1C110B] hover:bg-white border border-[#E8DECE] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: Upload New vs Manage Existing */}
        <div className="flex items-center border-b border-[#E8DECE] bg-[#FAF7F2]/60 px-5 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-[#8A532B] text-[#8A532B] bg-white rounded-t-lg'
                : 'border-transparent text-[#6B6258] hover:text-[#1C110B]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload by Category</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manage'
                ? 'border-[#8A532B] text-[#8A532B] bg-white rounded-t-lg'
                : 'border-transparent text-[#6B6258] hover:text-[#1C110B]'
            }`}
          >
            <FolderCheck className="w-3.5 h-3.5" />
            <span>Manage Uploaded Photos ({existingPhotos.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'upload' ? (
            savedSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif-wood text-xl sm:text-2xl font-bold text-[#1C110B]">
                  Real Photo Saved by Category!
                </h4>
                <p className="text-xs text-[#554C43] max-w-md mx-auto">
                  Your authentic photo and details are now live in the <span className="font-semibold text-[#8A532B]">{CATEGORIES.find(c => c.id === category)?.label}</span> gallery section.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                {/* Category Selection Dock */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8A532B] mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>1. Select Woodwork Category (Required)</span>
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'bg-[#8A532B] text-white border-[#8A532B] shadow-sm scale-102'
                              : 'bg-[#FAF7F2] text-[#1C110B] border-[#E8DECE] hover:border-[#D4A373]'
                          }`}
                        >
                          <span className="text-base">{cat.icon}</span>
                          <span className="text-xs font-semibold leading-tight line-clamp-1">
                            {cat.countTag}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8A532B] mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>2. Select Real Site Photo (JPG, PNG, WEBP)</span>
                  </label>
                  
                  <div className="relative border-2 border-dashed border-[#D4A373] hover:border-[#8A532B] rounded-xl p-5 text-center bg-[#FAF7F2] transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {previewUrl ? (
                      <div className="space-y-2">
                        <div className="max-h-52 mx-auto rounded-lg overflow-hidden border border-[#E8DECE] shadow-sm inline-block">
                          <img src={previewUrl} alt="Preview" className="max-h-52 object-contain" />
                        </div>
                        <p className="text-xs text-[#8A532B] font-semibold">
                          Click or drag to change this photo
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-[#E8DECE] flex items-center justify-center mx-auto text-[#8A532B]">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-[#1C110B]">
                          Tap to select real site photo or drag and drop
                        </p>
                        <p className="text-[11px] text-[#6B6258]">
                          From phone gallery, digital camera, or WhatsApp photo exports
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Real Data Details */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8A532B]">
                    <Info className="w-3.5 h-3.5" />
                    <span>3. Authentic Project Details (No Pseudo Text)</span>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1C110B] mb-1">
                      Project Title:
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. 4-Door Fluted Teak Wardrobe with Hafele Sliding Rail"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8DECE] text-xs sm:text-sm text-[#1C110B] focus:outline-none focus:border-[#8A532B]"
                    />
                  </div>

                  {/* Real Observed Description */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1C110B] mb-1">
                      Real Observed Description (Optional):
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what is actually shown in this photo (e.g. carcass joinery, hardware tested, finish applied). Leave blank if not known."
                      className="w-full px-3.5 py-2 rounded-lg bg-[#FAF7F2] border border-[#E8DECE] text-xs text-[#1C110B] focus:outline-none focus:border-[#8A532B] resize-none"
                    />
                    <span className="text-[10px] text-[#6B6258] block mt-0.5">
                      No pseudo marketing text—only real details observed on-site.
                    </span>
                  </div>

                  {/* Location & Materials Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1C110B] mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#8A532B]" />
                        <span>Site Location:</span>
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Hennur Cross, RT Nagar, Whitefield"
                        className="w-full px-3.5 py-2 rounded-lg bg-[#FAF7F2] border border-[#E8DECE] text-xs text-[#1C110B] focus:outline-none focus:border-[#8A532B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1C110B] mb-1 flex items-center gap-1">
                        <Hammer className="w-3 h-3 text-[#8A532B]" />
                        <span>Materials / Hardware:</span>
                      </label>
                      <input
                        type="text"
                        value={materials}
                        onChange={(e) => setMaterials(e.target.value)}
                        placeholder="e.g. Burma Teak, Gurjan 710 Ply, Hettich"
                        className="w-full px-3.5 py-2 rounded-lg bg-[#FAF7F2] border border-[#E8DECE] text-xs text-[#1C110B] focus:outline-none focus:border-[#8A532B]"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E8DECE]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-lg border border-[#E8DECE] text-xs font-semibold text-[#6B6258] hover:text-[#1C110B] hover:bg-[#FAF7F2] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!previewUrl || isSaving}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-2 ${
                      previewUrl && !isSaving
                        ? 'bg-[#8A532B] hover:bg-[#724422] shadow-sm'
                        : 'bg-[#D4A373]/50 cursor-not-allowed'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isSaving ? 'Saving Real Photo...' : 'Publish to Gallery'}</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            /* Categorized Photo Management Tab */
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    filterCategory === 'all'
                      ? 'bg-[#8A532B] text-white'
                      : 'bg-[#FAF7F2] text-[#6B6258] border border-[#E8DECE]'
                  }`}
                >
                  All ({existingPhotos.length})
                </button>
                {CATEGORIES.map((cat) => {
                  const count = existingPhotos.filter((p) => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFilterCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        filterCategory === cat.id
                          ? 'bg-[#8A532B] text-white'
                          : 'bg-[#FAF7F2] text-[#6B6258] border border-[#E8DECE]'
                      }`}
                    >
                      {cat.icon} {cat.countTag} ({count})
                    </button>
                  );
                })}
              </div>

              {filteredExisting.length === 0 ? (
                <div className="py-12 text-center text-[#6B6258] space-y-2">
                  <ImageIcon className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-xs">No photos uploaded in this category yet.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="text-xs font-semibold text-[#8A532B] underline"
                  >
                    Upload first photo now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredExisting.map((p) => {
                    const catObj = CATEGORIES.find((c) => c.id === p.category);
                    return (
                      <div
                        key={p.id}
                        className="p-3 bg-[#FAF7F2] border border-[#E8DECE] rounded-xl flex items-start gap-3 shadow-2xs group"
                      >
                        <img
                          src={p.dataUrl}
                          alt={p.title}
                          className="w-16 h-16 rounded-lg object-cover border border-[#E8DECE] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A532B] block">
                            {catObj?.icon} {catObj?.label || p.category}
                          </span>
                          <h5 className="text-xs font-bold text-[#1C110B] truncate">
                            {p.title}
                          </h5>
                          {p.location && (
                            <span className="text-[10px] text-[#6B6258] flex items-center gap-1 mt-0.5 truncate">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>{p.location}</span>
                            </span>
                          )}
                          {p.description && (
                            <p className="text-[10px] text-[#554C43] line-clamp-1 mt-0.5">
                              {p.description}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
