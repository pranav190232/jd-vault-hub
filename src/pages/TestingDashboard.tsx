import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import WorkflowVisualizer from '@/components/WorkflowVisualizer';
import ExportModule from '@/components/ExportModule';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export type WorkflowStage = 'upload' | 'extraction' | 'nlp' | 'simulation' | 'review' | 'export';

const TestingDashboard = () => {
  const [currentStage, setCurrentStage] = useState<WorkflowStage | null>(null);
  const [completedStages, setCompletedStages] = useState<Set<WorkflowStage>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);

  const stages: WorkflowStage[] = ['upload', 'extraction', 'nlp', 'simulation', 'review', 'export'];

  const runWorkflow = async () => {
    setIsProcessing(true);
    setCompletedStages(new Set());
    setSimulationData(null);

    for (const stage of stages) {
      setCurrentStage(stage);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
      
      setCompletedStages(prev => new Set([...prev, stage]));
      console.log(`✓ Stage completed: ${stage}`);
      
      // Generate simulation data when reaching simulation stage
      if (stage === 'simulation') {
        setSimulationData({
          jobTitle: 'Marketing Manager',
          candidates: 15,
          matchScore: 87,
          timestamp: new Date().toISOString()
        });
      }
    }

    setCurrentStage(null);
    setIsProcessing(false);
    console.log('✓ Simulation Pipeline Complete!');
  };

  const resetWorkflow = () => {
    setCurrentStage(null);
    setCompletedStages(new Set());
    setIsProcessing(false);
    setSimulationData(null);
    console.log('Workflow reset');
  };

  const isComplete = completedStages.size === stages.length;
  const isReviewed = completedStages.has('review');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Integration Testing Dashboard</h1>
          <p className="text-muted-foreground">Simulate the complete JD processing workflow</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Workflow Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-foreground">Workflow Pipeline</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={resetWorkflow}
                    variant="outline"
                    disabled={isProcessing}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                  <Button
                    onClick={runWorkflow}
                    disabled={isProcessing}
                    className="gap-2"
                  >
                    {isProcessing ? 'Processing...' : 'Start Simulation'}
                  </Button>
                </div>
              </div>

              <WorkflowVisualizer
                stages={stages}
                currentStage={currentStage}
                completedStages={completedStages}
                isProcessing={isProcessing}
              />

              {isComplete && (
                <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg animate-fade-in">
                  <p className="text-center text-lg font-semibold text-primary">
                    ✓ Simulation Pipeline Complete!
                  </p>
                </div>
              )}
            </Card>

            {/* Simulation Data Preview */}
            {simulationData && (
              <Card className="p-6 bg-card/50 backdrop-blur border-border animate-fade-in">
                <h3 className="text-xl font-semibold text-foreground mb-4">Simulation Data</h3>
                <pre className="bg-secondary/50 p-4 rounded-lg text-sm text-muted-foreground overflow-auto">
                  {JSON.stringify(simulationData, null, 2)}
                </pre>
              </Card>
            )}
          </div>

          {/* Export Module */}
          <div className="lg:col-span-1">
            <ExportModule
              isReviewed={isReviewed}
              simulationData={simulationData}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestingDashboard;
