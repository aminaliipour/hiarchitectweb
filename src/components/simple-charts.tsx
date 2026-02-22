'use client';

import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: ChartData[];
  title: string;
  height?: number;
}

export function SimpleBarChart({ data, title, height = 200 }: SimpleBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          داده‌ای موجود نیست
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div style={{ height }} className="space-y-3">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const color = item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;
          
          return (
            <div key={index} className="flex items-center">
              <div className="w-20 text-sm text-gray-600 truncate">
                {item.label}
              </div>
              <div className="flex-1 mr-4">
                <div className="flex items-center">
                  <div 
                    className="h-6 rounded transition-all duration-300"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: color,
                      minWidth: item.value > 0 ? '4px' : '0px'
                    }}
                  ></div>
                  <span className="mr-2 text-sm text-gray-700 min-w-0">
                    {item.value}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface SimplePieChartProps {
  data: ChartData[];
  title: string;
}

export function SimplePieChart({ data, title }: SimplePieChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          داده‌ای موجود نیست
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const color = item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded mr-3"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-gray-700">{item.label}</span>
              </div>
              <div className="text-left">
                <span className="text-gray-900 font-medium">
                  {item.value}
                </span>
                <span className="text-gray-500 text-sm mr-2">
                  ({percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface SimpleLineChartProps {
  data: Array<{
    date: string;
    visits: number;
    unique_visitors: number;
  }>;
  title: string;
}

export function SimpleLineChart({ data, title }: SimpleLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          داده‌ای موجود نیست
        </div>
      </div>
    );
  }

  const maxVisits = Math.max(...data.map(d => d.visits));
  const maxUnique = Math.max(...data.map(d => d.unique_visitors));
  const maxValue = Math.max(maxVisits, maxUnique);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      
      {/* Legend */}
      <div className="flex items-center justify-center mb-4 space-x-4 space-x-reverse">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">کل بازدیدها</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">بازدیدکنندگان یکتا</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.reverse().map((day, index) => {
          const visitsPercentage = maxValue > 0 ? (day.visits / maxValue) * 100 : 0;
          const uniquePercentage = maxValue > 0 ? (day.unique_visitors / maxValue) * 100 : 0;
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {new Date(day.date).toLocaleDateString('fa-IR', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <span>
                  {day.visits} بازدید، {day.unique_visitors} یکتا
                </span>
              </div>
              
              {/* Visits bar */}
              <div className="relative">
                <div 
                  className="bg-blue-500 h-2 rounded transition-all duration-300"
                  style={{ width: `${visitsPercentage}%` }}
                ></div>
                <div 
                  className="bg-green-500 h-2 rounded absolute top-0 transition-all duration-300"
                  style={{ width: `${uniquePercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}