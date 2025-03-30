"use client";

import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  MoreHorizontalIcon,
  DownloadIcon,
  PrinterIcon,
  Share2Icon,
  BookmarkIcon,
  PenSquareIcon,
  TrashIcon
} from 'lucide-react';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export function ActionButtons({
  onEdit,
  onDelete,
  onPrint,
  onDownload,
  onShare,
  onSave
}: ActionButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <div className="hidden sm:flex items-center space-x-1">
          {onSave && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onSave}>
                  <BookmarkIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {onShare && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onShare}>
                  <Share2Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {onPrint && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onPrint}>
                  <PrinterIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {onDownload && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onDownload}>
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          <div className="sm:hidden">
            {onSave && (
              <DropdownMenuItem onClick={onSave}>
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Save
              </DropdownMenuItem>
            )}
            
            {onShare && (
              <DropdownMenuItem onClick={onShare}>
                <Share2Icon className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
            )}
            
            {onPrint && (
              <DropdownMenuItem onClick={onPrint}>
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </DropdownMenuItem>
            )}
            
            {onDownload && (
              <DropdownMenuItem onClick={onDownload}>
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
          </div>
          
          {onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <PenSquareIcon className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          )}
          
          {onDelete && (
            <DropdownMenuItem 
              onClick={onDelete}
              className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}