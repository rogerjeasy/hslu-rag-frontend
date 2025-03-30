// "use client";

// import React from 'react';
// import { format, formatDistanceToNow } from 'date-fns';
// import { Calendar, Clock, Award } from 'lucide-react';
// import { QuestionSetSummary, QuestionType } from '@/types/practice-questions.types';
// import { DifficultyBadge } from '@/components/practice-questions/DifficultyBadge';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import { Badge } from '@/components/ui/badge';
// import { QuestionTypeBadge } from '../QuestionTypeBadge';
// import { motion } from 'framer-motion';
// import Link from 'next/link';

// interface HistoryListProps {
//   questionSets: QuestionSetSummary[];
//   getCourseInfo: (courseId: string) => { id: string; name: string; color: string } | null;
//   showScore?: boolean;
// }

// export function HistoryList({ questionSets, getCourseInfo, showScore = false }: HistoryListProps) {
//   // Helper function to format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return format(date, 'MMM d, yyyy');
//   };

//   // Helper function to get relative time
//   const getRelativeTime = (dateString: string) => {
//     const date = new Date(dateString);
//     return formatDistanceToNow(date, { addSuffix: true });
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {questionSets.map((questionSet, index) => {
//         const courseInfo = getCourseInfo(questionSet.courseId);
        
//         // Generate a random score for demo purposes
//         // In a real app, this would come from your data
//         const randomScore = Math.floor(Math.random() * (100 - 65) + 65);
        
//         return (
//           <motion.div
//             key={questionSet.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: index * 0.05 }}
//           >
//             <Link href={`/practice-questions/${questionSet.id}`} passHref>
//               <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 cursor-pointer flex flex-col">
//                 <CardHeader className="pb-2">
//                   <div className="flex justify-between items-start">
//                     <div className="space-y-1">
//                       {courseInfo && (
//                         <Badge 
//                           variant="outline" 
//                           className="mb-1 font-normal text-xs border-0 px-2"
//                           style={{ 
//                             backgroundColor: `${courseInfo.color}20`, 
//                             color: courseInfo.color 
//                           }}
//                         >
//                           {courseInfo.name}
//                         </Badge>
//                       )}
//                       <CardTitle className="line-clamp-1">{questionSet.title}</CardTitle>
//                     </div>
                    
//                     {/* Display score for completed sets */}
//                     {showScore && (
//                       <div className="flex items-center bg-secondary/50 rounded-full py-1 px-3 text-sm font-medium">
//                         <Award className="h-3.5 w-3.5 mr-1 text-yellow-600 dark:text-yellow-400" />
//                         {randomScore}%
//                       </div>
//                     )}
//                   </div>
                  
//                   {questionSet.description && (
//                     <CardDescription className="line-clamp-2 mt-1">
//                       {questionSet.description}
//                     </CardDescription>
//                   )}
//                 </CardHeader>
                
//                 <CardContent className="pb-3 pt-0 flex-grow">
//                   <div className="flex flex-wrap gap-1.5 mt-2">
//                     <DifficultyBadge difficulty={questionSet.difficulty} className="text-xs font-normal" />
                    
//                     {/* Show only up to 2 question types directly, rest in tooltip */}
//                     {questionSet.types.slice(0, 2).map((type) => (
//                       <QuestionTypeBadge key={type} type={type} />
//                     ))}
                    
//                     {questionSet.types.length > 2 && (
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Badge variant="outline" className="text-xs font-normal">
//                               +{questionSet.types.length - 2} more
//                             </Badge>
//                           </TooltipTrigger>
//                           <TooltipContent>
//                             <p>
//                               {questionSet.types
//                                 .slice(2)
//                                 .map((type) => {
//                                   switch (type) {
//                                     case QuestionType.MULTIPLE_CHOICE: return "Multiple Choice";
//                                     case QuestionType.SHORT_ANSWER: return "Short Answer";
//                                     case QuestionType.TRUE_FALSE: return "True/False";
//                                     case QuestionType.FILL_IN_BLANK: return "Fill in Blank";
//                                     case QuestionType.MATCHING: return "Matching";
//                                     default: return type;
//                                   }
//                                 })
//                                 .join(", ")}
//                             </p>
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     )}
//                   </div>
//                 </CardContent>
                
//                 <CardFooter className="pt-0 border-t flex justify-between items-center text-xs text-muted-foreground">
//                   <div className="flex items-center">
//                     <Calendar className="h-3.5 w-3.5 mr-1" />
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger>
//                           <span>{formatDate(questionSet.createdAt)}</span>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>{format(new Date(questionSet.createdAt), 'PPPP')}</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </div>
                  
//                   <div className="flex items-center">
//                     <Clock className="h-3.5 w-3.5 mr-1" />
//                     <span>{getRelativeTime(questionSet.createdAt)}</span>
//                   </div>
//                 </CardFooter>
//               </Card>
//             </Link>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// }