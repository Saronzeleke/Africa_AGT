"use client";

// Disease constants - inline to avoid module resolution issues
const ALL_DISEASES = [
  "Cholera",
  "Meningitis", 
  "Typhoid",
  "Malaria",
  "Dengue",
  "Mpox",
  "Malnutrition",
  "Diarrheal Disease",
  "Respiratory Infections",
  "Tuberculosis"
] as const;

const FORECAST_DISEASES = [
  "Meningitis",
  "Cholera", 
  "Dengue"
] as const;

function hasForecastData(disease: string): boolean {
  return FORECAST_DISEASES.includes(disease as any);
}

function getDiseasesForContext(context: 'all' | 'forecasts' | 'alerts' | 'data-entry') {
  switch (context) {
    case 'all':
      return ALL_DISEASES;
    case 'forecasts':
      return FORECAST_DISEASES;
    case 'alerts':
      return ["Cholera"];
    case 'data-entry':
      return [...ALL_DISEASES, "Lassa Fever", "Yellow Fever"].sort();
    default:
      return ALL_DISEASES;
  }
}

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