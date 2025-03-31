
import React, { useState, useCallback } from 'react';
import { AnalysisLogsContent } from '@/components/logs/AnalysisLogsContent';
import { AnalysisLogsHeader } from '@/components/logs/AnalysisLogsHeader';
import { LogsFilter, useAnalysisLogs } from '@/hooks/useAnalysisLogs';

const AnalysisLogs: React.FC = () => {
  const [filters, setFilters] = useState<LogsFilter>({
    startDate: null,
    endDate: null,
    actionType: null,
    searchTerm: null
  });

  const { refetch } = useAnalysisLogs(filters);

  const handleRefresh = useCallback(() => {
    console.log('Refreshing logs...');
    refetch();
  }, [refetch]);

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
