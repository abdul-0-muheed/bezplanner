import React, { useState, useEffect } from 'react'
import { 
  MessageCircle, 
  FileText, 
  Briefcase, 
  Calculator, 
  PieChart, 
  BarChart3, 
  ArrowLeft, 
  Clock, 
  Star,
  CheckCircle,
  Zap,
  Users,
  Brain,
  Shield,
  TrendingUp,
  Bot,
  Building2,
  Calendar,
  Bell,
  Sparkles
} from 'lucide-react'

function Dashboard() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      id: 1,
      icon: <Bot className="w-12 h-12" />,
      title: "AI Lawyer Chatbot",
      subtitle: "Intelligent Legal Guidance",
      description: "Get instant, personalized legal advice based on your specific business details. Our AI lawyer analyzes your business structure, industry requirements, and provides tailored solutions to complex legal problems.",
      benefits: [
        "24/7 instant legal consultations",
        "Business-specific legal guidance",
        "Cost-effective alternative to traditional lawyers",
        "Multi-language support"
      ],
      badge: "AI Powered",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-500/10 border-blue-500/20",
      comingSoon: "Q3 2025"
    },
    {
      id: 2,
      icon: <FileText className="w-12 h-12" />,
      title: "Smart Document Generator",
      subtitle: "Legal Documents & Agreements",
      description: "Automatically generate professional legal documents and agreements tailored to your business needs. From contracts to NDAs, employment agreements to partnership documents.",
      benefits: [
        "100+ legal document templates",
        "Industry-specific customization",
        "Legal compliance verification",
        "Digital signature integration"
      ],
      badge: "Document Suite",
      color: "from-green-500 to-teal-600",
      bgColor: "bg-green-500/10 border-green-500/20",
      comingSoon: "Q3 2025"
    },
    {
      id: 3,
      icon: <Briefcase className="w-12 h-12" />,
      title: "Business Advisory Hub",
      subtitle: "Strategic Business Guidance",
      description: "Access expert business advisory services including strategic planning, market analysis, growth strategies, and operational optimization recommendations.",
      benefits: [
        "Strategic planning assistance",
        "Market analysis and insights",
        "Growth opportunity identification",
        "Risk assessment and mitigation"
      ],
      badge: "Expert Advisory",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10 border-orange-500/20",
      comingSoon: "Q4 2025"
    },
    {
      id: 4,
      icon: <Calculator className="w-12 h-12" />,
      title: "Management Accounting",
      subtitle: "Advanced Financial Management",
      description: "Comprehensive management accounting tools including cost analysis, budgeting, forecasting, and performance metrics to help you make informed business decisions.",
      benefits: [
        "Cost center analysis",
        "Budget planning and tracking",
        "Financial forecasting",
        "Performance KPI dashboards"
      ],
      badge: "Financial Intelligence",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10 border-purple-500/20",
      comingSoon: "Q4 2025"
    },
    {
      id: 5,
      icon: <PieChart className="w-12 h-12" />,
      title: "Smart Accounting Suite",
      subtitle: "Automated Bookkeeping",
      description: "Full-featured accounting system with automated bookkeeping, expense tracking, invoice generation, and tax preparation integrated with your business setup.",
      benefits: [
        "Automated transaction categorization",
        "Real-time financial reporting",
        "Tax preparation assistance",
        "Multi-currency support"
      ],
      badge: "CA Approved",
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-500/10 border-indigo-500/20",
      comingSoon: "Q1 2026"
    },
    {
      id: 6,
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Multi-Business Dashboard",
      subtitle: "Centralized Business Management",
      description: "Manage multiple businesses from a single, beautiful dashboard. Track performance, compare metrics, and get insights across all your business ventures.",
      benefits: [
        "Unified business overview",
        "Cross-business analytics",
        "Centralized notifications",
        "Custom reporting tools"
      ],
      badge: "Enterprise Ready",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10 border-cyan-500/20",
      comingSoon: "Q1 2026"
    }
  ]

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "50,000+", label: "Beta Testers Registered" },
    { icon: <Brain className="w-6 h-6" />, value: "95%", label: "AI Accuracy Rate" },
    { icon: <Clock className="w-6 h-6" />, value: "24/7", label: "Support Availability" },
    { icon: <Shield className="w-6 h-6" />, value: "100%", label: "Security Compliance" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Coming Soon - Revolutionary Features
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              The Future of 
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Business Management</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're building the most comprehensive business platform ever created. From AI-powered legal advice 
              to advanced accounting tools, everything you need to run successful businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center">
                <Calendar className="mr-2 w-5 h-5" />
                Join Early Access
              </button>
              
              <div className="flex items-center text-gray-300">
                <Clock className="w-5 h-5 mr-2 text-purple-400" />
                <span>First features launching Q3 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-12 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-purple-400 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Upcoming Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Six revolutionary features that will transform how you manage and grow your business
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.id}
                className={`${feature.bgColor} p-8 rounded-3xl border backdrop-blur-sm transition-all duration-500 hover:scale-105 cursor-pointer ${
                  activeFeature === index ? 'ring-2 ring-purple-400 shadow-2xl' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl text-white`}>
                    {feature.icon}
                  </div>
                  <div className="text-right">
                    <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium mb-2">
                      {feature.badge}
                    </div>
                    <div className="text-gray-400 text-sm">{feature.comingSoon}</div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-300 font-medium mb-4">{feature.subtitle}</p>
                <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>

                <div className="space-y-3">
                  <h4 className="text-white font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    Key Benefits
                  </h4>
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center text-gray-300">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Development Timeline</h2>
            <p className="text-xl text-gray-300">Stay updated with our feature release schedule</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-blue-500"></div>
            
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <div className="flex-1 text-right pr-8">
                  <div className="bg-slate-800 p-6 rounded-2xl border border-purple-500/20">
                    <h3 className="text-xl font-bold text-white mb-2">Q3 2025</h3>
                    <p className="text-gray-300">AI Lawyer Chatbot & Document Generator</p>
                  </div>
                </div>
                <div className="w-6 h-6 bg-purple-500 rounded-full border-4 border-slate-900 z-10"></div>
                <div className="flex-1 pl-8"></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 pr-8"></div>
                <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-slate-900 z-10"></div>
                <div className="flex-1 text-left pl-8">
                  <div className="bg-slate-800 p-6 rounded-2xl border border-blue-500/20">
                    <h3 className="text-xl font-bold text-white mb-2">Q4 2025</h3>
                    <p className="text-gray-300">Business Advisory & Management Accounting</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 text-right pr-8">
                  <div className="bg-slate-800 p-6 rounded-2xl border border-cyan-500/20">
                    <h3 className="text-xl font-bold text-white mb-2">Q1 2026</h3>
                    <p className="text-gray-300">Accounting Suite & Multi-Business Dashboard</p>
                  </div>
                </div>
                <div className="w-6 h-6 bg-cyan-500 rounded-full border-4 border-slate-900 z-10"></div>
                <div className="flex-1 pl-8"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Be Among the First to Experience the Future
          </h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Join our early access program and get exclusive previews, beta testing opportunities, 
            and special pricing when these features launch.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center shadow-2xl">
              <Zap className="mr-3 w-6 h-6" />
              Join Early Access
            </button>
            
            <button className="border-2 border-white text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-white hover:text-purple-600 transition-all duration-300 inline-flex items-center">
              <MessageCircle className="mr-3 w-6 h-6" />
              Get Updates
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-8 space-x-6 text-purple-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Free early access
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Exclusive pricing
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Priority support
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="w-8 h-8 text-purple-400 mr-2" />
            <span className="text-2xl font-bold text-white">BizLaunch</span>
          </div>
          
          <p className="text-gray-400 mb-4">
            Building the future of business management, one feature at a time.
          </p>
          
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>&copy; 2025 BizLaunch</span>
            <span>•</span>
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard