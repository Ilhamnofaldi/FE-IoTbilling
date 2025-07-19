/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
// 1. Mengimpor ikon yang relevan dari lucide-react
import { UserPlus, UserX, Trash2, CheckCircle2, XCircle, Ban, ChevronDown, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

// 2. Definisikan tipe data yang jelas untuk User berdasarkan API response
type User = {
    id: string;
    email: string;
    type: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

// Komponen untuk menampilkan status dengan ikon dan warna yang sesuai
const StatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const statusStyles = {
        active: {
            icon: <CheckCircle2 size={14} />,
            text: 'Active',
            className: 'bg-green-100 text-green-700',
        },
        blocked: {
            icon: <Ban size={14} />,
            text: 'Blocked',
            className: 'bg-red-100 text-red-700',
        },
    };

    const style = isActive ? statusStyles.active : statusStyles.blocked;

    return (
        <div className={`inline-flex items-center justify-center w-20 sm:w-24 gap-1.5 px-2 py-1.5 rounded-full text-xs font-medium ${style.className}`}>
            {style.icon}
            <span className="hidden sm:inline">{style.text}</span>
        </div>
    );
};

// Komponen untuk satu baris data user
const UserRow: React.FC<{ user: User; index: number; onBlockUser: (userId: string, isActive: boolean) => void }> = ({ user, index, onBlockUser }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="w-full text-sm text-gray-800 border-b border-gray-100">
            {/* Mobile Layout (< md) */}
            <div className="md:hidden p-3 space-y-2">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{user.email}</div>
                        <div className="text-xs text-gray-600 mt-1">Type: {user.type}</div>
                        <div className="text-xs text-gray-600">Created: {formatDate(user.createdAt)}</div>
                        <div className="mt-2">
                            <StatusBadge isActive={user.isActive} />
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <button 
                        onClick={() => onBlockUser(user.id, user.isActive)}
                        className={`flex-1 flex items-center justify-center gap-1 h-8 border rounded-lg transition-colors text-xs ${
                            user.isActive 
                                ? 'border-red-600 text-red-700 hover:bg-red-50' 
                                : 'border-green-600 text-green-700 hover:bg-green-50'
                        }`}
                    >
                        {user.isActive ? <Ban size={12} /> : <CheckCircle2 size={12} />}
                        <span>{user.isActive ? 'Block' : 'Unblock'}</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 h-8 bg-[#c11747] text-white hover:bg-red-700 rounded-lg transition-colors text-xs">
                        <Trash2 size={12} />
                        <span>Hapus</span>
                    </button>
                </div>
            </div>

            {/* Tablet & Desktop Layout (>= md) */}
            <div className="hidden md:grid md:grid-cols-12 items-center w-full px-4 py-3 gap-2">
                <div className="col-span-1 text-sm">{index + 1}</div>
                <div className="col-span-3 truncate text-sm" title={user.email}>{user.email}</div>
                <div className="col-span-2 truncate text-sm">{user.type}</div>
                <div className="col-span-2 text-xs text-gray-600">{formatDate(user.createdAt)}</div>
                <div className="col-span-2 flex justify-start">
                    <StatusBadge isActive={user.isActive} />
                </div>
                <div className="col-span-2 flex justify-center items-center gap-2">
                    <button 
                        onClick={() => onBlockUser(user.id, user.isActive)}
                        className={`flex items-center justify-center gap-1 w-20 h-8 border rounded-lg transition-colors text-xs ${
                            user.isActive 
                                ? 'border-red-600 text-red-700 hover:bg-red-50' 
                                : 'border-green-600 text-green-700 hover:bg-green-50'
                        }`}
                    >
                        {user.isActive ? <Ban size={12} /> : <CheckCircle2 size={12} />}
                        <span>{user.isActive ? 'Block' : 'Unblock'}</span>
                    </button>
                    <button className="flex items-center justify-center gap-1 w-20 h-8 bg-[#c11747] text-white hover:bg-red-700 rounded-lg transition-colors text-xs">
                        <Trash2 size={12} />
                        <span>Hapus</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Komponen Modal untuk Tambah User
const AddUserModal: React.FC<{ isOpen: boolean; onClose: () => void; onUserAdded: () => void }> = ({ isOpen, onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        type: 'user'
    });
    const [loading, setLoading] = useState(false);
    const { accessToken } = useAuth();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            const response = await fetch('http://34.101.143.2:3000/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            const result = await response.json();
            
            Swal.fire({
                title: 'Berhasil!',
                text: 'User baru berhasil ditambahkan.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            onUserAdded();
            onClose();
            setFormData({ email: '', password: '', type: 'user' });
        } catch (error) {
            console.error('Error adding user:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Gagal menambahkan user. Silakan coba lagi.',
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
                    <h2 className="text-xl font-bold text-[#430d4b]">Tambah User Baru</h2>
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
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Masukkan email user"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            placeholder="Masukkan password"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipe User
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#430d4b] focus:border-transparent"
                            required
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-[#430d4b] text-white rounded-lg hover:bg-[#5a1a63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Komponen utama untuk Halaman Kelola User
const UserPage = (): React.ReactElement => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { accessToken } = useAuth();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://34.101.143.2:3000/api/user', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const result = await response.json();
            setUsers(result.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Gagal memuat data user.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    // Helper function for fetch with timeout and retry
    const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 10000) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Request timeout - Server tidak merespons dalam waktu yang ditentukan');
            }
            throw error;
        }
    };

    const fetchWithRetry = async (url: string, options: RequestInit, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetchWithTimeout(url, options, 15000);
                return response;
            } catch (error) {
                if (i === retries - 1) {
                    throw error;
                }
                
                // Wait before retry (exponential backoff)
                const delay = Math.min(1000 * Math.pow(2, i), 5000);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };

    // Block/Unblock user
    const handleBlockUser = async (userId: string, isCurrentlyActive: boolean) => {
        try {
            // Validate userId
            if (!userId || typeof userId !== 'string') {
                throw new Error('Invalid user ID');
            }
            
            const action = isCurrentlyActive ? 'block' : 'unblock';
            const result = await Swal.fire({
                title: 'Konfirmasi',
                text: `Apakah Anda yakin ingin ${action} user ini?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: isCurrentlyActive ? '#d33' : '#3085d6',
                cancelButtonColor: '#6b7280',
                confirmButtonText: `Ya, ${action}`,
                cancelButtonText: 'Batal'
            });

            if (result.isConfirmed) {
                // Show loading
                Swal.fire({
                    title: 'Memproses...',
                    text: 'Sedang mengubah status user',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const url = `http://34.101.143.2:3000/api/user/${userId}/block`;
                const requestOptions = {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                };
                
                const response = await fetchWithRetry(url, requestOptions);

                if (!response.ok) {
                    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch (parseError) {
                        console.error('Error parsing error response:', parseError);
                    }
                    throw new Error(errorMessage);
                }

                const responseData = await response.json();
                
                // Update local state using the response data
                if (responseData.data && typeof responseData.data.isActive === 'boolean') {
                    setUsers(prevUsers => 
                        prevUsers.map(user => 
                            user.id === userId 
                                ? { ...user, isActive: responseData.data.isActive }
                                : user
                        )
                    );
                } else {
                    // Fallback: toggle the current state
                    const newStatus = !isCurrentlyActive;
                    setUsers(prevUsers => 
                        prevUsers.map(user => 
                            user.id === userId 
                                ? { ...user, isActive: newStatus }
                                : user
                        )
                    );
                }

                Swal.fire({
                    title: 'Berhasil!',
                    text: responseData.message || `User berhasil di${action}.`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error blocking/unblocking user:', error);
            
            let errorMessage = 'Gagal mengubah status user.';
            if (error instanceof Error) {
                if (error.message.includes('timeout') || error.message.includes('AbortError')) {
                    errorMessage = 'Request timeout - Server tidak merespons. Coba lagi nanti.';
                } else if (error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                    errorMessage = 'Koneksi ke server gagal. Periksa koneksi internet Anda dan coba lagi.';
                } else if (error.message.includes('CORS')) {
                    errorMessage = 'Masalah CORS - Hubungi administrator sistem.';
                } else {
                    errorMessage = error.message;
                }
            }
            
            Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleUserAdded = () => {
        fetchUsers(); // Refresh user list after adding new user
    };

    // Fetch users on component mount
    useEffect(() => {
        if (accessToken) {
            console.log('Access Token:', accessToken);
            fetchUsers();
        }
    }, [accessToken]);

    return (
        <div className="bg-none p-2 sm:p-4 lg:p-6 xl:p-8 w-full min-h-screen flex flex-col gap-4 sm:gap-6">
            
            {/* Header Konten */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="font-bold text-[#430d4b] text-xl sm:text-2xl">
                    Kelola User
                </h1>
                <button 
                    onClick={openModal}
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#430d4b] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#5a1a63] transition-colors shadow-sm w-full sm:w-auto justify-center"
                >
                    <UserPlus size={14} className="sm:w-4 sm:h-4" />
                    <span>Tambah User</span>
                </button>
            </div>

            {/* Kontainer Tabel Data dengan Fixed Header dan Scrollable Body */}
            <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
                
                {/* Header Tabel - Fixed */}
                <div className="sticky top-0 z-10 bg-[#f5d5e0] border-b border-gray-200">
                    {/* Mobile Header */}
                    <div className="md:hidden px-3 py-3">
                        <div className="font-bold text-[#430d4b] text-sm">Daftar User</div>
                    </div>
                    
                    {/* Tablet & Desktop Header */}
                    <div className="hidden md:grid md:grid-cols-12 w-full px-4 py-3 text-sm font-bold text-[#430d4b] gap-2">
                        <div className="col-span-1">No</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-2">Created</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-center">Aksi</div>
                    </div>
                </div>

                {/* Body Tabel - Scrollable */}
                <div className="overflow-y-auto max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh]">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="w-8 h-8 border-2 border-[#430d4b] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Tidak ada data user
                        </div>
                    ) : (
                        users.map((user, index) => (
                            <UserRow key={user.id} user={user} index={index} onBlockUser={handleBlockUser} />
                        ))
                    )}
                </div>

                {/* Footer Tabel dengan Paginasi - Fixed */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-2 sm:gap-4 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600">
                        Showing {users.length} of {users.length} entries
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

            {/* Modal Tambah User */}
            <AddUserModal isOpen={isModalOpen} onClose={closeModal} onUserAdded={handleUserAdded} />
        </div>
    );
};

export default UserPage;
