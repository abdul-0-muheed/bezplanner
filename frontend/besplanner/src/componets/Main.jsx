import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getuid } from './getuid'
import { 
  Building2, 
  FileText, 
  Calculator, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Clock,
  Star,
  Menu,
  X,
  PlayCircle,
  Zap,
  Award,
  BookOpen
} from 'lucide-react'

function Main() {
   useEffect(() => {
    axios.get(`https://guild-to-business.onrender.com`)
      .then(response => {
        console.log(response.data); // Access the data from the response
      })
      .catch(error => {
        console.error("Error fetching data:", error); // Log the actual error
      });
  }, []); // Add empty dependency array to prevent infinite loop
  
  const uid =getuid()
  console.log(uid)

   const features = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Step-by-Step Business Setup",
      description: "Guided process to help you establish your business from idea to legal entity formation"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Legal Compliance Made Easy",
      description: "Navigate complex legal requirements with confidence and ensure full compliance"
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Tax Optimization Strategies",
      description: "Minimize your tax burden with personalized strategies based on your business type"
    },
    
  ]

  const upcomingFeatures = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "AI Legal Assistant",
      description: "Get instant answers to business and legal questions"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "CA Tools Integration",
      description: "Professional bookkeeping and financial planning assistance"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Document Generation",
      description: "Automatically generate and organize all required legal and government documents"
    }
    
  ]
const steps = [
    {
      number: "01",
      title: "Business Analysis",
      description: "Tell us about your business idea and goals"
    },
    {
      number: "02", 
      title: "Legal Structure",
      description: "Choose the right business entity type"
    },
    {
      number: "03",
      title: "Documentation",
      description: "Suggest required legal documents"
    },
    {
      number: "04",
      title: "Compliance Setup",
      description: "Ensure all regulatory requirements are met"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tech Startup Founder",
      content: "This platform made starting my SaaS company incredibly straightforward. The legal compliance guidance saved me thousands in lawyer fees.",
      rating: 5
    },
    {
      name: "Michael Chen", 
      role: "E-commerce Entrepreneur",
      content: "The tax optimization strategies alone paid for itself. I wish I had found this before starting my first business.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Consulting Business Owner", 
      content: "The document generation feature is a game-changer. Everything I needed was created automatically and professionally formatted.",
      rating: 5
    }
  ]
  

  
  return (<>
     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Business Formation
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Launch Your 
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Dream Business</span> 
                with Confidence
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                From idea to legal entity in days, not months. Get step-by-step guidance, 
                ensure legal compliance, minimize taxes, and generate all required documents 
                automatically.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to='/onbroading'>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group">Start Building Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></button>
                </Link>
                <button className="border-2 border-purple-400 text-purple-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-400 cursor-not-allowed hover:text-white transition-all duration-300 flex items-center justify-center ">
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start mt-8 space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  No hidden fees
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Legal compliance guaranteed
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/30">
                <img 
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Business formation dashboard"
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                <Award className="w-4 h-4 inline mr-1" />
                Trusted by 10k+ entrepreneurs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-purple-400 mb-2">10,000+</div>
              <div className="text-gray-300">Businesses Launched</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">7 Days</div>
              <div className="text-gray-300">Average Setup Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-300">Compliance Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400 mb-2">$50K+</div>
              <div className="text-gray-300">Average Tax Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Everything You Need to 
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Launch & Scale</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform handles every aspect of business formation, 
              so you can focus on what matters most - growing your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group hover:transform hover:scale-105">
                <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Coming Soon Features */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              Coming Soon
            </h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {upcomingFeatures.map((feature, index) => (
                <div key={index} className="bg-slate-800/30 p-6 rounded-xl border border-purple-500/10 flex items-center space-x-4">
                  <div className="text-purple-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our streamlined process takes you from business idea to fully compliant entity in just four simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform translate-x-8"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href="/onbroading"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Trusted by Entrepreneurs
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of successful business owners who chose our platform to launch their dreams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 p-8 rounded-2xl border border-purple-500/20">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-purple-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build Your Business Empire?
          </h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Join thousands of entrepreneurs who have successfully launched their businesses with our platform. 
            Your dream business is just one click away.
          </p>

          <Link to='/onbroading'>
            <button className="bg-white text-purple-600 px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center shadow-2xl">Start Building Your Business <ArrowRight className="ml-3 w-6 h-6" /></button>
          </Link>
          
          <div className="flex items-center justify-center mt-8 space-x-6 text-purple-100">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Setup in 7 days
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              100% Compliant
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Tax Optimized
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <Building2 className="w-8 h-8 text-purple-400 mr-2" />
            <span className="text-2xl font-bold text-white">BizLaunch</span>
          </div>
          
          <div className="text-center text-gray-400">
            <p className="mb-4">Empowering entrepreneurs to build successful businesses with confidence.</p>
            <p>&copy; 2025 BizLaunch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  </>
  )
}

export default Main