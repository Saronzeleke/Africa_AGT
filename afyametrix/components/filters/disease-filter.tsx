"use client";

import { 
  ALL_DISEASES, 
  FORECAST_DISEASES, 
  getDiseasesForContext,
  hasForecastData 
} from "../../lib/constants/diseases";

interface DiseaseFilterProps {
  value: string;
  onChange: (disease: string) => void;
  context?: 'all' | 'forecasts' | 'alerts' | 'data-entry';
  showAll?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DiseaseFilter({
  value,
  onChange,
  context = 'all',
  showAll = true,
  className = "px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
  placeholder = "All Diseases",
  disabled = false
}: DiseaseFilterProps) {
  const diseases = getDiseasesForContext(context);
  
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      disabled={disabled}
    >
      {showAll && <option value="all">{placeholder}</option>}
      {diseases.map((disease) => (
        <option key={disease} value={disease}>
          {disease}
          {context === 'all' && !hasForecastData(disease) && ' (No forecast data)'}
        </option>
      ))}
    </select>
  );
}

export default DiseaseFilter;