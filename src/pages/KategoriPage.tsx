import React, { useState, useEffect } from 'react';
// 1. Mengimpor ikon yang akan digunakan dari lucide-react
import { Plus, Pencil, Trash2, ChevronDown, X } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

// 2. Definisikan tipe data yang sesuai untuk "Kategori" berdasarkan API response
type Category = {
    id: string;
    categoryName: string;
    cost: number;
    satuanWaktu: string; // detik, menit, jam, dll
    description: string;
};

// Interface untuk respons API
interface CategoryApiResponse {
    message: string;
    data: Category[];
}

// Komponen untuk setiap baris kategori
const CategoryRow: React.FC<{ category: Category; index: number; onEdit: (category: Category) => void; onDelete: (id: string) => void }> = ({ category, index, onEdit, onDelete }) => {
    return (
        <div className="w-full text-sm text-gray-800 border-b border-gray-100">
            {/* Mobile Layout (< md) */}
            <div className="md:hidden p-3 space-y-2">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{category.categoryName}</div>
                        <div className="text-xs text-gray-600 mt-1">Satuan: {category.satuanWaktu}</div>
                        <div className="text-xs text-gray-600 mt-1">{category.description}</div>
                        <div className="text-sm font-medium text-[#430d4b] mt-1">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(category.cost)}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                        <button 
                            onClick={() => onEdit(category)}
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
                        >
                            <Pencil size={14} />
                        </button>
                        <button 
                            onClick={() => onDelete(category.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tablet & Desktop Layout (>= md) */}
            <div className="hidden md:grid md:grid-cols-9 lg:grid-cols-10 items-center w-full px-4 py-3 gap-2">
                <div className="col-span-1 text-sm">{index + 1}</div>
                <div className="md:col-span-2 lg:col-span-3 truncate text-sm font-medium">{category.categoryName}</div>
                <div className="md:col-span-2 lg:col-span-2 truncate text-sm">{category.satuanWaktu}</div>
                <div className="md:col-span-2 lg:col-span-2 truncate text-sm">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(category.cost)}
                </div>
                <div className="md:col-span-1 lg:col-span-1 truncate text-xs text-gray-600">{category.description}</div>
                <div className="md:col-span-1 lg:col-span-1 flex justify-center">
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => onEdit(category)}
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
                        >
                            <Pencil size={14} />
                        </button>
                        <button 
                            onClick={() => onDelete(category.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Komponen Modal untuk Edit Kategori
const EditCategoryModal: React.FC<{ isOpen: boolean; onClose: () => void; category: Category | null; onCategoryUpdated: () => void }> = ({ isOpen, onClose, category, onCategoryUpdated }) => {
    const [formData, setFormData] = useState({
        categoryName: '',
        satuanWaktu: '',
        cost: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const { accessToken } = useAuth();

    useEffect(() => {
        if (category) {
            setFormData({
                categoryName: category.categoryName,
                satuanWaktu: category.satuanWaktu,
                cost: category.cost.toString(),
                description: category.description
            });
        }
    }, [category]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category) return;
        
        setLoading(true);
        
        try {
            const response = await fetch(`http://34.101.143.2:3000/api/category/update/${category.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    id: category.id,
                    categoryName: formData.categoryName,
                    cost: parseInt(formData.cost),
                    satuanWaktu: formData.satuanWaktu,
                    description: formData.description
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update category');
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Kategori berhasil diperbarui.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            onCategoryUpdated();
            onClose();
        } catch (error) {
            console.error('Error updating category:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Gagal memperbarui kategori. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#430d4b]">Edit Kategori</h2>
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
                            name="categoryName"
                            value={formData.categoryName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Masukkan nama kategori"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Satuan Waktu
                        </label>
                        <input
                            type="text"
                            name="satuanWaktu"
                            value={formData.satuanWaktu}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Contoh: detik, menit, jam"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Harga (IDR)
                        </label>
                        <input
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Masukkan harga"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Deskripsi
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Masukkan deskripsi kategori"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-[#430d4b] text-white rounded-lg hover:bg-[#5a1a63] transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memperbarui...
                                </>
                            ) : (
                                'Perbarui'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Komponen Modal untuk Tambah Kategori
const AddCategoryModal: React.FC<{ isOpen: boolean; onClose: () => void; onCategoryAdded: () => void }> = ({ isOpen, onClose, onCategoryAdded }) => {
    const [formData, setFormData] = useState({
        categoryName: '',
        satuanWaktu: '',
        cost: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const { accessToken } = useAuth();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch('http://34.101.143.2:3000/api/category/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    categoryName: formData.categoryName,
                    cost: parseInt(formData.cost),
                    satuanWaktu: formData.satuanWaktu,
                    description: formData.description
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add category');
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Kategori baru berhasil ditambahkan.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            onCategoryAdded();
            onClose();
            setFormData({ categoryName: '', satuanWaktu: '', cost: '', description: '' });
        } catch (error) {
            console.error('Error adding category:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Gagal menambahkan kategori. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
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
                            name="categoryName"
                            value={formData.categoryName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Masukkan nama kategori"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Satuan Waktu
                        </label>
                        <input
                            type="text"
                            name="satuanWaktu"
                            value={formData.satuanWaktu}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Contoh: detik, menit, jam"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Harga (IDR)
                        </label>
                        <input
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Masukkan harga"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Deskripsi
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Masukkan deskripsi kategori"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-[#430d4b] text-white rounded-lg hover:bg-[#5a1a63] transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan'
                            )}
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
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const { accessToken } = useAuth();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://34.101.143.2:3000/api/category', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const result: CategoryApiResponse = await response.json();
            setCategories(result.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Gagal memuat data kategori.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsEditModalOpen(true);
    };

    const handleDeleteCategory = async (categoryId: string) => {
        const result = await Swal.fire({
            title: 'Konfirmasi Hapus',
            text: 'Apakah Anda yakin ingin menghapus kategori ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://34.101.143.2:3000/api/category/delete/${categoryId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete category');
                }

                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Kategori berhasil dihapus.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                fetchCategories(); // Refresh data
            } catch (error) {
                console.error('Error deleting category:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Gagal menghapus kategori. Silakan coba lagi.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchCategories();
        }
    }, [accessToken]);

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
                    <div className="hidden md:grid md:grid-cols-9 lg:grid-cols-10 w-full px-4 py-3 text-sm font-bold text-[#430d4b] gap-2">
                        <div className="col-span-1">No</div>
                        <div className="md:col-span-2 lg:col-span-3">Nama Kategori</div>
                        <div className="md:col-span-2 lg:col-span-2">Satuan Waktu</div>
                        <div className="md:col-span-2 lg:col-span-2">Harga</div>
                        <div className="md:col-span-1 lg:col-span-1">Deskripsi</div>
                        <div className="md:col-span-1 lg:col-span-1 text-center">Aksi</div>
                    </div>
                </div>

                {/* Body Tabel - Scrollable */}
                <div className="overflow-y-auto max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh]">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#430d4b]"></div>
                            <span className="ml-2 text-gray-600">Memuat data kategori...</span>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="flex justify-center items-center py-8">
                            <span className="text-gray-500">Tidak ada data kategori</span>
                        </div>
                    ) : (
                        /* Merender setiap baris data menggunakan .map() */
                        categories.map((category, index) => (
                            <CategoryRow 
                                key={category.id} 
                                category={category} 
                                index={index}
                                onEdit={handleEditCategory}
                                onDelete={handleDeleteCategory}
                            />
                        ))
                    )}
                </div>

                {/* Footer Tabel dengan Paginasi - Fixed */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-2 sm:gap-4 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600">
                        Showing {categories.length} of {categories.length} entries
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
            <AddCategoryModal 
                isOpen={isModalOpen} 
                onClose={closeModal}
                onCategoryAdded={fetchCategories}
            />

            {/* Modal Edit Kategori */}
            <EditCategoryModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)}
                category={editingCategory}
                onCategoryUpdated={fetchCategories}
            />
        </div>
    );
};

export default KategoriPage;
