import React, { useState, useEffect } from 'react';
// 1. Mengimpor ikon yang relevan dari lucide-react
import { SlidersHorizontal, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

// 2. Definisikan tipe data dari API
type DeviceFromAPI = {
    id: string;
    name: string;
    categoryId: string;
    timerStart: string;
    timerDuration: number;
    timerElapsed: number;
    timerStatus: string;
    lastPausedAt: string;
    isConnected: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
};

// 3. Tipe data untuk kategori
type Category = {
    id: string;
    categoryName: string;
    cost: number;
    satuanWaktu: string;
    description: string;
};

// 4. Tipe data yang akan ditampilkan di tabel
type DeviceOverview = {
    id: string;
    name: string;
    category: string;
    timeRemaining: string;
    rentalPrice: number;
    status: 'Online' | 'Offline' | 'Hampir Selesai';
};

// Interface untuk respons API
interface DeviceApiResponse {
    message: string;
    data: DeviceFromAPI[];
}

interface CategoryApiResponse {
    message: string;
    data: Category[];
}

// Komponen untuk menampilkan status dengan ikon dan warna yang sesuai
const StatusBadge: React.FC<{ status: DeviceOverview['status'] }> = ({ status }) => {
    const statusStyles = {
        Online: {
            icon: <CheckCircle2 size={14} />,
            text: 'Online',
            className: 'bg-green-100 text-green-700',
        },
        Offline: {
            icon: <XCircle size={14} />,
            text: 'Offline',
            className: 'bg-gray-100 text-gray-600',
        },
        'Hampir Selesai': {
            icon: <Clock size={14} />,
            text: 'Hampir Selesai',
            className: 'bg-yellow-100 text-yellow-700',
        },
    };

    const style = statusStyles[status];

    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${style.className}`}>
            {style.icon}
            <span>{style.text}</span>
        </div>
    );
};

// Komponen untuk satu baris data, agar kode utama lebih rapi
const DeviceRow: React.FC<{ device: DeviceOverview; index: number }> = ({ device, index }) => {
    return (
        <div className="w-full text-sm text-gray-800 border-b border-gray-100">
            {/* Mobile Layout (< md) */}
            <div className="md:hidden p-3 space-y-2">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{device.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{device.category}</div>
                        <div className="text-xs text-gray-600 mt-1">Sisa: {device.timeRemaining}</div>
                        <div className="text-sm font-medium text-[#430d4b] mt-1">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(device.rentalPrice)}
                        </div>
                    </div>
                    <div className="ml-2">
                        <StatusBadge status={device.status} />
                    </div>
                </div>
            </div>

            {/* Tablet & Desktop Layout (>= md) */}
            <div className="hidden md:grid md:grid-cols-6 items-center w-full px-4 py-3 gap-2">
                <div className="col-span-1 text-sm">{index + 1}</div>
                <div className="col-span-1 truncate text-sm font-medium">{device.name}</div>
                <div className="col-span-1 truncate text-sm">{device.category}</div>
                <div className="col-span-1 truncate text-sm">{device.timeRemaining}</div>
                <div className="col-span-1 truncate text-sm">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(device.rentalPrice)}
                </div>
                <div className="col-span-1">
                    <StatusBadge status={device.status} />
                </div>
            </div>
        </div>
    );
};

// Komponen utama untuk Halaman Perangkat
export const PerangkatPage = (): JSX.Element => {
    const [devices, setDevices] = useState<DeviceOverview[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const { accessToken } = useAuth();

    // Fungsi untuk mengubah data API menjadi format yang sesuai dengan tabel
    const transformDeviceData = (apiDevices: DeviceFromAPI[], categories: Category[]): DeviceOverview[] => {
        return apiDevices.map(device => {
            // Cari kategori berdasarkan categoryId
            const category = categories.find(cat => cat.id === device.categoryId);
            
            // Hitung sisa waktu berdasarkan timer
            let timeRemaining = 'N/A';
            if (device.timerStatus === 'start' && device.timerDuration > 0) {
                const remainingSeconds = device.timerDuration - device.timerElapsed;
                if (remainingSeconds > 0) {
                    const minutes = Math.floor(remainingSeconds / 60);
                    timeRemaining = `${minutes} menit`;
                }
            }
            
            // Tentukan status berdasarkan isConnected dan timer
            let status: 'Online' | 'Offline' | 'Hampir Selesai' = 'Offline';
            if (device.isConnected) {
                if (device.timerStatus === 'start') {
                    const remainingSeconds = device.timerDuration - device.timerElapsed;
                    if (remainingSeconds <= 900) { // 15 menit = 900 detik
                        status = 'Hampir Selesai';
                    } else {
                        status = 'Online';
                    }
                } else {
                    status = 'Online';
                }
            }
            
            return {
                id: device.id,
                name: device.name,
                category: category?.categoryName || 'Unknown',
                timeRemaining,
                rentalPrice: category?.cost || 0,
                status
            };
        });
    };

    // Fetch devices from API
    const fetchDevices = async () => {
        try {
            const response = await fetch('http://34.101.143.2:3000/api/device', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch devices');
            }

            const result: DeviceApiResponse = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching devices:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Gagal memuat data perangkat.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return [];
        }
    };

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
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
            return result.data || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    };

    // Fetch data saat komponen dimount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [devicesData, categoriesData] = await Promise.all([
                    fetchDevices(),
                    fetchCategories()
                ]);
                
                setCategories(categoriesData);
                const transformedDevices = transformDeviceData(devicesData, categoriesData);
                setDevices(transformedDevices);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            loadData();
        }
    }, [accessToken]);

    return (
        <div className="bg-none p-2 sm:p-4 lg:p-6 xl:p-8 w-full min-h-screen flex flex-col gap-4 sm:gap-6">
            
            {/* Header: Judul dan Tombol Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="font-bold text-[#430d4b] text-xl sm:text-2xl">
                    Perangkat
                </h1>
                <button className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 border border-[#7c347e] text-[#7c347e] rounded-lg text-xs sm:text-sm font-medium hover:bg-[#f5d5e0] transition-colors shadow-sm w-full sm:w-auto justify-center">
                    <SlidersHorizontal size={14} className="sm:w-4 sm:h-4" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Kontainer Tabel Data dengan Fixed Header dan Scrollable Body */}
            <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
                
                {/* Header Tabel - Fixed */}
                <div className="sticky top-0 z-10 bg-[#f5d5e0] border-b border-gray-200">
                    {/* Mobile Header */}
                    <div className="md:hidden px-3 py-3">
                        <div className="font-bold text-[#430d4b] text-sm">Daftar Perangkat</div>
                    </div>
                    
                    {/* Tablet & Desktop Header */}
                    <div className="hidden md:grid md:grid-cols-6 w-full px-4 py-3 text-sm font-bold text-[#430d4b] gap-2">
                        <div className="col-span-1">No</div>
                        <div className="col-span-1">Nama Perangkat</div>
                        <div className="col-span-1">Kategori</div>
                        <div className="col-span-1">Sisa Waktu</div>
                        <div className="col-span-1">Harga Sewa</div>
                        <div className="col-span-1">Status</div>
                    </div>
                </div>

                {/* Body Tabel - Scrollable */}
                <div className="overflow-y-auto max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh]">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#430d4b]"></div>
                            <span className="ml-2 text-gray-600">Memuat data...</span>
                        </div>
                    ) : devices.length === 0 ? (
                        <div className="flex justify-center items-center py-8">
                            <span className="text-gray-500">Tidak ada data perangkat</span>
                        </div>
                    ) : (
                        /* Merender setiap baris data menggunakan .map() */
                        devices.map((device, index) => (
                            <DeviceRow key={device.id} device={device} index={index} />
                        ))
                    )}
                </div>

                {/* Footer Tabel dengan Paginasi - Fixed */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-2 sm:gap-4 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600">
                        Showing {devices.length} of {devices.length} entries
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-xs sm:text-sm text-gray-600">Page</span>
                        <div className="inline-flex items-center gap-2 sm:gap-3 p-2 rounded-lg border border-solid border-gray-300 cursor-pointer hover:bg-gray-50">
                            <span className="text-xs sm:text-sm text-gray-800 font-medium">1</span>
                            <SlidersHorizontal size={14} className="sm:w-4 sm:h-4 text-gray-600 rotate-90"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerangkatPage;