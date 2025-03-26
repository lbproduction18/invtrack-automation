
import React from 'react';

export const AppLogo: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl">
        IM
      </div>
      <h2 className="mt-4 text-2xl font-bold text-foreground">
        InvTrack
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Stock Management Connected to Shopify
      </p>
    </div>
  );
};
