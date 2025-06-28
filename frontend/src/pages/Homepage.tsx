import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import logo from "../assets/logo.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Play,
  ArrowRight,
  Users,
  TrendingUp,
  Calendar,
  BarChart3,
  Zap,
  Instagram,
  Twitter,
  Facebook,
  Star,
  CheckCircle,
  Sparkles,
  Target,
  Clock,
  Brain,
  MessageSquare,
  Heart,
  Share2,
  Eye,
  ChevronRight,
  PenTool,
  Mail,
  Linkedin
} from "lucide-react";
import LoginModal from "../components/shared/LoginModal";
import ayaanImg from "../assets/team/ayaan.jpg";
import dhruvImg from "../assets/team/dhruv.jpeg";
import prarabdhImg from "../assets/team/Prarabdh.jpeg";
import shivangiImg from "../assets/team/Shivangi.png";

export default function Homepage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [counters, setCounters] = useState({
    posts: 0,
    hours: 0,
    engagement: 0,
    users: 0
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      company: "TechFlow Inc.",
      content: "SocialMind transformed our social media strategy. We've seen 300% increase in engagement!",
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Content Creator",
      company: "Digital Nomads",
      content: "The AI content generation is incredible. It saves me 10+ hours per week.",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Social Media Director",
      company: "GrowthLab",
      content: "Best investment we've made. Our ROI increased by 250% in just 3 months.",
      avatar: "ER"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Content Generation",
      description: "Generate engaging captions, hashtags, and posts tailored to your brand voice",
      demo: "Creates 10+ variations instantly"
    },
    {
      icon: Calendar,
      title: "Intelligent Scheduling",
      description: "Optimize posting times based on audience behavior and engagement patterns",
      demo: "Auto-schedules at peak times"
    },
    {
      icon: Users,
      title: "Multi-Platform Management",
      description: "Manage Instagram, Twitter, Facebook, and LinkedIn from one dashboard",
      demo: "Connect unlimited accounts"
    },
    {
      icon: Target,
      title: "Personalized Recommendations",
      description: "AI learns your preferences to suggest content strategies and improvements",
      demo: "Improves performance by 40%"
    },
    {
      icon: Zap,
      title: "Engagement Automation",
      description: "Auto-respond to comments and messages with intelligent, contextual replies",
      demo: "Responds in seconds"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time insights with sentiment analysis and performance predictions",
      demo: "Track 50+ metrics"
    }
  ];

  const workflowSteps = [
    { title: "Choose Platform", description: "Select your social media platforms", icon: Share2 },
    { title: "Link Accounts", description: "Connect your social accounts securely", icon: Users },
    { title: "Set Schedule", description: "Define your posting schedule", icon: Calendar },
    { title: "Content Ideation", description: "AI suggests trending topics", icon: Brain },
    { title: "Caption Generation", description: "Generate engaging captions", icon: PenTool },
    { title: "Calendar View", description: "Visualize your content calendar", icon: Eye },
    { title: "Automation", description: "Set up automated posting", icon: Zap },
    { title: "Analytics", description: "Track performance and insights", icon: BarChart3 }
  ];

  // Counter animation effect
  useEffect(() => {
    const targetValues = { posts: 50000, hours: 25000, engagement: 85, users: 1200 };
    const duration = 2000;
    const steps = 60;
    const stepDelay = duration / steps;

    const timer = setInterval(() => {
      setCounters(prev => ({
        posts: Math.min(prev.posts + Math.floor(targetValues.posts / steps), targetValues.posts),
        hours: Math.min(prev.hours + Math.floor(targetValues.hours / steps), targetValues.hours),
        engagement: Math.min(prev.engagement + Math.floor(targetValues.engagement / steps), targetValues.engagement),
        users: Math.min(prev.users + Math.floor(targetValues.users / steps), targetValues.users)
      }));
    }, stepDelay);

    setTimeout(() => clearInterval(timer), duration);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Team data for dynamic rendering
  const team = [
    {
      name: "Ayaan Agarwal",
      email: "ayaanbansal02@gmail.com",
      linkedin: "https://www.linkedin.com/in/ayaan-agarwal-729266261/",
      color: "bg-gradient-to-br from-blue-400 to-cyan-500",
      initials: "AA",
      image: ayaanImg
    },
    {
      name: "Dhruv Duggal",
      email: "dhruvduggal2049@gmail.com",
      linkedin: "https://www.linkedin.com/in/dhruv-duggal-897b01255/",
      color: "bg-gradient-to-br from-indigo-400 to-blue-600",
      initials: "DD",
      image: dhruvImg
    },
    {
      name: "Prarabdh Atrey",
      email: "prarabdhatrey@gmail.com",
      linkedin: "https://www.linkedin.com/in/prarabdh-atrey-498ab9255/",
      color: "bg-gradient-to-br from-pink-400 to-purple-500",
      initials: "PA",
      image: prarabdhImg
    },
    {
      name: "Shivangi Srivastva",
      email: "shivangisrivastva30@gmail.com",
      linkedin: "https://www.linkedin.com/in/shivangi-srivastva-90ab73270/",
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
      initials: "SS",
      image: shivangiImg
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Auth Buttons - top right */}
      <div className="fixed top-6 right-6 z-40 flex items-center space-x-4">
        <Button
          variant="outline"
          className="border-blue-600 text-blue-600 bg-white hover:bg-blue-50 font-semibold px-6 py-2"
          onClick={() => { setLoginMode('login'); setShowLoginModal(true); }}
        >
          Login
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2"
          onClick={() => { setLoginMode('register'); setShowLoginModal(true); }}
        >
          Sign Up
        </Button>
      </div>

      {/* Logo - top left */}
      <div className="absolute top-6 left-6 z-40 flex items-center">
        <img src={logo} alt="Social Minds Logo" className="h-12 w-12 rounded-full shadow-lg" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-20 text-center">
          <div className="animate-fade-in">
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Revolutionizing Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Social Media</span> Management with Social Mind
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Create, schedule, analyze, and engage smarter, faster, together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
                onClick={() => window.location.href = '/onboarding'}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="border-white text-blue-600 hover:bg-white/10 text-lg px-8 py-4">
                    <Play className="mr-2 h-5 w-5" />
                    Watch 2-Minute Overview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>SocialMind Demo</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Demo video placeholder</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Login/Signup Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          initialMode={loginMode}
        />
      )}

      {/* Social Proof Bar */}
      <section className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-pulse">
              <div className="text-3xl font-bold text-blue-600">{counters.posts.toLocaleString()}+</div>
              <div className="text-gray-600">Posts Automated</div>
            </div>
            <div className="animate-pulse">
              <div className="text-3xl font-bold text-indigo-600">{counters.hours.toLocaleString()}+</div>
              <div className="text-gray-600">Hours Saved</div>
            </div>
            <div className="animate-pulse">
              <div className="text-3xl font-bold text-cyan-600">{counters.engagement}%</div>
              <div className="text-gray-600">Engagement Boost</div>
            </div>
            <div className="animate-pulse">
              <div className="text-3xl font-bold text-blue-700">{counters.users.toLocaleString()}+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Social Media Challenge</h2>
            <p className="text-xl text-gray-600">See how SocialMind solves real problems</p>
          </div>
          <Tabs defaultValue="problem" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="problem" className="text-lg">The Problem</TabsTrigger>
              <TabsTrigger value="solution" className="text-lg">Our Solution</TabsTrigger>
            </TabsList>
            <TabsContent value="problem" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Clock className="h-8 w-8 text-red-500 mb-2" />
                    <CardTitle>Time Consuming</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Managing multiple platforms takes 4+ hours daily</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Target className="h-8 w-8 text-orange-500 mb-2" />
                    <CardTitle>Inconsistent Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Maintaining brand voice across platforms is challenging</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <BarChart3 className="h-8 w-8 text-yellow-500 mb-2" />
                    <CardTitle>Poor Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Scattered metrics make it hard to measure success</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="solution" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow border-blue-200">
                  <CardHeader>
                    <Zap className="h-8 w-8 text-blue-500 mb-2" />
                    <CardTitle>AI Automation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Reduce management time by 80% with intelligent automation</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-indigo-200">
                  <CardHeader>
                    <Brain className="h-8 w-8 text-indigo-500 mb-2" />
                    <CardTitle>Consistent Voice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>AI learns your brand voice for consistent messaging</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-cyan-200">
                  <CardHeader>
                    <TrendingUp className="h-8 w-8 text-cyan-500 mb-2" />
                    <CardTitle>Unified Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>All metrics in one dashboard with actionable insights</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features at Your Fingertips</h2>
            <p className="text-xl text-gray-600">Discover what makes SocialMind different</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {feature.demo}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your Workflow, Simplified</h2>
            <p className="text-xl text-gray-600">From idea to analytics in 8 simple steps</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {workflowSteps.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

     
      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-12 mt-20 shadow-inner">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Brand & Social Mind Contact */}
          <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
            <img src={logo} alt="Social Minds Logo" className="h-14 w-14 rounded-full mb-3 shadow-lg border-2 border-white" />
            <span className="text-3xl font-extrabold tracking-wide mb-1">Social Mind</span>
            <span className="text-blue-200 mb-4">Revolutionizing Social Media Management</span>
            <div className="flex flex-col gap-2 mt-2">
              <a href="https://mail.google.com/mail/u/0/?to=socialminddd@gmail.com.com&fs=1&tf=cm" className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-full font-medium shadow hover:from-blue-500 hover:to-cyan-400 transition group">
                <Mail className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                socialminddd@gmail.com
              </a>
            </div>
          </div>

          {/* Team Section - Dynamic */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div
                key={member.email}
                className="flex flex-col items-center bg-white/10 rounded-xl p-6 shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Avatar */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover mb-3 shadow-lg border-2 border-white"
                />
                <span className="font-semibold text-lg mb-1">{member.name}</span>
                <div className="flex gap-3 mt-2">
                  {/* LinkedIn Button with Tooltip */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-white text-blue-700 px-3 py-1 rounded-full font-medium shadow hover:bg-blue-100 active:scale-95 transition group relative"
                  >
                    <Linkedin className="h-4 w-4 text-blue-700 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">LinkedIn</span>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">View LinkedIn</span>
                  </a>
                  {/* Email Button with Tooltip */}
                  <a
                    href={`https://mail.google.com/mail/u/0/?to=${member.email}&fs=1&tf=cm`}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full font-medium shadow hover:bg-blue-700 active:scale-95 transition group relative"
                  >
                    <Mail className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">Email</span>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">Email {member.name.split(' ')[0]}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center text-blue-200 mt-10 text-sm tracking-wide">&copy; {new Date().getFullYear()} Social Mind. All rights reserved.</div>
      </footer>

      {/* Add fade-in animation */}
      <style>
        {`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
        `}
      </style>
    </div>
  );
} 