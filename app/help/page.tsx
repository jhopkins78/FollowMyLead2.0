'use client'

import React, { useState } from 'react'
import { User, ChevronDown, ChevronUp, Linkedin, Facebook, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

export default function HelpAndSupport() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null)
  const { toast } = useToast()

  const faqs = [
    { 
      question: "How do I add a new lead?", 
      answer: "To add a new lead, navigate to the 'Leads' section and click on the 'Add New Lead' button. Fill in the required information and click 'Save' to create the lead." 
    },
    { 
      question: "How do I interpret lead scores?", 
      answer: "Lead scores are calculated based on various factors such as engagement, demographics, and behavior. A higher score indicates a more qualified lead. Scores typically range from 0-100, with 100 being the most qualified." 
    },
    { 
      question: "Can I customize the scoring criteria?", 
      answer: "Yes, you can customize scoring criteria in the 'Settings' section. Look for 'Lead Scoring Rules' where you can adjust weights for different factors and add custom rules." 
    },
    { 
      question: "How often are lead scores updated?", 
      answer: "Lead scores are updated in real-time as new data comes in. However, bulk updates for all leads occur nightly to ensure optimal system performance." 
    },
    { 
      question: "How can I export my leads data?", 
      answer: "To export leads data, go to the 'Leads' section, select the leads you want to export, and click on the 'Export' button. You can choose between CSV and Excel formats for your export." 
    }
  ]

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the support request to your API
    toast({
      title: "Support Request Sent",
      description: "We'll get back to you as soon as possible.",
    })
  }

  const handleFeedbackSubmit = () => {
    if (!feedbackRating) {
      toast({
        title: "Error",
        description: "Please select a rating before submitting feedback.",
        variant: "destructive",
      })
      return
    }
    // Here you would typically send the feedback to your API
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">FollowMyLead</Link>
            <nav className="ml-10 hidden md:block">
              <ul className="flex space-x-4">
                <li><Link href="/dashboard" className="text-gray-500 hover:text-blue-600">Dashboard</Link></li>
                <li><Link href="/about" className="text-gray-500 hover:text-blue-600">About</Link></li>
                <li><Link href="/help" className="text-blue-600 font-medium">Help</Link></li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Help & Support</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <Card key={index} className="cursor-pointer">
                <CardContent className="p-4" onClick={() => toggleFaq(index)}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                    {expandedFaq === index ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                  </div>
                  {expandedFaq === index && (
                    <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Support</h2>
          <Card>
            <CardContent className="p-6">
              <form className="space-y-4" onSubmit={handleSupportSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <Input type="text" id="name" name="name" className="mt-1" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <Input type="email" id="email" name="email" className="mt-1" required />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <Textarea id="message" name="message" rows={4} className="mt-1" required />
                </div>
                <Button type="submit">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Feedback</h2>
          <Card>
            <CardContent className="p-6">
              <p className="mb-4">How would you rate your experience with FollowMyLead?</p>
              <div className="flex space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={feedbackRating === rating ? "default" : "outline"}
                    onClick={() => setFeedbackRating(rating)}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
              <Textarea placeholder="Any additional comments?" className="mb-4" />
              <Button onClick={handleFeedbackSubmit}>Submit Feedback</Button>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Help Resources</h2>
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-muted-foreground mb-4">Watch our video tutorials to learn how to use FollowMyLead effectively.</p>
                <Button>Watch Videos</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="mailto:contact@followmylead.com" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Email</span>
              <Mail className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2024 FollowMyLead. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
