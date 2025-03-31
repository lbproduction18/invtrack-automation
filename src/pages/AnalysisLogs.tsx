
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAnalysisLogs, type LogsFilter, type AnalysisLogEntry } from '@/hooks/useAnalysisLogs';
import { formatDate } from '@/utils/logFormatter';

interface AnalysisLogsHeaderProps {
  filters: LogsFilter;
  onFiltersChange: (filters: LogsFilter) => void;
}

const AnalysisLogsHeader: React.FC<AnalysisLogsHeaderProps> = ({ filters, onFiltersChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(filters.startDate);
  const [endDate, setEndDate] = useState<Date | null>(filters.endDate);
  const [actionType, setActionType] = useState<string | null>(filters.actionType);
  const [searchTerm, setSearchTerm] = useState<string | null>(filters.searchTerm);
  
  const handleApplyFilters = () => {
    onFiltersChange({
      startDate,
      endDate,
      actionType,
      searchTerm
    });
  };
  
  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setActionType(null);
    setSearchTerm(null);
    onFiltersChange({
      startDate: null,
      endDate: null,
      actionType: null,
      searchTerm: null
    });
  };
  
  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Analysis Logs</h2>
        <div className="flex gap-2">
          <button 
            className="px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-md"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
          <button 
            className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md"
            onClick={handleClearFilters}
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Start Date</label>
          <input 
            type="date" 
            className="w-full px-3 py-2 bg-[#161616] border border-[#272727] rounded-md"
            value={startDate ? startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">End Date</label>
          <input 
            type="date" 
            className="w-full px-3 py-2 bg-[#161616] border border-[#272727] rounded-md"
            value={endDate ? endDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Action Type</label>
          <select 
            className="w-full px-3 py-2 bg-[#161616] border border-[#272727] rounded-md"
            value={actionType || ''}
            onChange={(e) => setActionType(e.target.value || null)}
          >
            <option value="">All Actions</option>
            <option value="INSERT">INSERT</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Search</label>
          <input 
            type="text" 
            placeholder="Product name or SKU..."
            className="w-full px-3 py-2 bg-[#161616] border border-[#272727] rounded-md"
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm(e.target.value || null)}
          />
        </div>
      </div>
    </div>
  );
};

interface AnalysisLogsContentProps {
  logs: AnalysisLogEntry[];
  isLoading: boolean;
}

const AnalysisLogsContent: React.FC<AnalysisLogsContentProps> = ({ logs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border border-[#272727] rounded-md bg-[#161616]">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="w-1/3">
                  <div className="h-4 bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="w-1/4">
                  <div className="h-4 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
              <div className="w-1/2">
                <div className="h-4 bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="w-full">
                <div className="h-16 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (logs.length === 0) {
    return (
      <div className="text-center p-8 bg-[#161616] border border-[#272727] rounded-md">
        <h3 className="text-lg font-medium text-gray-300 mb-2">No logs found</h3>
        <p className="text-gray-400">
          No analysis logs match your current filter criteria. Try adjusting your filters or clearing them.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log.id} className="bg-[#161616] border-[#272727]">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-300">
                    {log.product_name || 'Unknown Product'}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {log.sku_code || 'No SKU'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`
                      ${log.action_type === 'INSERT' ? 'bg-green-900/30 border-green-700 text-green-400' : ''} 
                      ${log.action_type === 'UPDATE' ? 'bg-blue-900/30 border-blue-700 text-blue-400' : ''} 
                      ${log.action_type === 'DELETE' ? 'bg-red-900/30 border-red-700 text-red-400' : ''}
                    `}
                  >
                    {log.action_type}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {formatDate(log.created_at)}
                  </span>
                </div>
              </div>
              
              {log.note && (
                <div className="mt-1 px-3 py-2 bg-[#1c1c1c] border border-[#272727] rounded-md">
                  <p className="text-sm text-gray-300">Note: {log.note}</p>
                </div>
              )}
              
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {log.old_values && (
                  <div className="p-3 bg-[#1a1a1a] border border-[#272727] rounded-md">
                    <h4 className="text-xs font-medium text-gray-400 mb-2">Previous Values</h4>
                    <pre className="text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(log.old_values, null, 2)}
                    </pre>
                  </div>
                )}
                
                {log.new_values && (
                  <div className="p-3 bg-[#1a1a1a] border border-[#272727] rounded-md">
                    <h4 className="text-xs font-medium text-gray-400 mb-2">New Values</h4>
                    <pre className="text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(log.new_values, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AnalysisLogs: React.FC = () => {
  const [filters, setFilters] = useState<LogsFilter>({
    startDate: null,
    endDate: null,
    actionType: null,
    searchTerm: null
  });
  
  const { logs, isLoading } = useAnalysisLogs(filters);
  
  return (
    <div className="container mx-auto p-6">
      <AnalysisLogsHeader 
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      <Card className="bg-[#121212] border-[#272727]">
        <CardHeader className="pb-0">
          <CardTitle>Analysis Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="recent">
            <TabsList className="bg-[#161616] border border-[#272727]">
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
              <TabsTrigger value="all">All Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="mt-4">
              <AnalysisLogsContent 
                logs={logs.slice(0, 10)} 
                isLoading={isLoading} 
              />
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              <AnalysisLogsContent 
                logs={logs} 
                isLoading={isLoading} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisLogs;
