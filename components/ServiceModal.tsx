import React, { useState, useEffect } from 'react';
import { ServiceItem, ServiceCategory } from '../types';
import { XIcon } from './Icons';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: ServiceItem) => void;
  initialData?: ServiceItem | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    name: '',
    category: ServiceCategory.HANDS,
    price: 0,
    duration: 30,
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        category: ServiceCategory.HANDS,
        price: 0,
        duration: 30,
        description: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    onSave({
      id: initialData?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category as ServiceCategory,
      price: Number(formData.price),
      duration: Number(formData.duration),
      description: formData.description || ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-rose-100 flex justify-between items-center bg-rose-50/50">
          <h3 className="text-xl font-serif font-semibold text-rose-900">
            {initialData ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="VD: Cắt da tay"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                value={formData.price}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
              <input
                type="number"
                required
                min="5"
                step="5"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none bg-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value as ServiceCategory})}
            >
              {Object.values(ServiceCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none resize-none"
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Mô tả quy trình hoặc lợi ích..."
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl shadow-lg shadow-rose-200 transition-all transform hover:-translate-y-0.5"
            >
              {initialData ? 'Lưu thay đổi' : 'Tạo dịch vụ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;