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
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Document Generation",
      description: "Automatically generate and organize all required legal and government documents"
    }
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
      description: "Generate required legal documents"
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
                <a 
                  href="/onbroading"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
                >
                  Start Building Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <button className="border-2 border-purple-400 text-purple-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-400 hover:text-white transition-all duration-300 flex items-center justify-center">
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
    <div className='main-continer'>
      <Link to='/onbroading'>
        <button>build a business</button>
      </Link>
    </div>
  </>
  )
}

export default Main