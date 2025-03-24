"use client";

// src/components/knowledge-gap/StrengthList.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Strength } from '@/types/knowledge-gap';
import { 
  ChevronDown, ChevronUp, Search, Star, Sparkles, Trophy
} from 'lucide-react';

interface StrengthListProps {
  strengths: Strength[];
}

export function StrengthList({ strengths }: StrengthListProps) {
  const [expandedStrengths, setExpandedStrengths] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const toggleStrengthExpanded = (id: string) => {
    setExpandedStrengths(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter the strengths based on search term
  const filteredStrengths = strengths.filter(strength => 
    strength.concept.toLowerCase().includes(searchTerm.toLowerCase()) || 
    strength.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search strengths..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredStrengths.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No matching strengths found</h3>
          <p className="text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStrengths.map((strength, index) => (
            <Card key={strength.id} className="overflow-hidden">
              <CardHeader 
                className={`p-4 cursor-pointer ${expandedStrengths[strength.id] ? 'pb-2' : ''}`}
                onClick={() => toggleStrengthExpanded(strength.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      <CardTitle className="text-lg">{strength.concept}</CardTitle>
                    </div>
                    {!expandedStrengths[strength.id] && (
                      <p className="text-gray-500 line-clamp-2">{strength.description}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    {expandedStrengths[strength.id] ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {expandedStrengths[strength.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0 px-4 pb-4">
                      <div className="border-t my-2" />
                      <div className="flex items-start gap-2">
                        <div className="pt-1">
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{strength.description}</p>
                      </div>
                      <div className="mt-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100">
                          Strength #{index + 1}
                        </Badge>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}