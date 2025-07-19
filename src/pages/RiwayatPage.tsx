import React, { useState, useEffect } from 'react';
// 1. Mengimpor ikon yang relevan dari lucide-react
import { Wallet, Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

// 2. Definisikan tipe data dari API
type TransactionFromAPI = {
    id: string;
    deviceId: string;
    start: string;
    end: string | null;
    duration: number;
    cost: number;
    createdAt: string;
    updatedAt: string;
    Device: {
        id: string;
        name: string;
        categoryId: string;
        Category: {
            id: string;
            categoryName: string;
            cost: number;
            satuanWaktu: string;
            description: string;
        };
    };
};

// 3. Tipe data untuk device
type Device = {
    id: string;
    name: string;
    categoryId: string;
};

// 4. Tipe data untuk kategori
type Category = {
    id: string;
    categoryName: string;
    cost: number;
    satuanWaktu: string;
    description: string;
};

// 5. Tipe data yang akan ditampilkan di tabel
type IncomeHistory = {
    id: string;
    deviceName: string;
    category: string;
    rentalTime: string;
    price: number;
};

// Interface untuk respons API
interface TransactionApiResponse {
    message: string;
    data: {
        transactions: TransactionFromAPI[];
        pagination?: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
        };
    };
}

interface DeviceApiResponse {
    message: string;
    data: Device[];
}

interface CategoryApiResponse {
    message: string;
    data: Category[];
}

// Komponen untuk satu baris data, agar kode utama lebih rapi
const IncomeRow: React.FC<{ record: IncomeHistory; index: number }> = ({ record, index }) => {
    return (
        <div className="w-full text-sm text-gray-800 border-b border-gray-100">
            {/* Mobile Layout (< md) */}
            <div className="md:hidden p-3 space-y-2">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{record.deviceName}</div>
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
                <div className="col-span-1 text-sm">{index + 1}</div>
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
    const [transactions, setTransactions] = useState<IncomeHistory[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalIncome, setTotalIncome] = useState(0);
    const { accessToken } = useAuth();

    // Fungsi untuk mengubah data API menjadi format yang sesuai dengan tabel
    const transformTransactionData = (apiTransactions: TransactionFromAPI[]): IncomeHistory[] => {
        return apiTransactions.map(transaction => {
            // Ambil data device dan category dari respons API
            const device = transaction.Device;
            const category = device?.Category;
            
            // Format waktu rental
            let rentalTime = '';
            if (transaction.start && transaction.end) {
                // Jika ada start dan end time
                rentalTime = `${transaction.start} - ${transaction.end}`;
            } else if (transaction.start) {
                // Jika hanya ada start time
                rentalTime = `${transaction.start} - Ongoing`;
            } else {
                rentalTime = 'N/A';
            }
            
            return {
                id: transaction.id,
                deviceName: device?.name || 'Unknown Device',
                category: category?.categoryName || 'Unknown Category',
                rentalTime,
                price: transaction.cost
            };
        });
    };

    // Fetch transactions from API
    const fetchTransactions = async (page: number = 1, start_date?: string, end_date?: string) => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });
            
            if (start_date) params.append('start_date', start_date);
            if (end_date) params.append('end_date', end_date);

            const url = `http://34.101.143.2:3000/api/transaction?${params}`;
            console.log('Fetching transactions from URL:', url);
            console.log('Access Token:', accessToken);
            console.log('Start Date:', start_date);
            console.log('End Date:', end_date);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response:', errorText);
                throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
            }

            const result: TransactionApiResponse = await response.json();
            console.log('Transaction API Response:', result);
            return result;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Gagal memuat data transaksi.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return null;
        }
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

    // Load data function
    const loadData = async (page: number = 1, start_date?: string, end_date?: string) => {
        setLoading(true);
        try {
            const transactionResult = await fetchTransactions(page, start_date, end_date);
            
            if (transactionResult && transactionResult.data.transactions) {
                const transformedTransactions = transformTransactionData(transactionResult.data.transactions);
                setTransactions(transformedTransactions);
                
                // Set pagination info (gunakan default jika tidak ada)
                const pagination = transactionResult.data.pagination;
                setCurrentPage(pagination?.currentPage || page);
                setTotalPages(pagination?.totalPages || 1);
                setTotalItems(pagination?.totalItems || transformedTransactions.length);
                
                // Hitung total income
                const total = transformedTransactions.reduce((sum, record) => sum + record.price, 0);
                setTotalIncome(total);
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            loadData(page, startDate, endDate);
        }
    };

    // Handle date filter
    const handleDateFilter = () => {
        setCurrentPage(1);
        loadData(1, startDate, endDate);
    };

    // Fetch data saat komponen dimount tanpa filter tanggal
    useEffect(() => {
        if (accessToken) {
            loadData(1); // Load semua data tanpa filter tanggal
        }
    }, [accessToken]);

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
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                                />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                                />
                            </div>
                            <button 
                                onClick={handleDateFilter}
                                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#430d4b] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#5a1a5e] transition-colors justify-center"
                            >
                                <Calendar size={16} />
                                <span>Filter</span>
                            </button>
                        </div>
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
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-gray-500">Memuat data...</div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-gray-500">Tidak ada data transaksi</div>
                        </div>
                    ) : (
                        transactions.map((record, index) => (
                            <IncomeRow key={record.id} record={record} index={index} />
                        ))
                    )}
                </div>

                {/* Footer Tabel dengan Paginasi - Fixed */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600">
                        Showing {transactions.length} of {totalItems} entries
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs sm:text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiwayatPage;
