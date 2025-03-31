
import React from 'react';
import { AnalysisLogsContent } from '@/components/logs/AnalysisLogsContent';
import { AnalysisLogsHeader } from '@/components/logs/AnalysisLogsHeader';

const AnalysisLogs: React.FC = () => {
  return (
    <div className="space-y-4">
      <AnalysisLogsHeader />
      <AnalysisLogsContent />
    </div>
  );
};

export default AnalysisLogs;
