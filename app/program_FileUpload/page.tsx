'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import { Button } from '@/frontend/src/components/ui/button'
import { useToast } from '@/frontend/src/components/ui/use-toast'
import { uploadLeads } from '@/frontend/src/services/api'

export default function ProgramFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      await uploadLeads(file)
      toast({
        title: "Success",
        description: "File uploaded successfully!",
      })
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.response?.data?.message || 'An error occurred during upload',
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }, [router, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  })

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Upload Leads
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Upload your CSV file containing lead information for scoring and analysis.
          </p>
        </div>

        <div className="mt-10">
          <div
            {...getRootProps()}
            className={`
              mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="flex text-sm text-muted-foreground">
                <input {...getInputProps()} />
                <p className="pl-1">
                  {isDragActive
                    ? 'Drop the CSV file here'
                    : 'Drag and drop a CSV file here, or click to select'}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">CSV files only</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  CSV Format Requirements
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Your CSV file should include the following columns:
                    name, email, phone (optional), company (optional)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
