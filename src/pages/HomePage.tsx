import React, { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

// Definisikan path aset. Pastikan file-file ini ada di folder /public proyek Anda.
const profilImage = "/profil.png";
const groupIcon = "/GroupIcon.svg";
const dropdownIcon = "/DropdownIcon.svg";
const deviceListIcon = "/DeviceListIcon.svg";
const pageDropdownIcon = "/PageDropdownIcon.svg";
const userListIcon = "/user-icon.svg";
const userPageDropdownIcon = "/UserPageDropdownIcon.svg";

// Interface untuk tipe data dashboard
interface DashboardData {
    admin_profile: {
        name: string;
        email: string;
        status: string;
        profile_picture: string | null;
    };
    device_status: {
        running: {
            text: string;
            value: string;
        };
        ready: {
            text: string;
            value: string;
        };
        almost_finished: {
            text: string;
            value: string;
        };
    };
    running_devices_list: {
        title: string;
        devices: Array<{
            no: number;
            nama_perangkat: string;
            kategori: string;
            sisa_waktu: string;
        }>;
        total_count: number;
    };
    total_income: {
        title: string;
        timeframe: string;
        total: number;
        chart_data: Array<{
            day: string;
            income: number;
        }>;
        available_filters: Array<{
            value: string;
            label: string;
        }>;
    };
    registered_users: {
        title: string;
        users: Array<{
            no: number;
            email: string;
            nama: string;
            status: string;
        }>;
        total_count: number;
    };
}

// --- Komponen untuk Total Pemasukan ---
interface TotalPemasukanChartProps {
    incomeData?: DashboardData['total_income'];
    onFilterChange: (filter: string) => void;
    selectedFilter: string;
}

const TotalPemasukanChart: React.FC<TotalPemasukanChartProps> = ({ incomeData, onFilterChange, selectedFilter }) => {
    const [hoveredBar, setHoveredBar] = useState<string | null>(null);

    const maxIncome = incomeData?.chart_data && incomeData.chart_data.length > 0 
        ? Math.max(...incomeData.chart_data.map(d => d.income)) 
        : 1000000;

    // Fungsi untuk mengkonversi data income ke format chart
    const getChartData = () => {
        if (!incomeData?.chart_data) {
            // Data dummy jika API belum tersedia
            return [
                { day: "Sen", height: "h-[50px]", isHighlighted: false, income: 150000 },
                { day: "Sel", height: "h-[32px]", isHighlighted: false, income: 100000 },
                { day: "Rab", height: "h-[71px]", isHighlighted: false, income: 220000 },
                { day: "Kam", height: "h-[59px]", isHighlighted: false, income: 180000 },
                { day: "Jum", height: "h-[86px]", isHighlighted: true, income: 300000 },
                { day: "Sab", height: "h-[3px]", isHighlighted: false, income: 50000 },
                { day: "Min", height: "h-[3px]", isHighlighted: false, income: 30000 },
            ];
        }


        const dayMapping: { [key: string]: string } = {
            'Senin': 'Sen',
            'Selasa': 'Sel', 
            'Rabu': 'Rab',
            'Kamis': 'Kam',
            'Jumat': 'Jum',
            'Sabtu': 'Sab',
            'Minggu': 'Min',
            'Minggu 1': 'M1',
            'Minggu 2': 'M2',
            'Minggu 3': 'M3',
            'Minggu 4': 'M4',
            'Minggu 5': 'M5'
        };

        return incomeData.chart_data.map((data) => {
            const heightPercentage = maxIncome > 0 ? (data.income / maxIncome) * 100 : 0;
            const height = Math.max(heightPercentage * 0.86, 3); // Min 3px height
            const intensityPercentage = maxIncome > 0 ? (data.income / maxIncome) : 0;
            const opacity = Math.max(0.3, intensityPercentage); // Min opacity 0.3
            
            return {
                day: dayMapping[data.day] || data.day,
                height: `${height}px`,
                opacity: opacity,
                income: data.income
            };
        });
    };

    const chartData = getChartData();
    
    // Format total income
    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `${(amount / 1000).toFixed(0)}K`;
        }
        return amount.toString();
    };

    const totalIncome = incomeData?.total || 1280000;

    return (
        <div className="w-full flex flex-col items-start gap-4 p-4 bg-white rounded-lg">
            <div className="flex items-center justify-between w-full">
                <div className="inline-flex items-center gap-4">
                    <img className="relative w-5 h-5" alt="Group Icon" src={groupIcon} />
                    <div className="font-bold text-[#7c347e] text-sm">{incomeData?.title || 'Total Pemasukan'}</div>
                </div>
                                <div className="relative inline-block text-left">
                    <select 
                        onChange={(e) => onFilterChange(e.target.value)} 
                        value={selectedFilter}
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    >
                        {(incomeData?.available_filters || [{ value: 'week', label: 'Minggu Ini' }]).map(filter => (
                            <option key={filter.value} value={filter.value}>{filter.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="text-lg font-bold text-[#430d4b]">
                Rp {totalIncome.toLocaleString('id-ID')}
            </div>
            <div className="flex w-full">
                                <div className="flex flex-col justify-between text-sm text-gray-700 text-right pr-2 w-auto flex-shrink-0">
                    <span>{formatCurrency(maxIncome)}</span>
                    <span>{formatCurrency(maxIncome / 2)}</span>
                    <span>{formatCurrency(maxIncome / 10)}</span>
                    <span>0 K</span>
                </div>
                <div className="flex-1 relative flex flex-col">
                    <div className="absolute top-2.5 left-0 w-full h-[85%] flex flex-col justify-between">
                        <div className="w-full h-px bg-gray-200"></div>
                        <div className="w-full h-px bg-gray-200"></div>
                        <div className="w-full h-px bg-gray-200"></div>
                        <div className="w-full h-px bg-gray-200"></div>
                    </div>
                    <div className="relative flex-1 h-[120px] flex justify-around items-end pt-2">
                        {chartData.map((data) => (
                            <div key={data.day} className="flex flex-col items-center gap-1 w-9">
                                                                <div 
                                    className="relative w-[13px] rounded-full transition-all duration-300 ease-in-out transform hover:scale-110"
                                    style={{ height: data.height, backgroundColor: `rgba(243, 174, 0, ${data.opacity})` }}
                                    onMouseEnter={() => setHoveredBar(data.day)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                >
                                    {hoveredBar === data.day && (
                                        <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10">
                                            Rp {data.income.toLocaleString('id-ID')}
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm text-gray-700">{data.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Komponen untuk Daftar Perangkat Berjalan ---
interface RunningDeviceListProps {
    runningDevicesList?: DashboardData['running_devices_list'];
}

const RunningDeviceList: React.FC<RunningDeviceListProps> = ({ runningDevicesList }) => {
    // Data dummy untuk device list jika API tidak tersedia
    const defaultDeviceListData = [
        { no: 1, nama_perangkat: 'Device 1', kategori: 'Kategori 1', sisa_waktu: '90 menit' },
        { no: 2, nama_perangkat: 'Device 2', kategori: 'Kategori A', sisa_waktu: '45 menit' },
        { no: 3, nama_perangkat: 'Device 3', kategori: 'Kategori B', sisa_waktu: '120 menit' },
        { no: 4, nama_perangkat: 'Device 4', kategori: 'Kategori C', sisa_waktu: '30 menit' },
        { no: 5, nama_perangkat: 'Device 5', kategori: 'Kategori D', sisa_waktu: '75 menit' },
        { no: 6, nama_perangkat: 'Device 6', kategori: 'Kategori E', sisa_waktu: '60 menit' },
        { no: 7, nama_perangkat: 'Device 7', kategori: 'Kategori F', sisa_waktu: '90 menit' },
        { no: 8, nama_perangkat: 'Device 8', kategori: 'Kategori G', sisa_waktu: '45 menit' },
        { no: 9, nama_perangkat: 'Device 9', kategori: 'Kategori H', sisa_waktu: '105 menit' },
        { no: 10, nama_perangkat: 'Device 10', kategori: 'Kategori I', sisa_waktu: '80 menit' },
        { no: 11, nama_perangkat: 'Device 11', kategori: 'Kategori I', sisa_waktu: '80 menit' },
        { no: 12, nama_perangkat: 'Device 12', kategori: 'Kategori I', sisa_waktu: '80 menit' },
    ];
    
    // Gunakan data dari API jika tersedia, jika tidak gunakan data dummy
    const deviceListData = runningDevicesList?.devices || defaultDeviceListData;
    const runningDevicesText = runningDevicesList?.title || 'Daftar Perangkat Sedang Berjalan';
    const totalCount = runningDevicesList?.total_count || deviceListData.length;
    return (
        // Container luar tetap memiliki tinggi tetap
        <div className="flex flex-col flex-1 gap-4 p-4 bg-white rounded-lg h-[672px] min-w-0">
            <div className="flex items-center justify-between w-full">
                <div className="inline-flex items-center gap-2">
                    <img className="w-4 h-4" alt="Device List Icon" src={deviceListIcon} />
                    <div className="font-bold text-[#7c347e] text-sm">{runningDevicesText}</div>
                    <div className="text-sm text-gray-600">({totalCount} total)</div>
                </div>
                <div className="inline-flex items-center gap-3">
                    <span className="text-sm text-gray-500">Page</span>
                    <div className="inline-flex items-center gap-2 p-2 border border-solid border-gray-300 rounded-lg">
                        <span className="text-sm text-gray-500">1</span>
                        <img className="w-3 h-2" alt="Dropdown" src={pageDropdownIcon} />
                    </div>
                </div>
            </div>
            {/* Wrapper ini akan menangani scroll jika item terlalu banyak */}
            <div className="flex flex-col flex-1 gap-2 w-full overflow-hidden">
                {/* PERBAIKAN: Jarak antar kolom (gap) & lebar kolom disesuaikan */}
                <div className="flex items-center gap-3 p-4 bg-[#f5d5e0] rounded-lg w-full text-sm font-bold text-[#430d4b]">
                    <div className="w-[30px] flex-shrink-0">No</div>
                    <div className="flex-1">Nama</div>
                    <div className="flex-1">Kategori</div>
                    <div className="w-[85px] flex-shrink-0 text-right">Sisa Waktu</div>
                </div>
                {/* Area daftar item sekarang akan otomatis mengisi sisa tinggi */}
                <div className="overflow-y-auto">
                    {deviceListData.map((device, index) => (
                        <div key={device.no} className="w-full">
                            {/* PERBAIKAN: Jarak antar kolom (gap) & lebar kolom disesuaikan */}
                            <div className="flex items-center gap-3 p-4 w-full text-sm text-gray-800">
                                <div className="w-[30px] flex-shrink-0">{device.no}</div>
                                <div className="flex-1 truncate">{device.nama_perangkat}</div>
                                <div className="flex-1 truncate">{device.kategori}</div>
                                <div className="w-[85px] flex-shrink-0 text-right">{device.sisa_waktu}</div>
                            </div>
                            {index < deviceListData.length - 1 && <div className="w-full h-px bg-gray-200"></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Komponen untuk Daftar User Terdaftar ---
interface RegisteredUserListProps {
    usersData?: DashboardData['registered_users'];
}

const RegisteredUserList: React.FC<RegisteredUserListProps> = ({ usersData }) => {
    const defaultUsersData = [
        { no: 1, email: "nattasharomanov@gmail.com", nama: "Black Widow", status: "Online" },
        { no: 2, email: "steve.rogers@shield.com", nama: "Captain America", status: "Offline" },
        { no: 3, email: "tony.stark@stark.com", nama: "Iron Man", status: "Online" },
        { no: 4, email: "bruce.banner@avengers.com", nama: "Hulk", status: "Offline" },
        { no: 5, email: "thor.odinson@asgard.com", nama: "Thor", status: "Online" },
    ];
    
    const registeredUsersData = usersData?.users || defaultUsersData;
    
    const totalCount = usersData?.total_count || registeredUsersData.length;
    const title = usersData?.title || 'User yang Terdaftar';

    return (
        <div className="flex flex-col flex-1 gap-2 p-4 bg-white rounded-lg h-auto min-w-0">
            <div className="flex items-center justify-between w-full mb-4">
                <div className="inline-flex items-center gap-4">
                    <img className="w-4 h-4" alt="User List Icon" src={userListIcon} />
                    <div className="font-bold text-[#7c347e] text-sm">{title}</div>
                    <div className="text-sm text-gray-600">({totalCount} total)</div>
                </div>
                <div className="inline-flex items-center gap-3">
                    <span className="text-sm text-gray-500">Page</span>
                    <div className="inline-flex items-center gap-2 p-2 border border-solid border-gray-300 rounded-lg">
                        <span className="text-sm text-gray-500">1</span>
                        <img className="w-3 h-2" alt="Dropdown" src={userPageDropdownIcon} />
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col flex-1 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[500px] xl:min-w-full">
                        <div className="flex items-center p-3 bg-[#f5d5e0] rounded-lg w-full text-xs font-bold text-[#430d4b]">
                            <div className="w-8 flex-shrink-0">No</div>
                            <div className="flex-1 px-2">Email</div>
                            <div className="w-40 px-2">Nama</div>
                            <div className="w-24 text-center flex-shrink-0">Status</div>
                        </div>
                        <div className="flex flex-col">
                            {registeredUsersData.map((user, index) => (
                                <div key={user.no} className="w-full">
                                    <div className="flex items-center p-3 w-full text-xs text-gray-800">
                                        <div className="w-8 flex-shrink-0">{user.no}</div>
                                        <div className="flex-1 px-2 truncate">{user.email}</div>
                                        <div className="w-40 px-2 truncate">{user.nama}</div>
                                        <div className="w-24 flex-shrink-0 flex justify-center">
                                            {user.status === 'Online' ? (
                                                <div className="inline-flex items-center justify-center px-2 py-1 bg-[#DFFFDB] rounded-lg">
                                                    <span className="text-xs text-[#408F35]">Online</span>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center justify-center px-2 py-1 bg-gray-200 rounded-lg">
                                                    <span className="text-gray-600 text-xs">Offline</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {index < registeredUsersData.length - 1 && <div className="w-full h-px bg-gray-200"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Komponen Utama Halaman ---
const HomePage = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const { accessToken } = useAuth();
    const [timeFilter, setTimeFilter] = useState('week');

    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://34.101.143.2:3000/api/dashboard/admin?timeFilter=${timeFilter}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const result = await response.json();
            console.log('Dashboard data:', result);
            setDashboardData(result.data || result);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Gagal memuat data dashboard. Menggunakan data dummy.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchDashboardData();
        }
    }, [accessToken, timeFilter]);

    const handleFilterChange = (filter: string) => {
        setTimeFilter(filter);
    };

    if (loading) {
        return (
            <div className="bg-neutral-100 flex justify-center min-h-screen w-full">
                <div className="flex flex-col w-full max-w-screen-xl items-start gap-4 sm:gap-6 lg:gap-9">
                    {/* Overview Text Skeleton */}
                    <div className="w-[71px] h-[19px] ml-4 sm:ml-6 lg:ml-2 sm:mt-1 lg:mt-0">
                        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Top Row Skeleton */}
                    <div className="flex flex-col lg:flex-row items-start gap-3 sm:gap-5 self-stretch w-full">
                        {/* Profile Card Skeleton */}
                        <div className="flex-shrink-0 w-full lg:w-auto inline-flex h-auto sm:h-[145px] items-center gap-3 sm:gap-4 p-3 sm:px-4 sm:py-3 bg-gray-200 rounded-xl animate-pulse">
                            <div className="relative w-[80px] h-[80px] sm:w-[104px] sm:h-[104px] rounded-[16px] bg-gray-300"></div>
                            <div className="flex flex-col flex-1 sm:w-[141px] items-start gap-3 sm:gap-4">
                                <div className="flex flex-col items-start gap-1.5 sm:gap-2 self-stretch w-full">
                                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                                    <div className="h-3 bg-gray-300 rounded w-32"></div>
                                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                                </div>
                                <div className="h-8 bg-gray-300 rounded w-full"></div>
                            </div>
                        </div>
                        
                        {/* Status Cards Skeleton */}
                        <div className="flex flex-col sm:flex-row h-auto sm:h-[145px] items-stretch sm:items-center gap-2 sm:gap-3 p-2 sm:p-4 relative bg-white rounded-xl w-full max-w-full overflow-hidden">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col w-full sm:flex-1 sm:max-w-[249px] items-start gap-4 sm:gap-6 px-3 py-4 sm:px-4 sm:py-5 relative rounded-lg border border-solid border-[#f5d5e0] min-w-0">
                                    <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
                                    <div className="h-6 bg-gray-300 rounded animate-pulse w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Bottom Row Skeleton */}
                    <div className="flex flex-col xl:flex-row items-start gap-5 self-stretch w-full">
                        {/* Device List Skeleton */}
                        <div className="w-full xl:w-[425px] flex-shrink-0">
                            <div className="flex flex-col flex-1 gap-4 p-4 bg-white rounded-lg h-[672px] min-w-0">
                                <div className="flex items-center justify-between w-full">
                                    <div className="h-4 bg-gray-300 rounded animate-pulse w-48"></div>
                                    <div className="h-8 bg-gray-300 rounded animate-pulse w-20"></div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                        <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Column Skeleton */}
                        <div className="w-full flex flex-col gap-5 flex-1 min-w-0">
                            {/* Chart Skeleton */}
                            <div className="w-full flex flex-col items-start gap-4 p-4 bg-white rounded-lg">
                                <div className="flex items-center justify-between w-full">
                                    <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
                                    <div className="h-8 bg-gray-300 rounded animate-pulse w-24"></div>
                                </div>
                                <div className="h-6 bg-gray-300 rounded animate-pulse w-40"></div>
                                <div className="flex w-full">
                                    <div className="flex flex-col justify-between text-sm text-gray-700 text-right pr-2 w-auto flex-shrink-0">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-3 bg-gray-300 rounded animate-pulse w-8 mb-2"></div>
                                        ))}
                                    </div>
                                    <div className="flex-1 relative flex flex-col">
                                        <div className="relative flex-1 h-[120px] flex justify-around items-end pt-2">
                                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                                <div key={i} className="flex flex-col items-center gap-1 w-9">
                                                    <div className="w-[13px] bg-gray-300 rounded-full animate-pulse" style={{height: `${Math.random() * 80 + 20}px`}}></div>
                                                    <div className="h-3 bg-gray-300 rounded animate-pulse w-6"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* User List Skeleton */}
                            <div className="flex flex-col flex-1 gap-2 p-4 bg-white rounded-lg h-auto min-w-0">
                                <div className="flex items-center justify-between w-full mb-4">
                                    <div className="h-4 bg-gray-300 rounded animate-pulse w-40"></div>
                                    <div className="h-8 bg-gray-300 rounded animate-pulse w-20"></div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-neutral-100 flex justify-center min-h-screen w-full">
            <div className="flex flex-col w-full max-w-screen-xl items-start gap-4 sm:gap-6 lg:gap-9">
                {/* Overview Text */}
                <div className="w-[71px] h-[19px] ml-4 sm:ml-6 lg:ml-2 sm:mt-1 lg:mt-0"> {/* Added margin for alignment */}
                  <div className="[font-family:'Lato-Bold',Helvetica] mt-1 font-bold text-[#220636] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                    Overview
                  </div>
                </div>
                {/* Baris Atas: Profil dan Ringkasan Angka */}
                <div className="flex flex-col lg:flex-row items-start gap-3 sm:gap-5 self-stretch w-full">
                    <div className="flex-shrink-0 w-full lg:w-auto inline-flex h-auto sm:h-[145px] items-center gap-3 sm:gap-4 p-3 sm:px-4 sm:py-3 bg-[#f5d5e0] rounded-xl">
                        <img
                            className="relative w-[80px] h-[80px] sm:w-[104px] sm:h-[104px] rounded-[16px] object-cover"
                            alt="User Profile"
                            src={profilImage}
                        />
                        <div className="flex flex-col flex-1 sm:w-[141px] items-start gap-3 sm:gap-4">
                            <div className="flex flex-col items-start gap-1.5 sm:gap-2 self-stretch w-full">
                                <div className="font-bold text-[#430d4b] text-sm sm:text-base leading-tight">{dashboardData?.admin_profile?.name || 'Admin'}</div>
                                <div className="font-normal text-[#6869ac] text-xs sm:text-sm leading-tight">{dashboardData?.admin_profile?.email || 'admin@example.com'}</div>
                                <div className="text-xs text-gray-500 leading-tight">
                                    Status: <span className={`font-medium ${dashboardData?.admin_profile?.status === 'Online' ? 'text-green-600' : 'text-gray-600'}`}>
                                        {dashboardData?.admin_profile?.status || 'Online'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2.5 px-3 py-2.5 self-stretch w-full bg-[#430d4b] rounded-lg cursor-pointer mt-2">
                                <div className="font-normal text-white text-xs sm:text-sm">Edit</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row h-auto sm:h-[145px] items-stretch sm:items-center gap-2 sm:gap-3 p-2 sm:p-4 relative bg-white rounded-xl w-full max-w-full overflow-hidden">
                        <div className="flex flex-col w-full sm:flex-1 sm:max-w-[249px] items-start gap-4 sm:gap-6 px-3 py-4 sm:px-4 sm:py-5 relative rounded-lg border border-solid border-[#f5d5e0] min-w-0">
                            <div className="relative self-stretch mt-[-1.00px] [font-family:'Lato-Bold',Helvetica] font-bold text-[#430d4b] text-xs sm:text-sm md:text-base tracking-[0] leading-[normal]">
                                {dashboardData?.device_status?.running?.text || 'Perangkat sedang berjalan'}
                            </div>
                            <p className="relative self-stretch rotate-[0.09deg] [font-family:'Lato-Regular',Helvetica] font-normal text-transparent text-sm sm:text-base tracking-[0] leading-[normal]">
                                <span className="text-[#f3ae00]">{dashboardData?.device_status?.running?.value?.split('/')[0] || '35'}</span>
                                <span className="text-[#7c347e]">/{dashboardData?.device_status?.running?.value?.split('/')[1] || '50'}</span>
                            </p>
                        </div>
                        <div className="flex flex-col w-full sm:flex-1 sm:max-w-[249px] items-start gap-4 sm:gap-6 px-3 py-4 sm:px-4 sm:py-5 relative rounded-lg border border-solid border-[#f5d5e0] min-w-0">
                            <div className="relative self-stretch mt-[-1.00px] [font-family:'Lato-Bold',Helvetica] font-bold text-[#430d4b] text-xs sm:text-sm md:text-base tracking-[0] leading-[normal]">
                                {dashboardData?.device_status?.ready?.text || 'Perangkat siap digunakan'}
                            </div>
                            <p className="relative self-stretch rotate-[0.09deg] [font-family:'Lato-Regular',Helvetica] font-normal text-transparent text-sm sm:text-base tracking-[0] leading-[normal]">
                                <span className="text-[#f3ae00]">{dashboardData?.device_status?.ready?.value?.split('/')[0] || '15'}</span>
                                <span className="text-[#7c347e]">/{dashboardData?.device_status?.ready?.value?.split('/')[1] || '50'}</span>
                            </p>
                        </div>
                        <div className="flex flex-col w-full sm:flex-1 sm:max-w-[249px] items-start gap-4 sm:gap-6 px-3 py-4 sm:px-4 sm:py-5 relative rounded-lg border border-solid border-[#f5d5e0] min-w-0">
                            <div className="relative self-stretch mt-[-1.00px] [font-family:'Lato-Bold',Helvetica] font-bold text-[#430d4b] text-xs sm:text-sm md:text-base tracking-[0] leading-[normal]">
                                {dashboardData?.device_status?.almost_finished?.text || 'Perangkat hampir selesai'}
                            </div>
                            <p className="relative self-stretch rotate-[0.09deg] [font-family:'Lato-Regular',Helvetica] font-normal text-transparent text-sm sm:text-base tracking-[0] leading-[normal]">
                                <span className="text-[#f3ae00]">{dashboardData?.device_status?.almost_finished?.value?.split('/')[0] || '5'}</span>
                                <span className="text-[#7c347e]">/{dashboardData?.device_status?.almost_finished?.value?.split('/')[1] || '35'}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Baris Bawah: Dua Kolom Utama */}
                <div className="flex flex-col xl:flex-row items-start gap-5 self-stretch w-full">
                    
                    {/* PERBAIKAN: Lebar kolom diatur ke 425px di layar xl ke atas */}
                    <div className="w-full xl:w-[425px] flex-shrink-0">
                        <RunningDeviceList runningDevicesList={dashboardData?.running_devices_list} />
                    </div>

                    {/* Kolom Kanan: Grafik dan Daftar User */}
                    <div className="w-full flex flex-col gap-5 flex-1 min-w-0">
                        <TotalPemasukanChart 
                            incomeData={dashboardData?.total_income} 
                            onFilterChange={handleFilterChange} 
                            selectedFilter={timeFilter} 
                        />
                        <RegisteredUserList usersData={dashboardData?.registered_users} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;