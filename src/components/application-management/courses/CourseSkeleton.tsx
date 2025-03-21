// src/components/application-management/courses/CourseSkeleton.tsx
'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function CourseSkeleton() {
  // Create an array with placeholder items for skeleton rows
  const skeletonRows = Array.from({ length: 5 }, (_, i) => i)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">
            <Skeleton className="h-4 w-24" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-40" />
          </TableHead>
          <TableHead className="hidden md:table-cell">
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead className="hidden md:table-cell">
            <Skeleton className="h-4 w-16" />
          </TableHead>
          <TableHead className="hidden lg:table-cell">
            <Skeleton className="h-4 w-16" />
          </TableHead>
          <TableHead className="hidden lg:table-cell">
            <Skeleton className="h-4 w-24" />
          </TableHead>
          <TableHead className="text-right">
            <Skeleton className="h-4 w-12 ml-auto" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skeletonRows.map((index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-full max-w-[200px]" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              <Skeleton className="h-4 w-8" />
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-8 w-8 rounded-full ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}