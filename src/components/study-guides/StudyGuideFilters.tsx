// src/components/study-guides/StudyGuideFilters.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ArrowUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StudyGuideFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedGuideType: string
  onGuideTypeChange: (type: string) => void
  sortOption: string
  onSortOptionChange: (option: string) => void
}

export const StudyGuideFilters = ({
  searchTerm,
  onSearchChange,
  selectedGuideType,
  onGuideTypeChange,
  sortOption,
  onSortOptionChange,
}: StudyGuideFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Define guide types
  const guideTypes = [
    { id: 'all', label: 'All Guides' },
    { id: 'summary', label: 'Summary Guides' },
    { id: 'concept', label: 'Concept Maps' },
    { id: 'practice', label: 'Practice Tests' },
    { id: 'flashcard', label: 'Flashcard Sets' },
  ]

  // Define sort options
  const sortOptions = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'priority', label: 'Exam Priority' },
    { id: 'progress', label: 'Study Progress' },
    { id: 'name', label: 'Name (A-Z)' },
  ]

  // Get label for the current sort option
  const currentSortLabel = sortOptions.find(option => option.id === sortOption)?.label || 'Sort By'

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Filters & Search</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter 
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
            <span className="sr-only">Toggle filters</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search box */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search guides..."
            className="w-full pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        {/* Expanded filters */}
        <motion.div 
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pt-2 space-y-4">
            {/* Guide types filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Guide Types
              </label>
              <div className="flex flex-wrap gap-2">
                {guideTypes.map((type) => (
                  <Badge
                    key={type.id}
                    variant={selectedGuideType === type.id ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedGuideType === type.id
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'hover:bg-blue-50'
                    }`}
                    onClick={() => onGuideTypeChange(type.id)}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Sort dropdown - always visible */}
        <div className="pt-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-between">
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                  <span>{currentSortLabel}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Sort Study Guides</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    className={option.id === sortOption ? 'bg-blue-50 font-medium' : ''}
                    onClick={() => onSortOptionChange(option.id)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}