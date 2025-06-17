import React from "react";

// Definisikan path aset. Pastikan file-file ini ada di folder /public proyek Anda.
const profilImage = "/profil.png";
const groupIcon = "/GroupIcon.svg";
const dropdownIcon = "/DropdownIcon.svg";
const deviceListIcon = "/DeviceListIcon.svg";
const pageDropdownIcon = "/PageDropdownIcon.svg";
const userListIcon = "/user-icon.svg";
const userPageDropdownIcon = "/UserPageDropdownIcon.svg";

// --- Komponen untuk Total Pemasukan ---
const TotalPemasukanChart = () => {
    const chartData = [
        { day: "Sen", height: "h-[50px]", isHighlighted: false },
        { day: "Sel", height: "h-[32px]", isHighlighted: false },
        { day: "Rab", height: "h-[71px]", isHighlighted: false },
        { day: "Kam", height: "h-[59px]", isHighlighted: false },
        { day: "Jum", height: "h-[86px]", isHighlighted: true },
        { day: "Sab", height: "h-[3px]", isHighlighted: false },
        { day: "Min", height: "h-[3px]", isHighlighted: false },
    ];

    return (
        <div className="w-full flex flex-col items-start gap-4 p-4 bg-white rounded-lg">
            <div className="flex items-center justify-between w-full">
                <div className="inline-flex items-center gap-4">
                    <img className="relative w-5 h-5" alt="Group Icon" src={groupIcon} />
                    <div className="font-bold text-[#7c347e] text-sm">Total Pemasukan</div>
                </div>
                <div className="inline-flex items-center gap-2 p-2 border border-solid border-gray-300 rounded-lg cursor-pointer">
                    <div className="font-normal text-gray-500 text-sm">Minggu Ini</div>
                    <img className="relative w-3 h-2" alt="Dropdown Icon" src={dropdownIcon} />
                </div>
            </div>
            <div className="flex w-full">
                <div className="flex flex-col justify-between text-sm text-gray-700 text-right pr-2 w-[42px] flex-shrink-0">
                    <span>1.0 M</span>
                    <span>500 K</span>
                    <span>100 K</span>
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
                                <div className={`w-[13px] rounded-full ${data.isHighlighted ? 'bg-[#f3ae00]' : 'bg-gray-200'} ${data.height}`}></div>
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
const RunningDeviceList = () => {
    const deviceListData = [
        { id: 1, name: 'Device 1', category: 'Kategori 1', timeLeft: '90 menit' },
        { id: 2, name: 'Device 2', category: 'Kategori A', timeLeft: '45 menit' },
        { id: 3, name: 'Device 3', category: 'Kategori B', timeLeft: '120 menit' },
        { id: 4, name: 'Device 4', category: 'Kategori C', timeLeft: '30 menit' },
        { id: 5, name: 'Device 5', category: 'Kategori D', timeLeft: '75 menit' },
        { id: 6, name: 'Device 6', category: 'Kategori E', timeLeft: '60 menit' },
        { id: 7, name: 'Device 7', category: 'Kategori F', timeLeft: '90 menit' },
        { id: 8, name: 'Device 8', category: 'Kategori G', timeLeft: '45 menit' },
        { id: 9, name: 'Device 9', category: 'Kategori H', timeLeft: '105 menit' },
        { id: 10, name: 'Device 10', category: 'Kategori I', timeLeft: '80 menit' },
        { id: 11, name: 'Device 11', category: 'Kategori I', timeLeft: '80 menit' },
        { id: 12, name: 'Device 12', category: 'Kategori I', timeLeft: '80 menit' },
    ];
    return (
        // Container luar tetap memiliki tinggi tetap
        <div className="flex flex-col flex-1 gap-4 p-4 bg-white rounded-lg h-[672px] min-w-0">
            <div className="flex items-center justify-between w-full">
                <div className="inline-flex items-center gap-4">
                    <img className="w-4 h-4" alt="Device List Icon" src={deviceListIcon} />
                    <div className="font-bold text-[#7c347e] text-sm">Daftar Perangkat Sedang Berjalan</div>
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
                        <div key={device.id} className="w-full">
                            {/* PERBAIKAN: Jarak antar kolom (gap) & lebar kolom disesuaikan */}
                            <div className="flex items-center gap-3 p-4 w-full text-sm text-gray-800">
                                <div className="w-[30px] flex-shrink-0">{device.id}</div>
                                <div className="flex-1 truncate">{device.name}</div>
                                <div className="flex-1 truncate">{device.category}</div>
                                <div className="w-[85px] flex-shrink-0 text-right">{device.timeLeft}</div>
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
const RegisteredUserList = () => {
    const registeredUsersData = [
        { id: 1, email: "nattasharomanov@gmail.com", name: "Black Widow", status: "Online" },
        { id: 2, email: "steve.rogers@shield.com", name: "Captain America", status: "Offline" },
        { id: 3, email: "tony.stark@stark.com", name: "Iron Man", status: "Online" },
        { id: 4, email: "bruce.banner@avengers.com", name: "Hulk", status: "Offline" },
        { id: 5, email: "thor.odinson@asgard.com", name: "Thor", status: "Online" },
    ];

    return (
        <div className="flex flex-col flex-1 gap-2 p-4 bg-white rounded-lg h-auto min-w-0">
            <div className="flex items-center justify-between w-full mb-4">
                <div className="inline-flex items-center gap-4">
                    <img className="w-4 h-4" alt="User List Icon" src={userListIcon} />
                    <div className="font-bold text-[#7c347e] text-sm">User yang Terdaftar</div>
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
                            <div className="w-32 px-2">Nama</div>
                            <div className="w-24 text-center flex-shrink-0">Status</div>
                        </div>
                        <div className="flex flex-col">
                            {registeredUsersData.map((user, index) => (
                                <div key={user.id} className="w-full">
                                    <div className="flex items-center p-3 w-full text-xs text-gray-800">
                                        <div className="w-8 flex-shrink-0">{user.id}</div>
                                        <div className="flex-1 px-2 truncate">{user.email}</div>
                                        <div className="w-32 truncate">{user.name}</div>
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
const HomePage = (): JSX.Element => {
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
                        <div className="flex flex-col flex-1 sm:w-[141px] items-start gap-4 sm:gap-6">
                            <div className="flex flex-col items-start gap-2 sm:gap-3 self-stretch w-full">
                                <div className="font-bold text-[#430d4b] text-sm sm:text-base">Joe Natania</div>
                                <div className="font-normal text-[#6869ac] text-xs sm:text-sm">joenatania@gmail.com</div>
                            </div>
                            <div className="flex items-center justify-center gap-2.5 p-2 self-stretch w-full bg-[#430d4b] rounded-lg cursor-pointer">
                                <div className="font-normal text-white text-xs sm:text-sm">Edit</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row h-auto sm:h-[145px] items-stretch sm:items-center gap-2 sm:gap-3 p-2 sm:p-4 relative bg-white rounded-xl w-full max-w-full overflow-hidden">
                        <div className="flex flex-col w-full sm:flex-1 sm:max-w-[249px] items-start gap-4 sm:gap-6 px-3 py-4 sm:px-4 sm:py-5 relative rounded-lg border border-solid border-[#f5d5e0] min-w-0">
                            <div className="relative self-stretch mt-[-1.00px] [font-family:'Lato-Bold',Helvetica] font-bold text-[#430d4b] text-xs sm:text-sm md:text-base tracking-[0] leading-[normal]">
                                Perangkat sedang berjalan
                            </div>
                            <p className="relative self-stretch rotate-[0.09deg] [font-family:'Lato-Regular',Helvetica] font-normal text-transparent text-sm sm:text-base tracking-[0] leading-[normal]">
                                <span className="text-[#f3ae00]">35</span>
                                <span className="text-[#7c347e]">/50</span>
                            </p>
                        </div>
                        <div className="flex flex-col w-full sm:flex-1 sm:max-w-[249px] items-start gap-4 sm:gap-6 px-3 py-4 sm:px-4 sm:py-5 relative rounded-lg border border-solid border-[#f5d5e0] min-w-0">
                            <div className="relative self-stretch mt-[-1.00px] [font-family:'Lato-Bold',Helvetica] font-bold text-[#430d4b] text-xs sm:text-sm md:text-base tracking-[0] leading-[normal]">
                                Perangkat siap digunakan
                            </div>
                            <p className="relative self-stretch rotate-[0.09deg] [font-family:'Lato-Regular',Helvetica] font-normal text-transparent text-sm sm:text-base tracking-[0] leading-[normal]">
                                <span className="text-[#f3ae00]">15</span>
                                <span className="text-[#7c347e]">/50</span>
                            </p>
                        </div>
                        <div className="flex flex-col w-full sm:flex-1 sm:max-w-[249px] items-start gap-4 sm:gap-6 px-3 py-4 sm:px-4 sm:py-5 relative rounded-lg border border-solid border-[#f5d5e0] min-w-0">
                            <div className="relative self-stretch mt-[-1.00px] [font-family:'Lato-Bold',Helvetica] font-bold text-[#430d4b] text-xs sm:text-sm md:text-base tracking-[0] leading-[normal]">
                                Perangkat hampir selesai
                            </div>
                            <p className="relative self-stretch rotate-[0.09deg] [font-family:'Lato-Regular',Helvetica] font-normal text-transparent text-sm sm:text-base tracking-[0] leading-[normal]">
                                <span className="text-[#f3ae00]">5</span>
                                <span className="text-[#7c347e]">/35</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Baris Bawah: Dua Kolom Utama */}
                <div className="flex flex-col xl:flex-row items-start gap-5 self-stretch w-full">
                    
                    {/* PERBAIKAN: Lebar kolom diatur ke 425px di layar xl ke atas */}
                    <div className="w-full xl:w-[425px] flex-shrink-0">
                        <RunningDeviceList />
                    </div>

                    {/* Kolom Kanan: Grafik dan Daftar User */}
                    <div className="w-full flex flex-col gap-5 flex-1 min-w-0">
                        <TotalPemasukanChart />
                        <RegisteredUserList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;