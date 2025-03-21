// src/components/application-management/FaqManagement.tsx
'use client'

import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  FileQuestion, 
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react"
import { AddFaqDialog } from "./faq/AddFaqDialog"
import { EditFaqDialog } from "./faq/EditFaqDialog"
import { motion } from "framer-motion"

interface Faq {
  id: string
  question: string
  answer: string
  category: string
  status: 'published' | 'draft'
  order: number
  dateAdded: string
  lastUpdated: string
}

// Sample FAQ data
const FAQS_DATA: Faq[] = [
  {
    id: "1",
    question: "How do I access the course materials?",
    answer: "Course materials are available in the 'Materials' section of each course. You can access them by navigating to your enrolled courses and selecting the specific course. Materials are organized by modules and topics for easy access.",
    category: "Courses",
    status: "published",
    order: 1,
    dateAdded: "2025-01-15T10:30:00Z",
    lastUpdated: "2025-01-15T10:30:00Z"
  },
  {
    id: "2",
    question: "What should I do if I forgot my password?",
    answer: "If you forgot your password, click on the 'Forgot password' link on the login page. You will receive an email with instructions to reset your password. Make sure to check your spam folder if you don't see the email in your inbox.",
    category: "Account",
    status: "published",
    order: 1,
    dateAdded: "2025-01-10T15:45:00Z",
    lastUpdated: "2025-02-05T09:20:00Z"
  },
  {
    id: "3",
    question: "How are exam questions structured?",
    answer: "Exam questions are structured based on the course materials and objectives. They may include multiple-choice, short answer, essay, or practical problems. The specific format will be communicated by your instructor before the exam. Practice questions are available in each course section.",
    category: "Exams",
    status: "published",
    order: 1,
    dateAdded: "2025-01-18T11:15:00Z",
    lastUpdated: "2025-01-18T11:15:00Z"
  },
  {
    id: "4",
    question: "Can I download lecture slides for offline use?",
    answer: "Yes, most lecture slides and materials can be downloaded for offline use. Look for the download icon next to each material. Note that some interactive content may only be available online. Downloaded materials are for personal use only and should not be redistributed.",
    category: "Courses",
    status: "published",
    order: 2,
    dateAdded: "2025-01-20T14:30:00Z",
    lastUpdated: "2025-01-20T14:30:00Z"
  },
  {
    id: "5",
    question: "What file formats are supported for assignment submissions?",
    answer: "The system supports various file formats for assignment submissions including PDF, DOCX, XLSX, CSV, PNG, JPG, and ZIP. The maximum file size is 50MB. Specific assignment instructions may indicate preferred formats. For code submissions, Python (PY), Jupyter Notebooks (IPYNB), and R scripts (R) are supported.",
    category: "Assignments",
    status: "published",
    order: 1,
    dateAdded: "2025-01-25T09:45:00Z",
    lastUpdated: "2025-02-10T11:30:00Z"
  },
  {
    id: "6",
    question: "How do I contact my instructor?",
    answer: "You can contact your instructor through the messaging system within the course page. Simply navigate to your course, click on 'Instructor Contact' and compose your message. Alternatively, instructor email addresses are provided in the course information section.",
    category: "Courses",
    status: "published",
    order: 3,
    dateAdded: "2025-02-01T13:15:00Z",
    lastUpdated: "2025-02-01T13:15:00Z"
  },
  {
    id: "7",
    question: "Are there any system requirements for using the platform?",
    answer: "The platform works best with up-to-date browsers like Chrome, Firefox, Safari, or Edge. We recommend having a stable internet connection and at least 4GB of RAM. For some courses with computational components, specific requirements will be listed in the course description.",
    category: "Technical",
    status: "published",
    order: 1,
    dateAdded: "2025-02-05T10:20:00Z",
    lastUpdated: "2025-02-05T10:20:00Z"
  },
  {
    id: "8",
    question: "How are grades calculated?",
    answer: "Grade calculation varies by course and is detailed in each course syllabus. Generally, grades are weighted based on assignments, quizzes, participation, and exams. You can view your current grades and assessment feedback in the 'Grades' section of each course.",
    category: "Exams",
    status: "draft",
    order: 2,
    dateAdded: "2025-02-08T16:50:00Z",
    lastUpdated: "2025-02-15T14:10:00Z"
  },
  {
    id: "9",
    question: "How do I enroll in additional courses?",
    answer: "To enroll in additional courses, go to the 'Course Catalog' section from your dashboard. Browse available courses and click 'Enroll' for the ones you're interested in. Some courses may require approval or have prerequisites, which will be indicated on the course description page.",
    category: "Courses",
    status: "draft",
    order: 4,
    dateAdded: "2025-02-12T11:30:00Z",
    lastUpdated: "2025-02-12T11:30:00Z"
  }
];

// FAQ categories
const FAQ_CATEGORIES = ['All', 'Account', 'Courses', 'Exams', 'Assignments', 'Technical'];

export function FaqManagement() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddFaqDialogOpen, setIsAddFaqDialogOpen] = useState<boolean>(false)
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null)
  const [isEditFaqDialogOpen, setIsEditFaqDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  
  // Filter FAQs based on search term and filters
  const filteredFaqs = FAQS_DATA.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'All' || faq.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || faq.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })
  
  // Sort FAQs by category and then by order
  const sortedFaqs = [...filteredFaqs].sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.order - b.order;
  });
  
  // Group FAQs by category
  const faqsByCategory: Record<string, Faq[]> = {}
  sortedFaqs.forEach(faq => {
    if (!faqsByCategory[faq.category]) {
      faqsByCategory[faq.category] = []
    }
    faqsByCategory[faq.category].push(faq)
  })
  
  // Format date for readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }
  
  // Open edit FAQ dialog
  const handleEditFaq = (faq: Faq) => {
    setSelectedFaq(faq)
    setIsEditFaqDialogOpen(true)
  }
  
  // Open delete confirmation dialog
  const handleDeleteFaq = (id: string) => {
    setDeletingFaqId(id)
    setIsDeleteDialogOpen(true)
  }
  
  // Delete FAQ
  const confirmDelete = () => {
    if (!deletingFaqId) return
    
    setIsDeleting(true)
    
    // Simulate API call
    setTimeout(() => {
      // In real implementation, this would be an API call
      console.log(`Deleting FAQ with ID: ${deletingFaqId}`)
      
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setDeletingFaqId(null)
    }, 1000)
  }
  
  // Move FAQ up or down in order
  const moveFaqOrder = (faq: Faq, direction: 'up' | 'down') => {
    console.log(`Moving FAQ ${faq.id} ${direction}`)
    // In real implementation, this would be an API call to update order
  }
  
  // Toggle FAQ status (published/draft)
  const toggleFaqStatus = (faq: Faq) => {
    const newStatus = faq.status === 'published' ? 'draft' : 'published'
    console.log(`Changing FAQ ${faq.id} status to ${newStatus}`)
    // In real implementation, this would be an API call
  }

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <motion.div variants={cardVariants}>
        <h1 className="text-3xl font-bold tracking-tight">FAQ Management</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage frequently asked questions and their categories.
        </p>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Manage questions and answers displayed to users
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddFaqDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {Object.keys(faqsByCategory).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(faqsByCategory).map(([category, faqs]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-lg font-medium">{category}</h3>
                    
                    <div className="space-y-3">
                      {faqs.map((faq) => (
                        <Card key={faq.id} className="overflow-hidden">
                          <div className="p-4 sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <FileQuestion className="h-5 w-5 text-primary" />
                                <h4 className="text-base font-medium">{faq.question}</h4>
                              </div>
                              <div className="flex items-center">
                                <Badge variant="outline" className={faq.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                                  {faq.status === 'published' ? 'Published' : 'Draft'}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleEditFaq(faq)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Question
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toggleFaqStatus(faq)}>
                                      {faq.status === 'published' ? (
                                        <>
                                          <EyeOff className="h-4 w-4 mr-2" />
                                          Set to Draft
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="h-4 w-4 mr-2" />
                                          Publish
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => moveFaqOrder(faq, 'up')}>
                                      <ChevronUp className="h-4 w-4 mr-2" />
                                      Move Up
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => moveFaqOrder(faq, 'down')}>
                                      <ChevronDown className="h-4 w-4 mr-2" />
                                      Move Down
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteFaq(faq.id)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            
                            <div className="pl-7 text-sm text-muted-foreground">
                              <p className="whitespace-pre-line">{faq.answer}</p>
                            </div>
                            
                            <div className="mt-4 pl-7 flex flex-wrap items-center text-xs text-muted-foreground gap-x-4 gap-y-1">
                              <span>Added: {formatDate(faq.dateAdded)}</span>
                              <span>Last updated: {formatDate(faq.lastUpdated)}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No FAQs Found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm || categoryFilter !== 'All' || statusFilter !== 'all'
                    ? "Try adjusting your search or filters."
                    : "Create new questions to get started."
                  }
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('')
                    setCategoryFilter('All')
                    setStatusFilter('all')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
          {filteredFaqs.length > 0 && (
            <CardFooter className="text-xs text-muted-foreground">
              <div>
                Showing {filteredFaqs.length} of {FAQS_DATA.length} FAQs
              </div>
            </CardFooter>
          )}
        </Card>
      </motion.div>

      {/* Add FAQ Dialog */}
      <AddFaqDialog
        open={isAddFaqDialogOpen}
        onOpenChange={setIsAddFaqDialogOpen}
        categories={FAQ_CATEGORIES.filter(c => c !== 'All')}
      />

      {/* Edit FAQ Dialog */}
      {selectedFaq && (
        <EditFaqDialog
          open={isEditFaqDialogOpen}
          onOpenChange={setIsEditFaqDialogOpen}
          faq={selectedFaq}
          categories={FAQ_CATEGORIES.filter(c => c !== 'All')}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}