"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Upload,
  Send,
  Eye,
  Settings,
  X,
  Image as ImageIcon
} from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  connected: boolean;
}

const platforms: Platform[] = [
  { id: "twitter", name: "Twitter/X", icon: Twitter, color: "bg-blue-500", connected: false },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600", connected: false },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-500", connected: false },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700", connected: false },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-500", connected: false },
];

export default function Home() {
  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [authStatus, setAuthStatus] = useState<any>({});
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [usage, setUsage] = useState<any>(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch authentication status on component mount
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        if (data.success) {
          setAuthStatus(data.status);
        }
      } catch (error) {
        console.error('Failed to fetch auth status:', error);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    fetchAuthStatus();
  }, []);

  // Fetch usage data on component mount
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/usage');
        const data = await response.json();
        if (data.success) {
          setUsage(data.usage);
        }
      } catch (error) {
        console.error('Failed to fetch usage:', error);
      } finally {
        setIsLoadingUsage(false);
      }
    };

    fetchUsage();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadedImages(prev => [...prev, result]);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.imageId !== imageId));
    toast.success('Image removed');
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePost = async () => {
    if (!postContent.trim()) {
      toast.error("Please write something to post!");
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform!");
      return;
    }

    setIsPosting(true);

    try {
      const results = [];

      // Post to each selected platform
      for (const platformId of selectedPlatforms) {
        try {
          const response = await fetch(`/api/platforms/${platformId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: postContent,
              images: uploadedImages,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            results.push({ platform: platformId, success: true, ...result });
          } else if (response.status === 429) {
            // Rate limit exceeded
            throw new Error(result.message || 'Rate limit exceeded');
          } else {
            results.push({ platform: platformId, success: false, error: result.error });
          }
        } catch (error) {
          results.push({
            platform: platformId,
            success: false,
            error: `Network error posting to ${platformId}`
          });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;

      if (successCount > 0) {
        toast.success(`Successfully posted to ${successCount} platform${successCount !== 1 ? 's' : ''}!`);
        setPostContent("");
        setSelectedPlatforms([]);
        setUploadedImages([]);

        // Refresh usage data
        try {
          const response = await fetch('/api/usage');
          const data = await response.json();
          if (data.success) {
            setUsage(data.usage);
          }
        } catch (error) {
          console.error('Failed to refresh usage:', error);
        }
      }

      if (errorCount > 0) {
        toast.error(`Failed to post to ${errorCount} platform${errorCount !== 1 ? 's' : ''}. Check console for details.`);
        console.log('Posting results:', results);
      }

    } catch (error) {
      console.error('Posting error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const characterCount = postContent.length;
  const maxChars = 280;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                ✨ FREE FOREVER
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            Social Media Auto Post
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Post to multiple social media platforms simultaneously with advanced scheduling, analytics, and completely free
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Post Composer */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Create Your Post
                </CardTitle>
                <CardDescription>
                  Write your post and select platforms to publish to
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Post Content */}
                <div className="space-y-2">
                  <Label htmlFor="post-content">Post Content</Label>
                  <Textarea
                    id="post-content"
                    placeholder="What's on your mind? Write your post here..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="min-h-[120px] resize-none"
                    maxLength={maxChars}
                  />
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{characterCount}/{maxChars} characters</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Add Images</Label>
                    <Badge variant="outline" className="text-xs">
                      {uploadedImages.length}/4 images
                    </Badge>
                  </div>

                  {/* Upload Area */}
                  {uploadedImages.length < 4 && (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploadingImage}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        {isUploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-500">Uploading...</p>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-1">
                              Click to upload images
                            </p>
                            <p className="text-xs text-gray-400">
                              PNG, JPG, GIF, WebP up to 5MB
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  )}

                  {/* Image Previews */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {uploadedImages.map((image) => (
                        <div key={image.imageId} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800">
                            <img
                              src={image.url}
                              alt={image.filename}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveImage(image.imageId)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                            {image.filename}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Platform Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Select Platforms</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {isLoadingAuth ? (
                      // Loading skeleton
                      Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="border rounded-lg p-3 animate-pulse">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                          </div>
        </div>
                      ))
                    ) : (
                      platforms.map((platform) => {
                      const IconComponent = platform.icon;
                      const isSelected = selectedPlatforms.includes(platform.id);
                      const isConnected = !isLoadingAuth && authStatus[platform.id]?.connected;
                      const accountInfo = authStatus[platform.id]?.accounts?.[0];

                      return (
                        <div
                          key={platform.id}
                          className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                          } ${!isConnected ? "opacity-60" : ""}`}
                          onClick={() => isConnected && handlePlatformToggle(platform.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className={`h-8 w-8 ${platform.color}`}>
                              <AvatarFallback className="bg-transparent">
                                <IconComponent className="h-4 w-4 text-white" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {platform.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {isLoadingAuth ? "Loading..." :
                                 isConnected ?
                                   `Connected${accountInfo ? ` (${accountInfo.username || accountInfo.pageName || accountInfo.channelName || accountInfo.profileName})` : ""}` :
                                   "Not connected - Click to connect"
                                }
                              </p>
                            </div>
                            {isConnected && (
                              <Checkbox
                                checked={isSelected}
                                onChange={() => {}} // Handled by parent click
                              />
                            )}
                          </div>
                          {!isConnected && !isLoadingAuth && (
                            <div className="absolute inset-0 bg-gray-900/5 dark:bg-white/5 rounded-lg flex items-center justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Open connection modal
                                  toast.info(`Connect to ${platform.name} coming soon!`);
                                }}
                              >
                                Connect
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })
                    )}
                  </div>
                </div>

                {/* Post Button */}
                <Button
                  onClick={handlePost}
                  disabled={isPosting || !postContent.trim() || selectedPlatforms.length === 0}
                  className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  size="lg"
                >
                  {isPosting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post to {selectedPlatforms.length || 'Selected'} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            {showPreview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 min-h-[100px]">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {postContent || "Your post preview will appear here..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Posts Today</span>
                  <Badge variant={isLoadingUsage ? "secondary" : usage?.daily.used > 0 ? "default" : "secondary"}>
                    {isLoadingUsage ? "..." : `${usage?.daily.used}/${usage?.daily.limit}`}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Posts This Hour</span>
                  <Badge variant={isLoadingUsage ? "secondary" : usage?.hourly.used > 0 ? "default" : "secondary"}>
                    {isLoadingUsage ? "..." : `${usage?.hourly.used}/${usage?.hourly.limit}`}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Posts This Month</span>
                  <Badge variant={isLoadingUsage ? "secondary" : usage?.monthly.used > 0 ? "default" : "secondary"}>
                    {isLoadingUsage ? "..." : `${usage?.monthly.used}/${usage?.monthly.limit}`}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Platforms Connected</span>
                  <Badge variant="secondary">
                    {isLoadingAuth ? "..." : Object.values(authStatus).filter((s: any) => s?.connected).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Send className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Multi-Platform Posting</p>
                      <p className="text-sm text-green-600 dark:text-green-300">Post to all platforms at once</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">Image Upload</p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">Up to 4 images per post</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-800 dark:text-purple-200">Live Preview</p>
                      <p className="text-sm text-purple-600 dark:text-purple-300">See how your post looks</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">∞</span>
                    </div>
                    <div>
                      <p className="font-medium text-orange-800 dark:text-orange-200">Free Forever</p>
                      <p className="text-sm text-orange-600 dark:text-orange-300">No hidden costs or limits</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
