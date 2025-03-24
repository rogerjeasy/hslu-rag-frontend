'use client'

import { useFileUpload } from './FileUploadContext'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  BookOpen, 
  Code, 
  FileText, 
  Presentation, 
  FileQuestion 
} from 'lucide-react'

export function MaterialMetadataForm() {
  const { 
    materialType, 
    setMaterialType, 
    materialTitle,
    setMaterialTitle,
    materialDescription,
    setMaterialDescription,
    selectedModuleId,
    setSelectedModule,
    selectedTopicId,
    setSelectedTopic
  } = useFileUpload()
  
  // Material type options
  const materialTypes = [
    { value: 'lecture', label: 'Lecture', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'lab', label: 'Lab Exercise', icon: <Code className="h-4 w-4" /> },
    { value: 'exam', label: 'Exam', icon: <FileText className="h-4 w-4" /> },
    { value: 'slides', label: 'Slides', icon: <Presentation className="h-4 w-4" /> },
    { value: 'exercise', label: 'Exercise', icon: <FileQuestion className="h-4 w-4" /> }
  ]
  
  // Dummy modules and topics - these would be fetched based on selected course
  const modules = [
    { id: 'module-1', name: 'Module 1: Introduction' },
    { id: 'module-2', name: 'Module 2: Data Preparation' },
    { id: 'module-3', name: 'Module 3: Analysis' }
  ]
  
  const topics = [
    { id: 'topic-1', name: 'Topic 1: Overview' },
    { id: 'topic-2', name: 'Topic 2: Methods' },
    { id: 'topic-3', name: 'Topic 3: Implementation' }
  ]

  // Handle module selection
  const handleModuleChange = (value: string) => {
    // If "none" is selected, pass null to indicate no selection
    setSelectedModule(value === "none" ? null : value);
  }

  // Handle topic selection
  const handleTopicChange = (value: string) => {
    // If "none" is selected, pass null to indicate no selection
    setSelectedTopic(value === "none" ? null : value);
  }
  
  return (
    <div className="space-y-4 pt-2">
      <h3 className="text-sm font-medium">Material Metadata</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Material title */}
        <div className="space-y-2">
          <Label htmlFor="material-title">Title (Optional)</Label>
          <Input
            id="material-title"
            placeholder="Enter a title for the material"
            value={materialTitle}
            onChange={e => setMaterialTitle(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Leave blank to use filename as title
          </p>
        </div>
        
        {/* Material type */}
        <div className="space-y-2">
          <Label htmlFor="material-type">Material Type</Label>
          <Select 
            value={materialType} 
            onValueChange={setMaterialType}
          >
            <SelectTrigger id="material-type">
              <SelectValue placeholder="Select material type" />
            </SelectTrigger>
            <SelectContent>
              {materialTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    {type.icon}
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module */}
        <div className="space-y-2">
          <Label htmlFor="module">Module (Optional)</Label>
          <Select 
            value={selectedModuleId || 'none'} 
            onValueChange={handleModuleChange}
          >
            <SelectTrigger id="module">
              <SelectValue placeholder="Select a module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {modules.map(module => (
                <SelectItem key={module.id} value={module.id}>
                  {module.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Topic */}
        <div className="space-y-2">
          <Label htmlFor="topic">Topic (Optional)</Label>
          <Select 
            value={selectedTopicId || 'none'} 
            onValueChange={handleTopicChange}
          >
            <SelectTrigger id="topic">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {topics.map(topic => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter a description for the material"
          value={materialDescription}
          onChange={e => setMaterialDescription(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  )
}