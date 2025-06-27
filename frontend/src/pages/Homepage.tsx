import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
  PenTool
} from "lucide-react";

export default function Homepage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [counters, setCounters] = useState({
    posts: 0,
    hours: 0,
    engagement: 0,
    users: 0
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-20 text-center">
          <div className="animate-fade-in">
            <Badge className="bg-white/20 text-white mb-6 hover:bg-white/30 transition-colors">
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by Advanced AI
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Revolutionize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Social Media</span> Management with AI
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Create, schedule, analyze, and engagesmarter, faster, together.
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
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
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

      {/* Innovation Highlight */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <Sparkles className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Innovation at Its Core</h2>
            <p className="text-xl mb-8 text-blue-100">
              Our proprietary AI engine combines natural language processing, machine learning, and predictive analytics to deliver unprecedented social media management capabilities.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold">98%</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 