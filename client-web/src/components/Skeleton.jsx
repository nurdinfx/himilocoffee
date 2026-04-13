import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`bg-gray-100 animate-pulse rounded-2xl ${className}`} />
);

export const MenuSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 px-4 py-12 max-w-7xl mx-auto w-full">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 p-2 sm:p-3 space-y-4">
        <Skeleton className="h-48 sm:h-64 w-full rounded-[24px]" />
        <div className="px-3 pb-3 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex justify-between items-center pt-2 mt-2">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const OrderSkeleton = () => (
  <div className="space-y-6 max-w-4xl mx-auto px-4 py-16 w-full">
    <Skeleton className="h-12 w-1/3 mb-8" />
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex justify-between items-center p-6 border border-gray-100 rounded-2xl bg-white shadow-sm">
        <div className="flex items-center space-x-6">
          <Skeleton className="h-16 w-16 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    ))}
  </div>
);

export const RestaurantSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <div className="text-center mb-12">
      <Skeleton className="h-12 w-64 mx-auto mb-4" />
      <Skeleton className="h-6 w-96 mx-auto" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-6 space-y-3">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CartSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-10 w-48 mb-6" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Skeleton className="h-20 w-20 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        ))}
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <Skeleton className="h-7 w-32 mb-4" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="border-t pt-3 flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-full mt-4" />
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;