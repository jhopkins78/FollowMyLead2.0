import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-4">
            About <span className="text-blue-600">FollowMyLead</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A cutting-edge lead qualification and scoring web application designed to simplify and optimize your sales pipeline.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">
            To empower businesses with smarter, faster, and more effective lead qualification and scoring solutions, enabling better decisions and improved outcomes.
          </p>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Will Pulice",
                role: "Project & Requirements Manager",
                education: "Master's in Technology Management, UC Santa Barbara | B.A. in Sociology, UC Santa Barbara",
                description: "Will leads our project planning and stakeholder management efforts with precision and foresight. With a dynamic background in sustainable farming and healthcare, he brings a unique, systems-oriented perspective to every project, ensuring its success from start to finish.",
                image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Will%20Pulice%20FACE-Mh0U22Y0aoIN9eqTZW4g1ewAFBwRTN.jpeg"
              },
              {
                name: "Gavin Pierce",
                role: "Data Engineer",
                education: "M.S. in Data Science, Stanford University | B.S. in Computer Science, UC Berkeley",
                description: "Gavin is the driving force behind our data processes. His extensive expertise in data engineering ensures that our models are powered by clean, reliable, and insightful datasets, laying a solid foundation for FollowMyLead's advanced capabilities.",
                image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gavin%20Face%20Pic-izih2JBni3OCScgsyJ4o5gEUKmkvrY.jpeg"
              },
              {
                name: "Mikayla Johnson",
                role: "Frontend & UI/UX Developer",
                education: "M.A. in Computer Science, University of Copenhagen | B.A. in Communication, UC Santa Barbara",
                description: "Mikayla crafts the sleek, user-friendly interfaces that make FollowMyLead a joy to use. Her blend of design creativity and technical skill ensures an exceptional user experience that is both intuitive and visually engaging.",
                image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mikayla%20Johnson-tH2XvAXRkHnBFh0y2wGnYMIc97z9FU.jpeg"
              },
              {
                name: "Joshua Rivera",
                role: "Machine Learning & Backend Engineer",
                education: "Ph.D. in Computer Science, MIT | M.S. in Artificial Intelligence, Carnegie Mellon University",
                description: "Joshua combines deep expertise in machine learning and backend development to power FollowMyLead's most innovative features. His forward-thinking approach ensures that our platform delivers exceptional performance and secure, reliable functionality.",
                image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Joshua%20Hopkins-czsFVju5Hh2bY4SZlk09pCm3u9onMs.jpeg"
              }
            ].map((member, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <Image
                    src={member.image || `/placeholder.svg?height=100&width=100&text=${member.name.split(' ').map(n => n[0]).join('')}`}
                    alt={member.name}
                    width={100}
                    height={100}
                    className="rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-sm text-blue-600 mb-2">{member.role}</p>
                  <p className="text-xs text-gray-500 mb-4">{member.education}</p>
                  <p className="text-sm text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why FollowMyLead Section */}
        <section className="mb-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why FollowMyLead?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smarter Insights",
                description: "Harness the power of data to make better lead qualification decisions."
              },
              {
                title: "Seamless Experience",
                description: "A sleek, intuitive interface designed for effortless use."
              },
              {
                title: "End-to-End Solutions",
                description: "From data engineering to deployment, we've got you covered."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Managing Leads Smarter Today!</h2>
          <p className="text-xl text-gray-600 mb-8">
            Ready to revolutionize your lead management process? Contact us to learn more about how FollowMyLead can transform your business.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg">
              <Link href="mailto:support@followmylead.com">Email Us</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="tel:+1234567890">Call (123) 456-7890</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
