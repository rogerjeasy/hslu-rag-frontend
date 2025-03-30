'use client';

import React from 'react';
import StudyGuideDeetailComponent from './StudyGuideDetailComponent';


export default function StudyGuideDetailLayout() {
  return (
    <div className="flex flex-col min-h-0 w-full">
      {/* Main content area with fixed height and scrolling */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden py-6">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <StudyGuideDeetailComponent />
        </div>
      </main>
    </div>
  );
}