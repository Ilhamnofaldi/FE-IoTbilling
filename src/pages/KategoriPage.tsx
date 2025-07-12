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

// Komponen Modal untuk Tambah Kategori
const AddCategoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        period: '',
        price: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement API call to add category
        console.log('Adding category:', formData);
        onClose();
        setFormData({ name: '', period: '', price: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#430d4b]">Tambah Kategori Baru</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Kategori
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Masukkan nama kategori"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Periode
                        </label>
                        <input
                            type="text"
                            name="period"
                            value={formData.period}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Contoh: 60 Menit, 2 Jam"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Harga Sewa (IDR)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Masukkan harga sewa"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-[#430d4b] text-white rounded-lg hover:bg-[#5a1a63] transition-colors"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
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
