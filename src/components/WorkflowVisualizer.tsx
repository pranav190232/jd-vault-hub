import React from 'react';
import { Check, Upload, FileSearch, Brain, Zap, CheckCircle, Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WorkflowStage } from '@/pages/TestingDashboard';

interface WorkflowVisualizerProps {
  stages: WorkflowStage[];
  currentStage: WorkflowStage | null;
  completedStages: Set<WorkflowStage>;
  isProcessing: boolean;
}

const stageConfig = {
  upload: {
    icon: Upload,
    label: 'JD Upload',
    description: 'Upload job description'
  },
  extraction: {
    icon: FileSearch,
    label: 'Extraction',
    description: 'Extract text from document'
  },
  nlp: {
    icon: Brain,
    label: 'NLP Analysis',
    description: 'Process with AI'
  },
  simulation: {
    icon: Zap,
    label: 'Simulation',
    description: 'Generate candidates'
  },
  review: {
    icon: CheckCircle,
    label: 'Review',
    description: 'Validate results'
  },
  export: {
    icon: Download,
    label: 'Export',
    description: 'Download results'
  }
};

const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  stages,
  currentStage,
  completedStages,
  isProcessing
}) => {
  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const config = stageConfig[stage];
        const Icon = config.icon;
        const isComplete = completedStages.has(stage);
        const isCurrent = currentStage === stage;
        const isLast = index === stages.length - 1;

        return (
          <div key={stage} className="relative">
            {/* Stage Card */}
            <div
              className={cn(
                'flex items-center gap-4 p-4 rounded-lg border transition-all duration-300',
                isComplete && 'bg-primary/10 border-primary/30',
                isCurrent && 'bg-accent/10 border-accent/30 animate-pulse',
                !isComplete && !isCurrent && 'bg-card/30 border-border'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300',
                  isComplete && 'bg-primary text-primary-foreground',
                  isCurrent && 'bg-accent text-accent-foreground',
                  !isComplete && !isCurrent && 'bg-secondary text-muted-foreground'
                )}
              >
                {isComplete ? (
                  <Check className="w-6 h-6" />
                ) : isCurrent ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className={cn(
                  'font-semibold transition-colors',
                  (isComplete || isCurrent) ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {config.label}
                </h3>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>

              {/* Status Badge */}
              {isComplete && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  <Check className="w-3 h-3" />
                  Done
                </div>
              )}
              {isCurrent && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium">
                  Processing...
                </div>
              )}
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div className="flex justify-center py-2">
                <div
                  className={cn(
                    'w-0.5 h-6 transition-all duration-300',
                    isComplete ? 'bg-primary' : 'bg-border'
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowVisualizer;
