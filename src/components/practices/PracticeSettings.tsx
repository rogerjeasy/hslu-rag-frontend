'use client'

import { useState, useEffect } from 'react'
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { PracticeSettings as PracticeSettingsType } from '@/types/practice.types'

interface PracticeSettingsProps {
  courseId: string
  onSave?: (settings: PracticeSettingsType) => void
}

export const PracticeSettings = ({ courseId, onSave }: PracticeSettingsProps) => {
  // State for available topics (in a real app, fetch from API)
  const [availableTopics, setAvailableTopics] = useState<
    { id: string; name: string }[]
  >([])
  
  // State for settings
  const [settings, setSettings] = useState<PracticeSettingsType>({
    topicsToInclude: [],
    difficulty: 'mixed',
    numberOfQuestions: 5,
    timeLimit: undefined  // No time limit by default
  })
  
  // State for enabling time limit
  const [enableTimeLimit, setEnableTimeLimit] = useState<boolean>(false)
  
  // Fetch available topics for this course
  useEffect(() => {
    // In a real app, you would fetch from an API
    // Simulating API call with mock data
    const mockTopics = [
      { id: 'ml-basics', name: 'Machine Learning Basics' },
      { id: 'data-prep', name: 'Data Preparation' },
      { id: 'model-eval', name: 'Model Evaluation' },
      { id: 'dim-reduction', name: 'Dimensionality Reduction' },
      { id: 'clustering', name: 'Clustering Algorithms' },
      { id: 'regression', name: 'Regression Techniques' },
      { id: 'classification', name: 'Classification Methods' },
      { id: 'deep-learning', name: 'Deep Learning Fundamentals' }
    ]
    
    setAvailableTopics(mockTopics)
    
    // Initialize selected topics with all available topics
    setSettings(prev => ({
      ...prev,
      topicsToInclude: mockTopics.map(topic => topic.id)
    }))
  }, [courseId])
  
  // Handle topic selection
  const handleTopicChange = (topicId: string, checked: boolean) => {
    setSettings(prev => {
      if (checked) {
        return {
          ...prev,
          topicsToInclude: [...prev.topicsToInclude, topicId]
        }
      } else {
        return {
          ...prev,
          topicsToInclude: prev.topicsToInclude.filter(id => id !== topicId)
        }
      }
    })
  }
  
  // Handle select all topics
  const handleSelectAllTopics = () => {
    setSettings(prev => ({
      ...prev,
      topicsToInclude: availableTopics.map(topic => topic.id)
    }))
  }
  
  // Handle clear all topics
  const handleClearAllTopics = () => {
    setSettings(prev => ({
      ...prev,
      topicsToInclude: []
    }))
  }
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      difficulty: value as 'easy' | 'medium' | 'hard' | 'mixed'
    }))
  }
  
  // Handle number of questions change
  const handleQuestionsChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      numberOfQuestions: parseInt(value)
    }))
  }
  
  // Handle time limit change
  const handleTimeLimitChange = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      timeLimit: value[0]
    }))
  }
  
  // Handle time limit toggle
  const handleTimeLimitToggle = (checked: boolean) => {
    setEnableTimeLimit(checked)
    setSettings(prev => ({
      ...prev,
      timeLimit: checked ? 15 : undefined
    }))
  }
  
  // Handle save settings
  const handleSaveSettings = () => {
    if (onSave) {
      onSave(settings)
    }
    
    // In a real app, save to API or localStorage
    localStorage.setItem(`practice-settings-${courseId}`, JSON.stringify(settings))
    
    // Show a success message
    alert('Settings saved successfully!')
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Settings</CardTitle>
        <CardDescription>
          Customize your practice sessions to focus on specific topics and difficulty levels.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Topics Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Topics</h3>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAllTopics}
                disabled={settings.topicsToInclude.length === availableTopics.length}
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearAllTopics}
                disabled={settings.topicsToInclude.length === 0}
              >
                Clear All
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableTopics.map(topic => (
              <div key={topic.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`topic-${topic.id}`} 
                  checked={settings.topicsToInclude.includes(topic.id)}
                  onCheckedChange={(checked) => 
                    handleTopicChange(topic.id, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`topic-${topic.id}`}
                  className="cursor-pointer text-base font-normal"
                >
                  {topic.name}
                </Label>
              </div>
            ))}
          </div>
          
          {settings.topicsToInclude.length === 0 && (
            <p className="text-sm text-red-500 mt-2">
              Please select at least one topic.
            </p>
          )}
        </div>
        
        <Separator />
        
        {/* Difficulty Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Difficulty Level</h3>
          
          <RadioGroup 
            value={settings.difficulty} 
            onValueChange={handleDifficultyChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
              <RadioGroupItem value="easy" id="difficulty-easy" />
              <Label htmlFor="difficulty-easy" className="cursor-pointer font-normal">
                <span className="font-medium text-green-600">Easy</span>
                <p className="text-xs text-gray-500 mt-1">
                  Focus on fundamental concepts and basic applications.
                </p>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
              <RadioGroupItem value="medium" id="difficulty-medium" />
              <Label htmlFor="difficulty-medium" className="cursor-pointer font-normal">
                <span className="font-medium text-yellow-600">Medium</span>
                <p className="text-xs text-gray-500 mt-1">
                  Balanced questions requiring deeper understanding.
                </p>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
              <RadioGroupItem value="hard" id="difficulty-hard" />
              <Label htmlFor="difficulty-hard" className="cursor-pointer font-normal">
                <span className="font-medium text-red-600">Hard</span>
                <p className="text-xs text-gray-500 mt-1">
                  Challenging questions testing advanced knowledge.
                </p>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
              <RadioGroupItem value="mixed" id="difficulty-mixed" />
              <Label htmlFor="difficulty-mixed" className="cursor-pointer font-normal">
                <span className="font-medium text-blue-600">Mixed</span>
                <p className="text-xs text-gray-500 mt-1">
                  Variety of difficulty levels for comprehensive practice.
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        {/* Session Options */}
        <div>
          <h3 className="text-lg font-medium mb-4">Session Options</h3>
          
          <div className="space-y-4">
            {/* Number of Questions */}
            <div>
              <Label htmlFor="question-count" className="text-base">
                Number of Questions
              </Label>
              <Select 
                value={settings.numberOfQuestions.toString()} 
                onValueChange={handleQuestionsChange}
              >
                <SelectTrigger id="question-count" className="mt-1.5">
                  <SelectValue placeholder="Select number of questions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 questions</SelectItem>
                  <SelectItem value="10">10 questions</SelectItem>
                  <SelectItem value="15">15 questions</SelectItem>
                  <SelectItem value="20">20 questions</SelectItem>
                  <SelectItem value="25">25 questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Time Limit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="time-limit-toggle" className="text-base">
                  Time Limit
                </Label>
                <Switch 
                  id="time-limit-toggle" 
                  checked={enableTimeLimit}
                  onCheckedChange={handleTimeLimitToggle}
                />
              </div>
              
              {enableTimeLimit && (
                <div className="pt-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">Time limit: {settings.timeLimit} minutes</span>
                  </div>
                  <Slider
                    value={settings.timeLimit ? [settings.timeLimit] : [15]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={handleTimeLimitChange}
                    disabled={!enableTimeLimit}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">5 min</span>
                    <span className="text-xs text-gray-500">60 min</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleSaveSettings}
          disabled={settings.topicsToInclude.length === 0}
        >
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PracticeSettings