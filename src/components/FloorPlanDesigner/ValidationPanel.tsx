import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { FloorPlan, ValidationResult } from '@/types/floorPlan';
import { validateFloorPlan } from '@/utils/floorPlanValidation';

interface ValidationPanelProps {
  floorPlan: FloorPlan;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ floorPlan }) => {
  const validationResult = validateFloorPlan(floorPlan);

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {validationResult.isValid ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {validationResult.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-600">Errors</h4>
            {validationResult.errors.map((error, index) => (
              <Alert key={index} variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {validationResult.warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-600">Warnings</h4>
            {validationResult.warnings.map((warning, index) => (
              <Alert key={index}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{warning}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {validationResult.isValid && validationResult.warnings.length === 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Floor plan is valid with no issues detected.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};