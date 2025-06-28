import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, TrendingUp, Users } from 'lucide-react';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentPlan, setContentPlan] = useState<ContentPlan[]>([]);
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
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'threads', name: 'Threads', icon: '🧵' }
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
    if (!contentType || !description || selectedPlatforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one platform.",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Planning</h1>
          <p className="text-muted-foreground">
            Get AI-powered content ideas and posting schedules tailored to your niche
          </p>
        </div>
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