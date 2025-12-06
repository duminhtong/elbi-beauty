import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_SERVICES, CATEGORY_COLORS } from './constants';
import { ServiceItem, ServiceCategory } from './types';
import { searchServicesWithAI } from './services/geminiService';
import ServiceModal from './components/ServiceModal';
import { 
  SearchIcon, 
  SparklesIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  LockIcon, 
  UnlockIcon 
} from './components/Icons';

function App() {
  // --- State ---
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResultIds, setAiResultIds] = useState<string[]>([]);
  
  // Admin State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // --- Initialization ---
  useEffect(() => {
    const saved = localStorage.getItem('nail_services');
    if (saved) {
      setServices(JSON.parse(saved));
    } else {
      setServices(INITIAL_SERVICES);
      localStorage.setItem('nail_services', JSON.stringify(INITIAL_SERVICES));
    }
  }, []);

  // --- Handlers ---
  const handleSaveService = (service: ServiceItem) => {
    setServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      let updated;
      if (exists) {
        updated = prev.map(s => s.id === service.id ? service : s);
      } else {
        updated = [service, ...prev];
      }
      localStorage.setItem('nail_services', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá dịch vụ này không?')) {
      setServices(prev => {
        const updated = prev.filter(s => s.id !== id);
        localStorage.setItem('nail_services', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  // --- Search Logic ---
  // Debounce AI Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (isAiMode && searchQuery.length > 2) {
        setIsAiLoading(true);
        const ids = await searchServicesWithAI(searchQuery, services);
        setAiResultIds(ids);
        setIsAiLoading(false);
      } else if (isAiMode && searchQuery.length === 0) {
        setAiResultIds([]);
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, isAiMode, services]);

  const filteredServices = useMemo(() => {
    if (!searchQuery) return services;

    if (isAiMode) {
      if (isAiLoading) return []; // Or keep showing previous results
      if (aiResultIds.length > 0) {
        // Return services ordered by the AI's result list
        return aiResultIds
          .map(id => services.find(s => s.id === id))
          .filter((s): s is ServiceItem => !!s);
      }
      return searchQuery.length > 2 ? [] : services; // Return nothing if AI found nothing for a long query
    }

    // Standard Text Search
    const lowerQuery = searchQuery.toLowerCase();
    return services.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) || 
      s.category.toLowerCase().includes(lowerQuery) ||
      s.price.toString().includes(lowerQuery)
    );
  }, [services, searchQuery, isAiMode, aiResultIds, isAiLoading]);

  // Group by category for cleaner display (optional, but requested layout is list)
  // Let's stick to a flat list or grouped list. A flat list with category badges is often better for search results.

  return (
    <div className="min-h-screen pb-12 font-sans selection:bg-rose-200">
      
      {/* Header Area */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all duration-300">
        <div className="max-w-3xl mx-auto px-4 py-4 md:py-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-rose-900 tracking-tight">
                ELBI BEAUTY
              </h1>
              <p className="text-rose-500 text-sm font-medium mt-1">Bảng giá dịch vụ chính thức</p>
            </div>
            
            {/* Admin Toggle */}
            <button 
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`p-2 rounded-full transition-colors ${isAdminMode ? 'bg-rose-100 text-rose-600' : 'text-gray-300 hover:text-gray-400'}`}
              title="Chế độ quản trị"
            >
              {isAdminMode ? <UnlockIcon className="w-5 h-5"/> : <LockIcon className="w-5 h-5"/>}
            </button>
          </div>

          {/* Search Bar Container */}
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-rose-200 to-pink-200 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500 ${isAiMode ? 'opacity-60' : ''}`}></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
              <div className="pl-4 text-gray-400">
                {isAiMode ? <SparklesIcon className="w-5 h-5 text-rose-500 animate-pulse"/> : <SearchIcon className="w-5 h-5"/>}
              </div>
              <input 
                type="text"
                placeholder={isAiMode ? "Tìm kiếm thông minh (VD: làm móng cho cô dâu...)" : "Tìm dịch vụ, giá tiền..."}
                className="w-full py-4 px-3 text-gray-700 outline-none placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {/* AI Toggle */}
              <button 
                onClick={() => {
                  setIsAiMode(!isAiMode);
                  setSearchQuery(''); 
                  setAiResultIds([]);
                }}
                className={`flex items-center gap-2 px-4 py-2 m-1 rounded-xl text-sm font-semibold transition-all duration-300 ${isAiMode ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                <SparklesIcon className="w-4 h-4" />
                <span>AI</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 pt-6">
        
        {/* Admin Controls */}
        {isAdminMode && (
          <div className="mb-6 flex justify-end animate-fade-in">
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl font-medium shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all hover:-translate-y-0.5"
            >
              <PlusIcon className="w-5 h-5" />
              Thêm dịch vụ
            </button>
          </div>
        )}

        {/* Results Info */}
        <div className="flex justify-between items-end mb-4 px-2">
          <h2 className="text-xl font-serif font-semibold text-gray-800">
            {isAiMode && searchQuery 
              ? `Gợi ý cho bạn` 
              : 'Danh sách dịch vụ'}
          </h2>
          <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
            {filteredServices.length} kết quả
          </span>
        </div>

        {/* Loading State */}
        {isAiMode && isAiLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-rose-400 space-y-3">
             <div className="w-8 h-8 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
             <p className="text-sm font-medium animate-pulse">AI đang tìm kiếm dịch vụ phù hợp...</p>
          </div>
        )}

        {/* Service List */}
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <div 
              key={service.id} 
              className="group bg-white rounded-2xl p-5 border border-rose-50 shadow-sm hover:shadow-md hover:border-rose-100 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${CATEGORY_COLORS[service.category]}`}>
                      {service.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-rose-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-2 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                      ⏱ {service.duration} phút
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className="text-lg font-bold text-rose-600 font-serif">
                    {service.price.toLocaleString('vi-VN')}đ
                  </span>
                  
                  {isAdminMode && (
                    <div className="flex gap-1 mt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(service)}
                        className="p-2 text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <EditIcon className="w-4 h-4"/>
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4"/>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {!isAiLoading && filteredServices.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-300">
                <SearchIcon className="w-8 h-8 opacity-50"/>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy dịch vụ</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                {isAiMode ? "AI không tìm thấy dịch vụ nào phù hợp với mô tả của bạn." : "Thử tìm kiếm với từ khóa khác hoặc danh mục khác."}
              </p>
              {isAiMode && (
                <button 
                  onClick={() => {
                    setIsAiMode(false);
                    setSearchQuery('');
                  }}
                  className="mt-4 text-sm text-rose-600 hover:text-rose-700 font-medium hover:underline"
                >
                  Quay lại tìm kiếm thường
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <ServiceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveService}
        initialData={editingService}
      />
    </div>
  );
}

export default App;