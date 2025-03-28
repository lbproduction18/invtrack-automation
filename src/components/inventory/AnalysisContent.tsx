
import React from 'react';

// Define QuantityOption type consistently in this file
export type QuantityOption = 1000 | 2000 | 3000 | 4000 | 5000 | 8000;

// Named export to match import in Index.tsx
export const AnalysisContent: React.FC = () => {
  return (
    <div className="p-4">
      {/* Empty analysis content */}
    </div>
  );
};

// Also add default export to maintain compatibility
export default AnalysisContent;
