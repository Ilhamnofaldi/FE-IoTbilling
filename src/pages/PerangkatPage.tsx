import React from 'react';
// 1. Mengimpor ikon yang relevan dari lucide-react
import { SlidersHorizontal, CheckCircle2, XCircle, Clock } from 'lucide-react';

// 2. Definisikan tipe data yang jelas untuk setiap perangkat
type DeviceOverview = {
    id: number;
    name: string;
    category: string;
    timeRemaining: string;
    rentalPrice: number;
    status: 'Online' | 'Offline' | 'Hampir Selesai';
};

// 3. Simulasikan data yang akan datang dari API dalam sebuah array
const deviceOverviewData: DeviceOverview[] = [
    { id: 1, name: 'Perangkat 1', category: 'PC Gaming', timeRemaining: '50 menit', rentalPrice: 65000, status: 'Online' },
    { id: 2, name: 'Perangkat 2', category: 'Console PS5', timeRemaining: '15 menit', rentalPrice: 70000, status: 'Hampir Selesai' },
    { id: 3, name: 'Perangkat 3', category: 'PC Office', timeRemaining: 'N/A', rentalPrice: 40000, status: 'Offline' },
    { id: 4, name: 'Perangkat 4', category: 'PC Gaming', timeRemaining: '120 menit', rentalPrice: 80000, status: 'Online' },
    { id: 5, name: 'Perangkat 5', category: 'PC Gaming', timeRemaining: '5 menit', rentalPrice: 65000, status: 'Hampir Selesai' },
];

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
const DeviceRow: React.FC<{ device: DeviceOverview }> = ({ device }) => {
    return (
        <div className="w-full text-sm text-gray-800 border-b border-gray-100">
            {/* Mobile Layout (< md) */}
            <div className="md:hidden p-3 space-y-2">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">#{device.id} - {device.name}</div>
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
                <div className="col-span-1 text-sm">{device.id}</div>
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
                    {/* Merender setiap baris data menggunakan .map() */}
                    {deviceOverviewData.map(device => (
                        <DeviceRow key={device.id} device={device} />
                    ))}
                </div>

                {/* Footer Tabel dengan Paginasi - Fixed */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-2 sm:gap-4 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600">
                        Showing {deviceOverviewData.length} of {deviceOverviewData.length} entries
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