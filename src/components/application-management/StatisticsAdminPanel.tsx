"use client";

import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { Download, RefreshCw, Settings, PieChart, BarChart } from 'lucide-react';

interface StatisticsConfig {
  autoCalculateInterval: number; // minutes
  retentionPeriod: number; // days
  publicStatisticsEnabled: boolean;
  trackedMetrics: {
    [key: string]: boolean;
  };
}

const StatisticsAdminPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [config, setConfig] = useState<StatisticsConfig>({
    autoCalculateInterval: 60,
    retentionPeriod: 90,
    publicStatisticsEnabled: true,
    trackedMetrics: {
      userGrowth: true,
      courseEnrollment: true,
      conversations: true,
      studyGuides: true,
      practiceQuestions: true,
      knowledgeGaps: true,
      sessionDuration: true,
      topicPopularity: true,
    }
  });
  
  // In a real app, this would fetch from API
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    };
    
    fetchConfig();
  }, []);
  
  const handleMetricToggle = (metric: string) => {
    setConfig(prev => ({
      ...prev,
      trackedMetrics: {
        ...prev.trackedMetrics,
        [metric]: !prev.trackedMetrics[metric]
      }
    }));
  };
  
  const handleSaveConfig = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);
    alert('Configuration saved successfully');
  };
  
  const handleCalculateStatistics = async () => {
    setCalculating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCalculating(false);
    alert('Statistics calculated successfully');
  };
  
  const handleExportStatistics = async () => {
    // In a real app, this would trigger an API call to generate and download a report
    alert('Statistics export started. The file will be downloaded when ready.');
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-medium">Statistics Administration</h2>
        <p className="text-sm text-gray-500">Manage platform statistics settings and reports</p>
      </div>
      
      <Tab.Group>
        <Tab.List className="flex border-b border-gray-200">
          <Tab className={({ selected }) => 
            `px-4 py-3 text-sm font-medium flex items-center ${
              selected 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`
          }>
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </Tab>
          <Tab className={({ selected }) => 
            `px-4 py-3 text-sm font-medium flex items-center ${
              selected 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`
          }>
            <PieChart className="w-4 h-4 mr-2" />
            Metrics
          </Tab>
          <Tab className={({ selected }) => 
            `px-4 py-3 text-sm font-medium flex items-center ${
              selected 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`
          }>
            <BarChart className="w-4 h-4 mr-2" />
            Reports
          </Tab>
        </Tab.List>
        
        <Tab.Panels>
          {/* Configuration Panel */}
          <Tab.Panel className="p-4">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-calculate Interval (minutes)
                </label>
                <input 
                  type="number" 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  value={config.autoCalculateInterval}
                  onChange={(e) => setConfig({...config, autoCalculateInterval: parseInt(e.target.value)})}
                  min={10}
                  max={1440}
                />
                <p className="text-xs text-gray-500 mt-1">
                  How often statistics are automatically refreshed (10-1440 minutes)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Retention Period (days)
                </label>
                <input 
                  type="number" 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                  value={config.retentionPeriod}
                  onChange={(e) => setConfig({...config, retentionPeriod: parseInt(e.target.value)})}
                  min={30}
                  max={365}
                />
                <p className="text-xs text-gray-500 mt-1">
                  How long detailed statistics history is kept (30-365 days)
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Public Statistics
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable publicly accessible platform statistics
                  </p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="toggle" 
                    checked={config.publicStatisticsEnabled}
                    onChange={() => setConfig({...config, publicStatisticsEnabled: !config.publicStatisticsEnabled})}
                    className="sr-only"
                  />
                  <label 
                    htmlFor="toggle" 
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      config.publicStatisticsEnabled ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                      config.publicStatisticsEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}></span>
                  </label>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </div>
          </Tab.Panel>
          
          {/* Metrics Panel */}
          <Tab.Panel className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tracked Metrics</h3>
              <p className="text-xs text-gray-500">
                Select which metrics to track and include in statistics calculations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="userGrowth"
                    type="checkbox"
                    checked={config.trackedMetrics.userGrowth}
                    onChange={() => handleMetricToggle('userGrowth')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="userGrowth" className="font-medium text-gray-700">
                    User Growth
                  </label>
                  <p className="text-gray-500">Track user registration and activity trends</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="courseEnrollment"
                    type="checkbox"
                    checked={config.trackedMetrics.courseEnrollment}
                    onChange={() => handleMetricToggle('courseEnrollment')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="courseEnrollment" className="font-medium text-gray-700">
                    Course Enrollment
                  </label>
                  <p className="text-gray-500">Track course popularity and student distribution</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="conversations"
                    type="checkbox"
                    checked={config.trackedMetrics.conversations}
                    onChange={() => handleMetricToggle('conversations')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="conversations" className="font-medium text-gray-700">
                    Conversations
                  </label>
                  <p className="text-gray-500">Track conversation volume and engagement</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="studyGuides"
                    type="checkbox"
                    checked={config.trackedMetrics.studyGuides}
                    onChange={() => handleMetricToggle('studyGuides')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="studyGuides" className="font-medium text-gray-700">
                    Study Guides
                  </label>
                  <p className="text-gray-500">Track study guide generation and usage</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="practiceQuestions"
                    type="checkbox"
                    checked={config.trackedMetrics.practiceQuestions}
                    onChange={() => handleMetricToggle('practiceQuestions')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="practiceQuestions" className="font-medium text-gray-700">
                    Practice Questions
                  </label>
                  <p className="text-gray-500">Track practice question generation and usage</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="knowledgeGaps"
                    type="checkbox"
                    checked={config.trackedMetrics.knowledgeGaps}
                    onChange={() => handleMetricToggle('knowledgeGaps')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="knowledgeGaps" className="font-medium text-gray-700">
                    Knowledge Gaps
                  </label>
                  <p className="text-gray-500">Track knowledge gap assessments and trends</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="sessionDuration"
                    type="checkbox"
                    checked={config.trackedMetrics.sessionDuration}
                    onChange={() => handleMetricToggle('sessionDuration')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="sessionDuration" className="font-medium text-gray-700">
                    Session Duration
                  </label>
                  <p className="text-gray-500">Track user study session length and patterns</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="topicPopularity"
                    type="checkbox"
                    checked={config.trackedMetrics.topicPopularity}
                    onChange={() => handleMetricToggle('topicPopularity')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="topicPopularity" className="font-medium text-gray-700">
                    Topic Popularity
                  </label>
                  <p className="text-gray-500">Track most discussed and difficult topics</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Metrics Configuration'}
              </button>
            </div>
          </Tab.Panel>
          
          {/* Reports Panel */}
          <Tab.Panel className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Manual Calculation</h3>
                  <p className="text-xs text-gray-500">
                    Force a recalculation of all statistics immediately
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCalculateStatistics}
                  disabled={calculating}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${calculating ? 'animate-spin' : ''}`} />
                  {calculating ? 'Calculating...' : 'Calculate Now'}
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Export Reports</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Export statistics data for offline analysis or reporting
                </p>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Platform Overview</h4>
                      <p className="text-xs text-gray-500">Complete platform statistics</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportStatistics}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">User Analytics</h4>
                      <p className="text-xs text-gray-500">User engagement and activity data</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportStatistics}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Course Analytics</h4>
                      <p className="text-xs text-gray-500">Course enrollment and engagement data</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportStatistics}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Time Series Data</h4>
                      <p className="text-xs text-gray-500">Historical trend data for all metrics</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportStatistics}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Custom Report</h4>
                      <p className="text-xs text-gray-500">Build a custom report with selected metrics</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('In a real app, this would open a custom report builder')}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default StatisticsAdminPanel;