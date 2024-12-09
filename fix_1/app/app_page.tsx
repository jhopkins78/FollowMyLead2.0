import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bell, RefreshCw, BarChart } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold text-primary">
            FollowMyLead
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/features" className="text-gray-600 hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-primary">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary">
              About
            </Link>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Qualify Your Leads. Maximize Conversions.
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The smarter way to score and manage your sales leads.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started for Free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/learn-more">Learn More</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 border rounded-lg">
            <BarChart className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-4">Automated Lead Scoring</h2>
            <p className="text-gray-600">
              Instantly evaluate and prioritize your leads based on custom criteria.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <Bell className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-4">Real-Time Insights</h2>
            <p className="text-gray-600">
              Get immediate notifications and analytics on your lead performance.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <RefreshCw className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-4">Seamless Updates</h2>
            <p className="text-gray-600">
              Effortlessly sync and update lead information across your systems.
            </p>
          </div>
        </div>

        <div className="border-t pt-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Are Saying
          </h2>
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-center">
              <p className="text-xl text-gray-600 mb-4">
                "FollowMyLead has revolutionized our sales process. We've seen a 40% increase in conversion rates since implementing their lead scoring system."
              </p>
              <footer className="text-gray-500">
                CEO of SkillHub
              </footer>
            </blockquote>
          </div>
        </div>
      </main>
    </div>
  )
}

