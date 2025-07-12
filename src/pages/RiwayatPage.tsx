import React from 'react';
// 1. Mengimpor ikon yang relevan dari lucide-react
import { Wallet, Calendar, ChevronDown } from 'lucide-react';

// 2. Definisikan tipe data yang jelas untuk setiap riwayat pemasukan
type IncomeHistory = {
    id: number;
    deviceName: string;
    category: string;
    rentalTime: string; // contoh: '10:00 - 12:00'
    price: number;
};

// 3. Simulasikan data riwayat yang akan datang dari API
const incomeHistoryData: IncomeHistory[] = [
    { id: 1, deviceName: 'Perangkat 1', category: 'PC Gaming', rentalTime: '10:00 - 12:00', price: 130000 },
    { id: 2, deviceName: 'Perangkat 3', category: 'Console PS5', rentalTime: '10:15 - 11:15', price: 70000 },
    { id: 3, deviceName: 'Perangkat 2', category: 'PC Gaming', rentalTime: '11:00 - 13:00', price: 130000 },
    { id: 4, deviceName: 'Perangkat 5', category: 'PC Office', rentalTime: '12:30 - 14:30', price: 80000 },
    { id: 5, deviceName: 'Perangkat 4', category: 'PC Gaming', rentalTime: '13:00 - 14:00', price: 65000 },
    { id: 6, deviceName: 'Perangkat 6', category: 'Console Xbox', rentalTime: '14:00 - 15:30', price: 95000 },
    { id: 7, deviceName: 'Perangkat 7', category: 'PC Gaming', rentalTime: '15:00 - 17:00', price: 130000 },
    { id: 8, deviceName: 'Perangkat 8', category: 'PC Office', rentalTime: '16:30 - 18:00', price: 60000 },
];

// Menghitung total pemasukan dari data
const totalIncome = incomeHistoryData.reduce((sum, record) => sum + record.price, 0);

// Komponen untuk satu baris data, agar kode utama lebih rapi
const IncomeRow: React.FC<{ record: IncomeHistory }> = ({ record }) => {
    return (
        <div className="w-full text-sm text-gray-800 border-b border-gray-100">
            {/* Mobile Layout (< md) */}
            <div className="md:hidden p-3 space-y-2">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">#{record.id} - {record.deviceName}</div>
                        <div className="text-xs text-gray-600 mt-1">{record.category}</div>
                        <div className="text-xs text-gray-600 mt-1">Waktu: {record.rentalTime}</div>
                        <div className="text-sm font-medium text-[#430d4b] mt-1">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(record.price)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tablet & Desktop Layout (>= md) */}
            <div className="hidden md:grid md:grid-cols-5 items-center w-full px-4 py-3 gap-2">
                <div className="col-span-1 text-sm">{record.id}</div>
                <div className="col-span-1 truncate text-sm font-medium">{record.deviceName}</div>
                <div className="col-span-1 truncate text-sm">{record.category}</div>
                <div className="col-span-1 truncate text-sm">{record.rentalTime}</div>
                <div className="col-span-1 truncate text-sm font-medium text-[#430d4b]">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(record.price)}
                </div>
            </div>
        </div>
    );
};

// Komponen utama untuk Halaman Riwayat Pemasukan
const RiwayatPage = (): JSX.Element => {
    return (
        <div className="bg-none p-2 sm:p-4 lg:p-6 xl:p-8 w-full min-h-screen flex flex-col gap-4 sm:gap-6">
            
            {/* Header Konten: Judul */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="font-bold text-[#430d4b] text-xl sm:text-2xl">
                    Riwayat Pemasukan
                </h1>
            </div>

            {/* Kontainer Tabel Data dengan Fixed Header dan Scrollable Body */}
            <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
                
                {/* Header Tabel dengan Total Pemasukan dan Filter */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                        <div className="inline-flex items-center gap-2">
                            <Wallet size={20} className="text-[#430d4b]"/>
                            <span className="font-bold text-lg text-[#430d4b]">
                                Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalIncome)}
                            </span>
                        </div>
                        <button className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
                            <Calendar size={16} />
                            <span>Hari Ini</span>
                            <ChevronDown size={16} />
                        </button>
                    </div>
                    
                    {/* Mobile Header */}
                    <div className="md:hidden px-3 py-3 bg-[#f5d5e0]">
                        <div className="font-bold text-[#430d4b] text-sm">Daftar Riwayat Pemasukan</div>
                    </div>
                    
                    {/* Tablet & Desktop Header */}
                    <div className="hidden md:grid md:grid-cols-5 w-full px-4 py-3 bg-[#f5d5e0] text-sm font-bold text-[#430d4b] gap-2">
                        <div className="col-span-1">No</div>
                        <div className="col-span-1">Perangkat</div>
                        <div className="col-span-1">Kategori</div>
                        <div className="col-span-1">Waktu</div>
                        <div className="col-span-1">Harga Sewa</div>
                    </div>
                </div>

                {/* Body Tabel - Scrollable */}
                <div className="overflow-y-auto max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh]">
                    {/* Merender setiap baris data menggunakan .map() */}
                    {incomeHistoryData.map(record => (
                        <IncomeRow key={record.id} record={record} />
                    ))}
                </div>

                {/* Footer Tabel dengan Paginasi - Fixed */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-2 sm:gap-4 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600">
                        Showing {incomeHistoryData.length} of {incomeHistoryData.length} entries
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
        </div>
    );
};

export default RiwayatPage;
