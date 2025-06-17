import React, { useState } from 'react';
// 1. Mengimpor ikon yang akan digunakan dari lucide-react
import { Plus, Pencil, Trash2, ChevronDown, X } from "lucide-react";

// 2. Definisikan tipe data yang sesuai untuk "Kategori"
type Category = {
    id: number;
    name: string;
    period: string; // contoh: '60 Menit', 'Paket Malam'
    price: number;
};

// 3. Simulasikan data kategori yang akan datang dari API (diperbanyak untuk testing scroll)
const categoryData: Category[] = [
    { id: 1, name: 'PC Gaming', period: '60 Menit', price: 15000 },
    { id: 2, name: 'PC Office', period: '60 Menit', price: 10000 },
    { id: 3, name: 'Console PS5', period: '60 Menit', price: 20000 },
    { id: 4, name: 'Paket Malam VIP', period: '6 Jam', price: 50000 },
    { id: 5, name: 'Paket Siang Regular', period: '4 Jam', price: 25000 },
    { id: 6, name: 'PC Gaming Pro', period: '90 Menit', price: 18000 },
    { id: 7, name: 'PC Streaming', period: '120 Menit', price: 22000 },
    { id: 8, name: 'Console Xbox', period: '60 Menit', price: 19000 },
    { id: 9, name: 'Paket Pagi Hemat', period: '3 Jam', price: 20000 },
    { id: 10, name: 'PC Design', period: '60 Menit', price: 16000 },
    { id: 11, name: 'Paket Weekend', period: '8 Jam', price: 60000 },
    { id: 12, name: 'PC Coding', period: '60 Menit', price: 14000 },
    { id: 13, name: 'Console Nintendo', period: '60 Menit', price: 17000 },
    { id: 14, name: 'Paket Mahasiswa', period: '5 Jam', price: 35000 },
    { id: 15, name: 'PC Premium', period: '60 Menit', price: 25000 },
];

// Komponen untuk satu baris data kategori
const CategoryRow: React.FC<{ category: Category }> = ({ category }) => {
    return (
        <div className="w-full text-sm text-gray-800 border-b border-gray-100">
            {/* Mobile Layout (< md) */}
            <div className="md:hidden p-3 space-y-2">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">#{category.id} - {category.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{category.period}</div>
                        <div className="text-sm font-medium text-[#430d4b] mt-1">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(category.price)}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                        <button className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors">
                            <Pencil size={14} />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tablet & Desktop Layout (>= md) */}
            <div className="hidden md:grid md:grid-cols-8 lg:grid-cols-9 items-center w-full px-4 py-3 gap-2">
                <div className="col-span-1 text-sm">{category.id}</div>
                <div className="md:col-span-2 lg:col-span-3 truncate text-sm font-medium">{category.name}</div>
                <div className="md:col-span-2 lg:col-span-2 truncate text-sm">{category.period}</div>
                <div className="md:col-span-2 lg:col-span-2 truncate text-sm">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(category.price)}
                </div>
                <div className="md:col-span-1 lg:col-span-1 flex justify-center">
                    <div className="flex items-center gap-1">
                        <button className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors">
                            <Pencil size={14} />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Komponen Modal Tambah Kategori
const AddCategoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        period: '',
        price: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // TODO: Implement add category logic
        console.log('Adding category:', formData);
        onClose();
        setFormData({ name: '', period: '', price: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="flex flex-col w-full max-w-[480px] items-start gap-8 p-10 relative bg-white rounded-lg">
                <div className="items-center justify-between flex relative self-stretch w-full flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] font-bold text-[#430d4b] text-sm tracking-[0] leading-[normal]">
                        Tambah Kategori
                    </div>
                    <button onClick={onClose} className="relative w-[15.5px] h-[15.5px] mr-[-0.75px] hover:opacity-70 transition-opacity">
                        <X size={16} color="#777777" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="flex-col items-start gap-8 flex relative self-stretch w-full flex-[0_0_auto]">
                    <div className="flex-col items-start gap-5 flex relative self-stretch w-full flex-[0_0_auto]">
                        <div className="flex-col items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                            <div className="relative self-stretch mt-[-1.00px] font-normal text-[#7c347e] text-sm tracking-[0] leading-[normal]">
                                Nama Kategori
                            </div>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Ketik nama kategori"
                                className="items-center gap-2.5 px-4 py-3 bg-[#f9f9f9] rounded-lg flex relative self-stretch w-full flex-[0_0_auto] font-normal text-[#777777] text-sm tracking-[0] leading-[normal] border-none outline-none focus:ring-2 focus:ring-[#430d4b] focus:ring-opacity-20"
                            />
                        </div>

                        <div className="flex-col items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                            <div className="relative self-stretch mt-[-1.00px] font-normal text-[#7c347e] text-sm tracking-[0] leading-[normal]">
                                Periode
                            </div>
                            <input
                                type="text"
                                value={formData.period}
                                onChange={(e) => handleInputChange('period', e.target.value)}
                                placeholder="Ketik periode"
                                className="items-center gap-2.5 px-4 py-3 bg-[#f9f9f9] rounded-lg flex relative self-stretch w-full flex-[0_0_auto] font-normal text-[#777777] text-sm tracking-[0] leading-[normal] border-none outline-none focus:ring-2 focus:ring-[#430d4b] focus:ring-opacity-20"
                            />
                        </div>

                        <div className="flex-col items-start gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                            <div className="relative self-stretch mt-[-1.00px] font-normal text-[#7c347e] text-sm tracking-[0] leading-[normal]">
                                Harga Sewa
                            </div>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                placeholder="Ketik harga sewa"
                                className="items-center gap-2.5 px-4 py-3 bg-[#f9f9f9] rounded-lg flex relative self-stretch w-full flex-[0_0_auto] font-normal text-[#777777] text-sm tracking-[0] leading-[normal] border-none outline-none focus:ring-2 focus:ring-[#430d4b] focus:ring-opacity-20"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="items-center justify-center gap-2.5 px-4 py-3 bg-[#430d4b] rounded-lg flex relative self-stretch w-full flex-[0_0_auto] hover:bg-[#5a1a63] transition-colors"
                    >
                        <div className="relative w-fit mt-[-1.00px] font-normal text-white text-sm tracking-[0] leading-[normal]">
                            Tambahkan kategori
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Komponen utama halaman Kategori
export const KategoriPage = (): JSX.Element => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="bg-none p-2 sm:p-4 lg:p-6 xl:p-8 w-full min-h-screen flex flex-col gap-4 sm:gap-6">
            
            {/* Header Konten: Judul dan Tombol */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="font-bold text-[#430d4b] text-xl sm:text-2xl">
                    Kelola Kategori
                </h1>
                <button 
                    onClick={openModal}
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#430d4b] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#5a1a63] transition-colors shadow-sm w-full sm:w-auto justify-center"
                >
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                    <span>Tambah Kategori</span>
                </button>
            </div>

            {/* Kontainer Tabel Data dengan Fixed Header dan Scrollable Body */}
            <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
                
                {/* Header Tabel - Fixed */}
                <div className="sticky top-0 z-10 bg-[#f5d5e0] border-b border-gray-200">
                    {/* Mobile Header */}
                    <div className="md:hidden px-3 py-3">
                        <div className="font-bold text-[#430d4b] text-sm">Daftar Kategori</div>
                    </div>
                    
                    {/* Tablet & Desktop Header */}
                    <div className="hidden md:grid md:grid-cols-8 lg:grid-cols-9 w-full px-4 py-3 text-sm font-bold text-[#430d4b] gap-2">
                        <div className="col-span-1">No</div>
                        <div className="md:col-span-2 lg:col-span-3">Nama Kategori</div>
                        <div className="md:col-span-2 lg:col-span-2">Periode</div>
                        <div className="md:col-span-2 lg:col-span-2">Harga Sewa</div>
                        <div className="md:col-span-1 lg:col-span-1 text-center">Aksi</div>
                    </div>
                </div>

                {/* Body Tabel - Scrollable */}
                <div className="overflow-y-auto max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh]">
                    {/* Merender setiap baris data menggunakan .map() */}
                    {categoryData.map(category => (
                        <CategoryRow key={category.id} category={category} />
                    ))}
                </div>

                {/* Footer Tabel dengan Paginasi - Fixed */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-2 sm:gap-4 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600">
                        Showing {categoryData.length} of {categoryData.length} entries
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-xs sm:text-sm text-gray-600">Page</span>
                        <div className="inline-flex items-center gap-2 sm:gap-3 p-2 rounded-lg border border-solid border-gray-300 cursor-pointer hover:bg-gray-50">
                            <span className="text-xs sm:text-sm text-gray-800 font-medium">1</span>
                            <ChevronDown size={14} className="sm:w-4 sm:h-4 text-gray-600"/>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modal Tambah Kategori */}
            <AddCategoryModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default KategoriPage;
