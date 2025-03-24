'use client';

import { useParams } from 'next/navigation';
import KnowledgeGapDetailClient from '@/components/knowledge-gap/KnowledgeGapDetailClient';

export default function KnowledgeGapDetailClientWrapper() {
  const params = useParams();
  const id = params.id as string;
  
  return <KnowledgeGapDetailClient id={id} />;
}