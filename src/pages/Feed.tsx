import React from 'react';
import JDUpload from '@/components/JDUpload';
import Navigation from '@/components/Navigation';

const Feed = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      <JDUpload />
    </div>
  );
};

export default Feed;