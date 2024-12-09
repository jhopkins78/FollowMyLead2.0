import React from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowRight, BarChart2, Bell, Facebook, Linkedin, RefreshCw, Mail } from 'lucide-react'

export const Homepage: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">FollowMyLead</Link>
            <nav className="ml-10 hidden md:block">
              <ul className="flex space-x-4">
                <li><Link href="/features" className="text-gray-500 hover:text-blue-600">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-500 hover:text-blue-600">Pricing</Link></li>
                <li><Link href="/about" className="text-gray-500 hover:text-blue-600">About</Link></li>
              </ul>
            </nav>
          </div>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Log In
          </button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Qualify Your Leads. <span className="text-blue-600">Maximize Conversions.</span>
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              The smarter way to score and manage your sales leads.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <button
                  onClick={handleGetStarted}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started for Free
                </button>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="#about-us" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">Automated Lead Scoring</h3>
                <p className="mt-2 text-base text-gray-500">
                  Instantly evaluate and prioritize your leads based on custom criteria.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">Real-Time Insights</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get immediate notifications and analytics on your lead performance.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900">Seamless Updates</h3>
                <p className="mt-2 text-base text-gray-500">
                  Effortlessly sync and update lead information across your systems.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about-us" className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
              What Our Users Are Saying
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src="/placeholder.svg?height=48&width=48"
                        alt="Palash Chaturvedi"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">
                        "FollowMyLead has revolutionized our sales process. We've seen a 40% increase in conversion rates since implementing their lead scoring system."
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Palash Chaturvedi, CEO of SkillHub
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src="/placeholder.svg?height=48&width=48"
                        alt="Alexander Mintsa"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">
                        "The insights provided by FollowMyLead have been invaluable. Our team can now focus on the most promising leads, significantly improving our efficiency."
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Alexander Mintsa, CEO of SeedSprint
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src="/placeholder.svg?height=48&width=48"
                        alt="Calvin Blais"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">
                        "FollowMyLead's automated lead scoring has been a game-changer for our sales team. We're closing deals faster and more efficiently than ever before."
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Calvin Blais, CEO of NAUTY
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src="/placeholder.svg?height=48&width=48"
                        alt="Josh Nelson"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">
                        "As a startup, every lead counts. FollowMyLead has helped us prioritize our efforts and maximize our limited resources. It's been crucial to our early success."
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Josh Nelson, CEO of Media Bias Analyzer Startup
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center space-x-6">
            <Link href="https://www.linkedin.com/company/ucsb-technology-management/mycompany/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link href="https://www.facebook.com/ucsbmtm/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="mailto:tmp@tmp.ucsb.edu" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Email</span>
              <Mail className="h-6 w-6" />
            </Link>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2024 FollowMyLead. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Homepage
