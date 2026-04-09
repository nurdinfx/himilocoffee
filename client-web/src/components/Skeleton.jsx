import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`bg-gray-100 animate-pulse rounded-2xl ${className}`} />
);

export const MenuSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 py-12 max-w-7xl mx-auto w-full">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export const OrderSkeleton = () => (
  <div className="space-y-6 max-w-4xl mx-auto px-4 py-16 w-full">
    <Skeleton className="h-12 w-1/3 mb-8" />
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex justify-between items-center p-6 border border-gray-100 rounded-2xl">
         <div className="flex items-center space-x-6">
            <Skeleton className="h-16 w-16" />
            <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
            </div>
         </div>
         <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    ))}
  </div>
);

export default Skeleton;
