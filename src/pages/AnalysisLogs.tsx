
import React, { useState } from 'react';
import { AnalysisLogsContent } from '@/components/logs/AnalysisLogsContent';
import { AnalysisLogsHeader } from '@/components/logs/AnalysisLogsHeader';
import { LogsFilter } from '@/hooks/useAnalysisLogs';

const AnalysisLogs: React.FC = () => {
  const [filters, setFilters] = useState<LogsFilter>({
    startDate: null,
    endDate: null,
    actionType: null,
    searchTerm: null
  });

  const handleRefresh = () => {
    // This will trigger a refetch when the refetch function is passed to the content component
    console.log('Refreshing logs...');
  };

  return (
    <div className="space-y-4">
      <AnalysisLogsHeader 
        filters={filters} 
        setFilters={setFilters} 
        onRefresh={handleRefresh} 
      />
      <AnalysisLogsContent filters={filters} />
    </div>
  );
};

export default AnalysisLogs;
