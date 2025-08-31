import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus, Search } from "lucide-react";

const categories = [
  { name: "Landing", count: 761 },
  { name: "Pricing", count: 364 },
  { name: "Product", count: 239 },
  { name: "About", count: 133 },
  { name: "Blog", count: 119 },
  { name: "Customers", count: 89 },
  { name: "Careers", count: 49 },
  { name: "Contact", count: 30 },
  { name: "Integrations", count: 49 }
];

const sampleWebsites = [
  {
    id: 1,
    url: "tnofo.com/",
    title: "I love my bank's tech — said no business ever 😠",
    description: "Financial technology platform",
    image: "/api/placeholder/300/200"
  },
  {
    id: 2,
    url: "scraps.ai/",
    title: "AI-Powered Competitor Intelligence with Weekly Insights and Hypotheses",
    description: "AI competitor analysis tool",
    image: "/api/placeholder/300/200"
  },
  {
    id: 3,
    url: "tunify.com/en",
    title: "Legal music streaming for your business",
    description: "Business music streaming service",
    image: "/api/placeholder/300/200"
  }
];

const JDUpload = () => {
  const [selectedCategory, setSelectedCategory] = useState("Pages");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16">
          <div className="lg:w-2/3 mb-8 lg:mb-0">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              The best SaaS Web Design Inspiration
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              A curated collection of the best SaaS websites on the web. Quickly find the 
              inspiration you're looking for with our{" "}
              <span className="text-primary font-medium">page</span> &{" "}
              <span className="text-primary font-medium">stack</span> filters.
            </p>
          </div>
          
          {/* Email Signup */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 lg:w-80 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Get weekly SaaS design inspiration.
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              No spam, just the good stuff.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
              />
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              It's free
            </p>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-muted-foreground font-mono text-sm">// Pages</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Badge
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "secondary"}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-70">{category.count}</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
              <Plus className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm">
              Random
            </Button>
            <Button variant="outline" size="sm">
              Submit
            </Button>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Search className="w-4 h-4" />
            Subscribe
          </Button>
        </div>

        {/* Website Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleWebsites.map((website) => (
            <Card key={website.id} className="group bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 cursor-pointer overflow-hidden">
              <CardContent className="p-0">
                {/* Website Preview Image */}
                <div className="aspect-[4/3] bg-muted/20 border-b border-border/50 relative overflow-hidden">
                  <div className="absolute inset-4 bg-background/10 rounded-lg border border-border/30">
                    <div className="flex items-center gap-2 p-3 border-b border-border/30">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/60"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/60"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/60"></div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-foreground/20 rounded w-3/4"></div>
                      <div className="h-3 bg-foreground/10 rounded w-1/2"></div>
                      <div className="h-20 bg-foreground/5 rounded mt-4"></div>
                    </div>
                  </div>
                </div>
                
                {/* Website Info */}
                <div className="p-6">
                  <div className="text-xs text-muted-foreground mb-2 font-mono">
                    {website.url}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {website.title}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            Load More Inspiration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JDUpload;