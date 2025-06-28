import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, TrendingUp, Users, Check, Plus, Instagram, Twitter, Facebook, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { POSTING_TIMES, getPlatformTimes } from '../utils/postingTimes';

interface ContentPlan {
  day: number;
  date: string;
  posts: Array<{
    platform: string;
    contentIdea: string;
    contentType: string;
    description: string;
    hashtags: string[];
    tips: string;
  }>;
}

const ContentPlanning: React.FC = () => {
  const [contentType, setContentType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [planType, setPlanType] = useState<'2days' | '3days' | '5days' | '1week' | '2weeks' | '3weeks'>('1week');
  const [startDate, setStartDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentPlan, setContentPlan] = useState<ContentPlan[]>([]);
  const [isAddingToCalendar, setIsAddingToCalendar] = useState<{[key: string]: boolean}>({});
  const [addedToCalendar, setAddedToCalendar] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const contentTypes = [
    'Educational/How-to',
    'Entertainment/Funny',
    'Lifestyle/Fashion',
    'Food/Cooking',
    'Travel',
    'Technology',
    'Fitness/Health',
    'Business/Professional',
    'Art/Creative',
    'Gaming',
    'Music',
    'Sports',
    'News/Current Events',
    'Personal/Blog',
    'Product Reviews',
    'Behind the Scenes',
    'Q&A/Interactive',
    'Storytelling',
    'Motivational/Inspirational',
    'Other'
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="inline h-5 w-5 mr-1 text-pink-500" /> },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="inline h-5 w-5 mr-1 text-red-500" /> },
    { id: 'twitter', name: 'Twitter', icon: <Twitter className="inline h-5 w-5 mr-1 text-blue-400" /> },
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="inline h-5 w-5 mr-1 text-blue-600" /> },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="inline h-5 w-5 mr-1 text-blue-700" /> },
    { id: 'threads', name: 'Threads', icon: <MessageCircle className="inline h-5 w-5 mr-1 text-gray-700" /> }
  ];

  const planDurationOptions = [
    { value: '2days', label: '2 Days', description: 'Quick content burst' },
    { value: '3days', label: '3 Days', description: 'Short campaign' },
    { value: '5days', label: '5 Days', description: 'Work week focus' },
    { value: '1week', label: '1 Week', description: 'Full week plan' },
    { value: '2weeks', label: '2 Weeks', description: 'Extended campaign' },
    { value: '3weeks', label: '3 Weeks', description: 'Long-term strategy' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const generateContentPlan = async () => {
    if (!contentType || !description || selectedPlatforms.length === 0 || !startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including the start date.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/content-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          contentType,
          description,
          platforms: selectedPlatforms,
          planType,
          startDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content plan');
      }

      const data = await response.json();
      setContentPlan(data.plan);
      
      toast({
        title: "Content Plan Generated!",
        description: `Your ${planType} content plan is ready.`,
      });
    } catch (error) {
      console.error('Error generating content plan:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addToCalendar = async (dayPlan: ContentPlan, post: any, postIndex: number) => {
    const key = `${dayPlan.day}-${postIndex}`;
    setIsAddingToCalendar(prev => ({ ...prev, [key]: true }));
    
    try {
      // Calculate the scheduled date based on start date and day number
      const startDateObj = new Date(startDate);
      const scheduledDate = new Date(startDateObj);
      scheduledDate.setDate(startDateObj.getDate() + dayPlan.day - 1);
      
      // Set a default time (e.g., 10 AM)
      scheduledDate.setHours(10, 0, 0, 0);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          content: `${post.contentIdea}\n\n${post.description}\n\nHashtags: ${post.hashtags.join(' ')}\n\nTip: ${post.tips}`,
          platform: post.platform.toLowerCase(),
          scheduledAt: scheduledDate.toISOString(),
          status: 'SCHEDULED',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to calendar');
      }

      // Mark this content as added to calendar
      setAddedToCalendar(prev => ({ ...prev, [key]: true }));

      toast({
        title: "Added to Calendar!",
        description: `${post.contentIdea} has been scheduled for ${scheduledDate.toLocaleDateString()}`,
      });
    } catch (error) {
      console.error('Error adding to calendar:', error);
      toast({
        title: "Failed to Add",
        description: "Failed to add content to calendar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCalendar(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Content Planning</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get AI-powered content ideas and posting schedules tailored to your niche
          </p>
        </div>
      </div>

      {/* Platform selection with icons */}
      <div className="flex flex-wrap gap-3 mb-4">
        {platforms.map((platform) => (
          <span key={platform.id} className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm">
            {platform.icon}
            {platform.name}
          </span>
        ))}
      </div>

      {/* Optimal Posting Times Info */}
      {selectedPlatforms.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Optimal Posting Times</CardTitle>
            <CardDescription>
              Based on social media research, here are the best times to post for your selected platforms:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {selectedPlatforms.map((platform) => {
                const platformData = POSTING_TIMES.find(p => p.platform === platform);
                if (!platformData) return null;
                return (
                  <div key={platform}>
                    <h3 className="font-semibold mb-2 capitalize">{platformData.platform}</h3>
                    <ul className="text-sm mb-2">
                      {platformData.optimalTimes.map((day) => (
                        <li key={day.day} className="flex items-center gap-2 mb-1">
                          <span className="font-medium w-20">{day.day}:</span>
                          <span>{day.times.join(', ')}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="text-xs text-gray-500 list-disc ml-5">
                      {platformData.notes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Tell Us About Your Content</CardTitle>
            <CardDescription>
              Help us understand your content style to generate personalized posting plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type *</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brief Description of Your Work *</Label>
              <Textarea
                id="description"
                placeholder="Describe your past content, your audience, your style, and what you typically post about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Platforms *</Label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform) => (
                  <Button
                    key={platform.id}
                    variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePlatformToggle(platform.id)}
                    className="justify-start"
                  >
                    <span className="mr-2">{platform.icon}</span>
                    {platform.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Plan Duration</Label>
              <Select value={planType} onValueChange={(value: '2days' | '3days' | '5days' | '1week' | '2weeks' | '3weeks') => setPlanType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {planDurationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date *</Label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <Button 
              onClick={generateContentPlan} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Content Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Plan Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Your Content Plan</CardTitle>
            <CardDescription>
              AI-generated posting schedule and content ideas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contentPlan.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Fill out the form and generate your personalized content plan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contentPlan.map((dayPlan, dayIndex) => (
                  <div key={dayIndex} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-lg">{dayPlan.date}</h3>
                    <div className="space-y-3">
                      {dayPlan.posts.map((post, postIndex) => (
                        <div key={postIndex} className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="secondary" className="capitalize">
                              {post.platform}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {post.contentType}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-blue-600">
                              {post.contentIdea}
                            </h4>
                            
                            <p className="text-sm text-muted-foreground">
                              {post.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-1 mb-2">
                              {post.hashtags.map((hashtag, hashtagIndex) => (
                                <Badge key={hashtagIndex} variant="outline" className="text-xs">
                                  {hashtag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded text-xs">
                              <span className="font-medium text-blue-700 dark:text-blue-300">💡 Tip:</span>
                              <span className="text-blue-600 dark:text-blue-400 ml-1">{post.tips}</span>
                            </div>

                            <div className="flex gap-2 mt-3">
                              {addedToCalendar[`${dayPlan.day}-${postIndex}`] ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled
                                  className="flex-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800"
                                >
                                  <Check className="mr-2 h-3 w-3" />
                                  Added to Calendar
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addToCalendar(dayPlan, post, postIndex)}
                                  disabled={isAddingToCalendar[`${dayPlan.day}-${postIndex}`]}
                                  className="flex-1"
                                >
                                  {isAddingToCalendar[`${dayPlan.day}-${postIndex}`] ? (
                                    <>
                                      <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                      Adding...
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="mr-2 h-3 w-3" />
                                      Add to Calendar
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentPlanning; 