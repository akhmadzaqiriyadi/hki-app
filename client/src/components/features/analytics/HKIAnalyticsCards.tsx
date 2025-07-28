"use client";

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  AlertCircle, 
  TrendingUp, 
  BarChart as BarChartIcon, 
  Loader2,
  Award,
  Activity,
  RefreshCw,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- PERUBAHAN: Impor hook yang baru dibuat ---
import { useGetAnalyticsData } from '@/queries/queries/useGetAnalyticsData';

// Interface untuk data analytics (tetap sama)
interface HkiTypeDistribution {
  "Jenis HKI": string;
  Jumlah: number;
  percentage?: number;
}
// ... (interface lainnya tetap sama) ...
interface HkiRegistrationsPerYear {
  "Tahun HKI": number;
  Jumlah: number;
  growth?: number;
}
interface HkiStatusDistribution {
  "Status": string;
  Jumlah: number;
  percentage?: number;
}
interface HkiAnalyticsData {
  hkiTypeDistribution: HkiTypeDistribution[];
  hkiRegistrationsPerYear: HkiRegistrationsPerYear[];
  hkiStatusDistribution: HkiStatusDistribution[];
}
// Tipe data yang diproses
interface ProcessedAnalyticsData extends HkiAnalyticsData {
  totalHki?: number;
  totalThisYear?: number;
  totalLastYear?: number;
  averagePerYear?: number;
  mostPopularType?: string;
  completionRate?: number;
}

// ... (Komponen MetricCard dan CustomTooltip tetap sama) ...
interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: number;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon: Icon, trend, color = "blue" }) => {
    // ... implementasi MetricCard tidak berubah
    const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "from-blue-500 to-blue-600 text-blue-700 bg-blue-50",
      green: "from-green-500 to-green-600 text-green-700 bg-green-50",
      purple: "from-purple-500 to-purple-600 text-purple-700 bg-purple-50",
      orange: "from-orange-500 to-orange-600 text-orange-700 bg-orange-50",
      red: "from-red-500 to-red-600 text-red-700 bg-red-50",
      indigo: "from-indigo-500 to-indigo-600 text-indigo-700 bg-indigo-50"
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${getColorClasses(color)}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend > 0 ? 'bg-green-100 text-green-700' : 
              trend < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
              <TrendingUp className={`h-3 w-3 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


export function HKIAnalyticsCards() {
  // --- PERUBAHAN: Gunakan hook react-query, hapus useState dan useEffect ---
  const { data, isLoading, isError, error, refetch, isRefetching } = useGetAnalyticsData();

  // --- PERUBAHAN: Pindahkan logika pemrosesan data ke dalam useMemo ---
  const analyticsData: ProcessedAnalyticsData | null = useMemo(() => {
    if (!data) return null;

    // Hitung metrics tambahan
    const totalHki = data.hkiTypeDistribution.reduce((sum, item) => sum + item.Jumlah, 0);
    const currentYear = new Date().getFullYear();
    const totalThisYear = data.hkiRegistrationsPerYear.find(item => item["Tahun HKI"] === currentYear)?.Jumlah || 0;
    
    const averagePerYear = data.hkiRegistrationsPerYear.length > 0 
      ? Math.round(data.hkiRegistrationsPerYear.reduce((sum, item) => sum + item.Jumlah, 0) / data.hkiRegistrationsPerYear.length)
      : 0;
    
    const mostPopularType = data.hkiTypeDistribution.reduce((max, item) => 
      item.Jumlah > max.Jumlah ? item : max, data.hkiTypeDistribution[0] || { "Jenis HKI": "N/A" }
    );
    
    const submittedCount = data.hkiStatusDistribution.find(item => 
        item.Status.toLowerCase().includes('submitted') || 
        item.Status.toLowerCase().includes('diajukan') ||
        item.Status.toLowerCase().includes('pending')
      )?.Jumlah || 0;
      
    const typeDistributionWithPercentage = data.hkiTypeDistribution
      .map(item => ({
        ...item,
        percentage: totalHki > 0 ? Math.round((item.Jumlah / totalHki) * 100) : 0
      }))
      .filter(item => item.Jumlah >= 3)
      .sort((a, b) => b.Jumlah - a.Jumlah);
    
    return {
      ...data,
      hkiTypeDistribution: typeDistributionWithPercentage,
      totalHki: submittedCount,
      totalThisYear,
      averagePerYear,
      mostPopularType: mostPopularType?.["Jenis HKI"],
    };
  }, [data]); // Memo akan dijalankan ulang hanya jika 'data' berubah

  const metrics = useMemo(() => {
    if (!analyticsData) return [];
    return [
      { title: "Total HKI", value: analyticsData.totalHki || 0, description: "Jumlah HKI yang telah disubmit", icon: Send, color: "blue" },
      { title: "Rata-rata per Tahun", value: analyticsData.averagePerYear || 0, description: "Rata-rata pendaftaran tahunan", icon: Activity, color: "purple" },
      { title: "Jenis Terpopuler", value: analyticsData.mostPopularType || "N/A", description: "Jenis HKI paling banyak didaftarkan", icon: Award, color: "orange" }
    ];
  }, [analyticsData]);

  // --- PERUBAHAN: Gunakan isLoading dari react-query ---
  if (isLoading) {
    // ... (UI loading state tidak berubah)
    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-sm text-gray-500">Memuat data...</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // --- PERUBAHAN: Gunakan isError dan error dari react-query ---
  if (isError) {
    // ... (UI error state tidak berubah, hanya ganti 'refreshing' ke 'isRefetching' dan 'handleRefresh' ke 'refetch')
     return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <button 
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        <Card className="border-red-200 bg-red-50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error Memuat Data Analytics</span>
            </div>
            <p className="text-red-700 text-sm mb-4">{error.message}</p>
            <button 
              onClick={() => refetch()}
              disabled={isRefetching}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isRefetching ? 'Mencoba lagi...' : 'Coba Lagi'}
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ... (UI No data state dan UI utama tidak berubah, hanya ganti 'refreshing' ke 'isRefetching' dan 'handleRefresh' ke 'refetch')
  if (!analyticsData || !analyticsData.totalHki) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <button 
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChartIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Data HKI
            </h3>
            <p className="text-gray-600 mb-6">
              Pastikan spreadsheet Anda memiliki data HKI yang valid untuk menampilkan analytics dashboard.
            </p>
            <button 
              onClick={() => refetch()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Periksa Ulang Data
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribusi Jenis HKI */}
        {analyticsData.hkiTypeDistribution.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5 text-blue-600" />
                  Distribusi Jenis HKI
                </CardTitle>
                <div className="text-xs text-gray-500">
                  {analyticsData.hkiTypeDistribution.length} jenis ditampilkan
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={analyticsData.hkiTypeDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="Jenis HKI" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0} 
                    height={100}
                    fontSize={11}
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#e5e5e5' }}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#e5e5e5' }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar 
                    dataKey="Jumlah" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="text-xs text-gray-500 text-center">
                * Hanya menampilkan jenis HKI dengan 3 atau lebih pendaftaran
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tren Pendaftaran HKI */}
        {analyticsData.hkiRegistrationsPerYear.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Tren Pendaftaran HKI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={analyticsData.hkiRegistrationsPerYear}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="Tahun HKI"
                    fontSize={12}
                    tick={{ fill: '#666' }}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fill: '#666' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone"
                    dataKey="Jumlah" 
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}