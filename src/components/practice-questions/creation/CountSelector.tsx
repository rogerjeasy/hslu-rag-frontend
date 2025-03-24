import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus } from 'lucide-react';

interface CountSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const CountSelector: React.FC<CountSelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 20,
  step = 1
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + step);
    }
  };
  
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.min(Math.max(newValue, min), max));
    }
  };
  
  const handleSliderChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDecrement}
            disabled={value <= min}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="relative w-16 mx-2">
            <Input
              type="number"
              value={value}
              onChange={handleInputChange}
              min={min}
              max={max}
              className="h-8 text-center pr-0 pl-0"
            />
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleIncrement}
            disabled={value >= max}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {value === min ? "Minimum" : value === max ? "Maximum" : `${value} questions`}
        </div>
      </div>
      
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleSliderChange}
        className="py-1"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Fewer questions</span>
        <span>More questions</span>
      </div>
    </div>
  );
};

export default CountSelector;