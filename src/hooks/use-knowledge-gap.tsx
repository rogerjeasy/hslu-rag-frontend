"use client";

import { useState, useEffect } from 'react';
import { KnowledgeAssessment, KnowledgeAssessmentSummary, GapSeverity } from '@/types/knowledge-gap';
import { knowledgeGapService } from '@/services/knowledge.gap.service';

export function useKnowledgeGapAssessments(courseId?: string) {
  const [assessments, setAssessments] = useState<KnowledgeAssessmentSummary[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<KnowledgeAssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<GapSeverity | 'all'>('all');

  // Fetch assessments
  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await knowledgeGapService.getKnowledgeGapAssessments(courseId);
      setAssessments(data);
      setFilteredAssessments(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAssessments();
  }, [courseId]);

  // Filter assessments when search term or severity filter changes
  useEffect(() => {
    const filtered = assessments.filter(assessment => {
      const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = selectedSeverity === 'all' || assessment.highestSeverity === selectedSeverity;
      return matchesSearch && matchesSeverity;
    });
    
    setFilteredAssessments(filtered);
  }, [assessments, searchTerm, selectedSeverity]);

  return {
    assessments: filteredAssessments,
    loading,
    error,
    fetchAssessments,
    searchTerm,
    setSearchTerm,
    selectedSeverity,
    setSelectedSeverity
  };
}

export function useKnowledgeGapDetail(assessmentId: string | null) {
  const [assessment, setAssessment] = useState<KnowledgeAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessment = async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await knowledgeGapService.getKnowledgeGapAssessment(id);
      setAssessment(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load assessment details');
      setAssessment(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when ID changes
  useEffect(() => {
    if (assessmentId) {
      fetchAssessment(assessmentId);
    } else {
      setAssessment(null);
    }
  }, [assessmentId]);

  return {
    assessment,
    loading,
    error,
    fetchAssessment
  };
}

export function useGapStats(assessment: KnowledgeAssessment | null) {
  // Count gaps by severity
  const highGaps = assessment?.gaps.filter(gap => gap.severity === GapSeverity.HIGH).length || 0;
  const mediumGaps = assessment?.gaps.filter(gap => gap.severity === GapSeverity.MEDIUM).length || 0;
  const lowGaps = assessment?.gaps.filter(gap => gap.severity === GapSeverity.LOW).length || 0;
  
  // Total gaps
  const totalGaps = assessment?.gaps.length || 0;
  
  // Total strengths
  const totalStrengths = assessment?.strengths.length || 0;
  
  // Has study plan
  const hasStudyPlan = !!assessment?.recommendedStudyPlan;

  return {
    highGaps,
    mediumGaps,
    lowGaps,
    totalGaps,
    totalStrengths,
    hasStudyPlan,
    // Calculate a simple score based on gap distribution
    score: totalGaps > 0 
      ? Math.round(100 - ((highGaps * 3 + mediumGaps * 2 + lowGaps) / (totalGaps * 3)) * 100) 
      : 100
  };
}