import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FileJson, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ExportModuleProps {
  isReviewed: boolean;
  simulationData: any;
  isProcessing: boolean;
}

const ExportModule: React.FC<ExportModuleProps> = ({ isReviewed, simulationData, isProcessing }) => {
  const [exportingFormat, setExportingFormat] = useState<'pdf' | 'json' | null>(null);

  const handleExport = async (format: 'pdf' | 'json') => {
    if (!isReviewed || !simulationData) return;

    setExportingFormat(format);
    console.log(`Starting ${format.toUpperCase()} export...`);

    // Simulate 2-3 second processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Generate filename
    const jobTitle = simulationData.jobTitle?.toLowerCase().replace(/\s+/g, '_') || 'simulation';
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `simulation_${jobTitle}_${timestamp}.${format}`;

    if (format === 'json') {
      // Export as JSON
      const jsonData = JSON.stringify(simulationData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      downloadBlob(blob, filename);
    } else {
      // Export as PDF (simulate with text file)
      const pdfContent = `
JD VAULT - SIMULATION REPORT
============================

Job Title: ${simulationData.jobTitle}
Candidates Matched: ${simulationData.candidates}
Match Score: ${simulationData.matchScore}%
Generated: ${new Date(simulationData.timestamp).toLocaleString()}

---
This is a simulated PDF export for demonstration purposes.
In production, this would be a properly formatted PDF document.
      `.trim();
      
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      downloadBlob(blob, filename);
    }

    console.log(`✓ Export completed: ${filename}`);
    
    toast({
      title: "Export Successful!",
      description: `Simulation exported as ${format.toUpperCase()} successfully.`,
      duration: 3000,
    });

    setExportingFormat(null);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const canExport = isReviewed && simulationData && !isProcessing;

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border sticky top-24">
      <h2 className="text-2xl font-semibold text-foreground mb-2">Export Options</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {!isReviewed 
          ? 'Complete the workflow to enable exports' 
          : 'Download simulation results in your preferred format'}
      </p>

      <div className="space-y-3">
        {/* Export as PDF */}
        <Button
          onClick={() => handleExport('pdf')}
          disabled={!canExport || exportingFormat !== null}
          className={cn(
            'w-full h-auto py-4 flex-col items-start gap-2 transition-all',
            canExport && 'hover:shadow-glow'
          )}
          variant={canExport ? 'default' : 'secondary'}
        >
          <div className="flex items-center gap-2 w-full">
            {exportingFormat === 'pdf' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FileText className="w-5 h-5" />
            )}
            <span className="font-semibold">Export as PDF</span>
          </div>
          <span className="text-xs opacity-80 text-left">
            {exportingFormat === 'pdf' 
              ? 'Generating PDF document...' 
              : 'Download formatted report'}
          </span>
        </Button>

        {/* Export as JSON */}
        <Button
          onClick={() => handleExport('json')}
          disabled={!canExport || exportingFormat !== null}
          className={cn(
            'w-full h-auto py-4 flex-col items-start gap-2 transition-all',
            canExport && 'hover:shadow-glow'
          )}
          variant={canExport ? 'default' : 'secondary'}
        >
          <div className="flex items-center gap-2 w-full">
            {exportingFormat === 'json' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FileJson className="w-5 h-5" />
            )}
            <span className="font-semibold">Export as JSON</span>
          </div>
          <span className="text-xs opacity-80 text-left">
            {exportingFormat === 'json' 
              ? 'Generating JSON file...' 
              : 'Download raw data'}
          </span>
        </Button>
      </div>

      {!canExport && (
        <div className="mt-6 p-3 bg-muted/30 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            {isProcessing 
              ? '⏳ Workflow in progress...' 
              : !simulationData 
                ? '📋 Run simulation first' 
                : '✓ Ready to export'}
          </p>
        </div>
      )}

      {/* Export Log */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-foreground mb-2">Export Log</h3>
        <div className="bg-secondary/50 rounded p-3 text-xs text-muted-foreground font-mono">
          {exportingFormat ? (
            <p className="animate-pulse">Exporting {exportingFormat.toUpperCase()}...</p>
          ) : (
            <p>Awaiting export request...</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExportModule;
