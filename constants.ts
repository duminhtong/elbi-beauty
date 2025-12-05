import { ServiceItem, ServiceCategory } from './types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: '1',
    name: 'Cắt da tay & Sơn thường',
    category: ServiceCategory.HANDS,
    price: 150000,
    duration: 30,
    description: 'Làm sạch da thừa quanh móng, tạo form móng chuẩn và sơn màu thường cao cấp.'
  },
  {
    id: '2',
    name: 'Sơn Gel Trơn',
    category: ServiceCategory.HANDS,
    price: 250000,
    duration: 45,
    description: 'Sơn gel bền màu, bóng đẹp, giữ màu lên đến 3 tuần.'
  },
  {
    id: '3',
    name: 'Chà gót chân hồng',
    category: ServiceCategory.FEET,
    price: 300000,
    duration: 45,
    description: 'Loại bỏ tế bào chết, vết chai sần, giúp gót chân mềm mại và hồng hào.'
  },
  {
    id: '4',
    name: 'Đắp bột Ombre',
    category: ServiceCategory.EXTENSIONS,
    price: 550000,
    duration: 90,
    description: 'Kỹ thuật đắp bột loang màu nghệ thuật, tạo hiệu ứng chuyển màu tự nhiên.'
  },
  {
    id: '5',
    name: 'Vẽ Art (4 ngón)',
    category: ServiceCategory.NAIL_ART,
    price: 100000,
    duration: 20,
    description: 'Vẽ họa tiết theo yêu cầu hoặc mẫu có sẵn cho 4 ngón tay.'
  },
  {
    id: '6',
    name: 'Massage tay thư giãn',
    category: ServiceCategory.SPA,
    price: 200000,
    duration: 30,
    description: 'Massage bấm huyệt bàn tay và cánh tay với tinh dầu thiên nhiên.'
  },
  {
    id: '7',
    name: 'Đính đá full móng (1 ngón)',
    category: ServiceCategory.NAIL_ART,
    price: 50000,
    duration: 15,
    description: 'Đính đá khối, đá chân bằng cao cấp sáng lấp lánh.'
  },
  {
    id: '8',
    name: 'Úp móng nghệ thuật',
    category: ServiceCategory.EXTENSIONS,
    price: 400000,
    duration: 60,
    description: 'Sử dụng móng úp cao cấp, form chuẩn, không hại móng thật.'
  }
];

export const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  [ServiceCategory.HANDS]: 'bg-rose-100 text-rose-800',
  [ServiceCategory.FEET]: 'bg-purple-100 text-purple-800',
  [ServiceCategory.NAIL_ART]: 'bg-pink-100 text-pink-800',
  [ServiceCategory.EXTENSIONS]: 'bg-orange-100 text-orange-800',
  [ServiceCategory.SPA]: 'bg-teal-100 text-teal-800',
};