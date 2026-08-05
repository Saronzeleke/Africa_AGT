"use client";

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  DollarSign,
  MapPin,
  Activity,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useAIRecommendations } from "@/lib/hooks/useDashboard";

interface FilterState {
  country: string;
  region: string;
  priority: string;
  resourceType: string;
}

export default function AIRecommendationsPage() {
  const [filters, setFilters] = useState<FilterState>({
    country: "Ethiopia",
    region: "Somali Region", // Default to first region in backend list
    priority: "",
    resourceType: ""
  });

  // Dynamic regions based on selected country - EXACT BACKEND DATA
  const getRegionsByCountry = (country: string) => {
    switch (country) {
      case "Ethiopia":
        return [
          { value: "Somali Region", label: "Somali Region" },
          { value: "Afar", label: "Afar" },
          { value: "Sidama", label: "Sidama" },
          { value: "Oromia", label: "Oromia" },
          { value: "Amhara", label: "Amhara" },
          { value: "Addis Ababa", label: "Addis Ababa" },
          { value: "Tigray", label: "Tigray" }
        ];
      case "Kenya":
        return [
          { value: "Kisumu", label: "Kisumu" },
          { value: "Eldoret", label: "Eldoret" },
          { value: "Nairobi", label: "Nairobi" },
          { value: "Turkana", label: "Turkana" },
          { value: "Mandera", label: "Mandera" },
          { value: "Mombasa", label: "Mombasa" },
          { value: "Garissa", label: "Garissa" },
          { value: "Nakuru", label: "Nakuru" }
        ];
      case "Uganda":
        return [
          { value: "Gulu", label: "Gulu" },
          { value: "Jinja", label: "Jinja" },
          { value: "Arua", label: "Arua" },
          { value: "Mbarara", label: "Mbarara" },
          { value: "Mbale", label: "Mbale" },
          { value: "Lira", label: "Lira" },
          { value: "Kampala", label: "Kampala" }
        ];
      case "Senegal":
        return [
          { value: "Diourbel", label: "Diourbel" },
          { value: "Thiès", label: "Thiès" },
          { value: "Tambacounda", label: "Tambacounda" },
          { value: "Ziguinchor", label: "Ziguinchor" },
          { value: "Saint-Louis", label: "Saint-Louis" },
          { value: "Dakar", label: "Dakar" }
        ];
      case "Zambia":
        return [
          { value: "Northern Province", label: "Northern Province" },
          { value: "Lusaka", label: "Lusaka" },
          { value: "Southern Province", label: "Southern Province" },
          { value: "Copperbelt", label: "Copperbelt" },
          { value: "Eastern Province", label: "Eastern Province" }
        ];
      case "DRC":
        return [
          { value: "Kisangani", label: "Kisangani" },
          { value: "Kinshasa", label: "Kinshasa" },
          { value: "Goma", label: "Goma" },
          { value: "Mbuji-Mayi", label: "Mbuji-Mayi" },
          { value: "Bukavu", label: "Bukavu" },
          { value: "Kananga", label: "Kananga" },
          { value: "Lubumbashi", label: "Lubumbashi" }
        ];
      case "Tanzania":
        return [
          { value: "Zanzibar", label: "Zanzibar" },
          { value: "Mbeya", label: "Mbeya" },
          { value: "Morogoro", label: "Morogoro" },
          { value: "Dodoma", label: "Dodoma" },
          { value: "Arusha", label: "Arusha" },
          { value: "Mwanza", label: "Mwanza" },
          { value: "Dar es Salaam", label: "Dar es Salaam" }
        ];
      case "Sudan":
        return [
          { value: "Blue Nile", label: "Blue Nile" },
          { value: "Khartoum", label: "Khartoum" },
          { value: "Darfur", label: "Darfur" },
          { value: "Omdurman", label: "Omdurman" },
          { value: "Kassala", label: "Kassala" },
          { value: "Red Sea State", label: "Red Sea State" }
        ];
      case "Ghana":
        return [
          { value: "Sunyani", label: "Sunyani" },
          { value: "Northern Region", label: "Northern Region" },
          { value: "Kumasi", label: "Kumasi" },
          { value: "Tamale", label: "Tamale" },
          { value: "Accra", label: "Accra" },
          { value: "Upper East", label: "Upper East" },
          { value: "Sekondi", label: "Sekondi" }
        ];
      case "Nigeria":
        return [
          { value: "Rivers", label: "Rivers" },
          { value: "Kaduna", label: "Kaduna" },
          { value: "Borno", label: "Borno" },
          { value: "Lagos", label: "Lagos" },
          { value: "Anambra", label: "Anambra" },
          { value: "Abuja", label: "Abuja" },
          { value: "Oyo", label: "Oyo" },
          { value: "Kano", label: "Kano" }
        ];
      default:
        return [{ value: "Unknown", label: "Unknown Region" }];
    }
  };

  const availableRegions = getRegionsByCountry(filters.country);

  // Handle country change - auto-select first region of new country
  const handleCountryChange = (newCountry: string) => {
    const newRegions = getRegionsByCountry(newCountry);
    const defaultRegion = newRegions.length > 0 ? newRegions[0].value : "";
    
    setFilters(prev => ({
      ...prev,
      country: newCountry,
      region: defaultRegion
    }));
  };

  const { 
    allocations, 
    clusters, 
    narrative, 
    isLoading, 
    error, 
    refetchAll 
  } = useAIRecommendations({
    country: filters.country,
    region: filters.region || "Addis Ababa" // Default region to fix 422 error
  });

  // Filter and process data (moved before any returns)
  const filteredAllocations = useMemo(() => {
    let filtered = allocations;
    
    if (filters.region) {
      filtered = filtered.filter((a: any) => 
        a.region?.toLowerCase().includes(filters.region.toLowerCase())
      );
    }
    
    return filtered;
  }, [allocations, filters.region]);

  const filteredClusters = useMemo(() => {
    let filtered = clusters;
    
    if (filters.priority) {
      filtered = filtered.filter((c: any) => 
        c.intervention_priority === filters.priority
      );
    }
    
    if (filters.region) {
      filtered = filtered.filter((c: any) => 
        c.region?.toLowerCase().includes(filters.region.toLowerCase())
      );
    }
    
    return filtered;
  }, [clusters, filters]);

  // Get priority counts
  const priorityCounts = useMemo(() => {
    const counts = { IMMEDIATE: 0, URGENT: 0, ROUTINE: 0 };
    clusters.forEach((c: any) => {
      if (c.intervention_priority && counts.hasOwnProperty(c.intervention_priority)) {
        counts[c.intervention_priority as keyof typeof counts]++;
      }
    });
    return counts;
  }, [clusters]);

  // Get top priority regions
  const topPriorityRegions = useMemo(() => {
    return clusters
      .filter((c: any) => c.intervention_priority === 'IMMEDIATE')
      .sort((a: any, b: any) => (b.risk_score || 0) - (a.risk_score || 0))
      .slice(0, 5);
  }, [clusters]);

  const handleRefresh = () => {
    refetchAll();
  };

  const handleExport = () => {
    try {
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          country: filters.country,
          region: filters.region || 'All Regions',
          totalRegions: filteredAllocations.length,
          totalClusters: filteredClusters.length
        },
        prioritySummary: priorityCounts,
        resourceAllocations: filteredAllocations.map((allocation: any) => ({
          region: allocation.region || allocation.country,
          riskScore: allocation.risk_score,
          vaccines: allocation.vaccines || 0,
          ambulances: allocation.ambulances || 0,
          budgetUSD: allocation.budget_usd || 0,
          clusterLabel: allocation.cluster_label
        })),
        interventionPriorities: filteredClusters.map((cluster: any) => ({
          region: cluster.region || cluster.country,
          priority: cluster.intervention_priority,
          riskScore: cluster.risk_score,
          resourceMultiplier: cluster.resource_multiplier,
          clusterLabel: cluster.cluster_label
        })),
        aiInsights: narrative ? {
          summary: narrative.summary,
          recommendations: narrative.recommendations,
          language: narrative.language
        } : null
      };

      const csvContent = [
        'AI Recommendations Export Report',
        `Export Date: ${new Date().toLocaleString()}`,
        `Country: ${filters.country}`,
        `Region Filter: ${filters.region || 'All Regions'}`,
        '',
        'PRIORITY SUMMARY',
        `Immediate Action Required: ${priorityCounts.IMMEDIATE}`,
        `Urgent Response Needed: ${priorityCounts.URGENT}`,
        `Routine Monitoring: ${priorityCounts.ROUTINE}`,
        '',
        'RESOURCE ALLOCATIONS',
        'Region,Risk Score,Vaccines,Ambulances,Budget USD,Cluster',
        ...filteredAllocations.map((a: any) => 
          `"${a.region || a.country}",${a.risk_score || 0},${a.vaccines || 0},${a.ambulances || 0},${a.budget_usd || 0},"${a.cluster_label || ''}"`
        ),
        '',
        'INTERVENTION PRIORITIES',
        'Region,Priority Level,Risk Score,Resource Multiplier,Cluster',
        ...filteredClusters.map((c: any) => 
          `"${c.region || c.country}","${c.intervention_priority}",${c.risk_score || 0},${c.resource_multiplier || 1},"${c.cluster_label || ''}"`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ai-recommendations-${filters.country.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'IMMEDIATE': return 'bg-red-500';
      case 'URGENT': return 'bg-orange-500';
      case 'ROUTINE': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'IMMEDIATE': return <AlertCircle className="w-4 h-4" />;
      case 'URGENT': return <Clock className="w-4 h-4" />;
      case 'ROUTINE': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  // Show error state if any errors occurred (moved after all hooks)
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="text-blue-600" size={32} />
            AI Recommendations
          </h1>
        </div>
        
        <div className="flex items-center justify-center min-h-96">
          <Card className="p-8 text-center max-w-md mx-auto">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Unable to Load AI Recommendations
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading the AI recommendations data. Please try again.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              {error instanceof Error ? error.message : "Network connection error"}
            </div>
            <Button onClick={() => refetchAll()} className="flex items-center gap-2">
              <RefreshCw size={16} />
              Retry
            </Button>
          </Card>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <BackButton fallbackUrl="/dashboard" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
          <p className="text-sm text-gray-600">Intelligent health insights and resource optimization</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filters.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Ethiopia">Ethiopia</option>
            <option value="Kenya">Kenya</option>
            <option value="Uganda">Uganda</option>
            <option value="Senegal">Senegal</option>
            <option value="Zambia">Zambia</option>
            <option value="DRC">DRC</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Sudan">Sudan</option>
            <option value="Ghana">Ghana</option>
            <option value="Nigeria">Nigeria</option>
          </select>

          <select
            value={filters.region}
            onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableRegions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="IMMEDIATE">Immediate</option>
            <option value="URGENT">Urgent</option>
            <option value="ROUTINE">Routine</option>
          </select>
        </div>
      </Card>

      {/* Priority Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Immediate Action</p>
              <p className="text-2xl font-bold text-red-600">{priorityCounts.IMMEDIATE}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Urgent Response</p>
              <p className="text-2xl font-bold text-orange-600">{priorityCounts.URGENT}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Routine Monitoring</p>
              <p className="text-2xl font-bold text-green-600">{priorityCounts.ROUTINE}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Resource Allocations */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Resource Allocations</h2>
              <span className="text-sm text-gray-500">{filteredAllocations.length} regions</span>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredAllocations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No allocation data available
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAllocations.map((allocation: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {allocation.region || allocation.country}
                        </span>
                        {allocation.cluster_label && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                            {allocation.cluster_label}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Risk: {allocation.risk_score?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">💉 Vaccines</div>
                        <div className="font-semibold text-blue-700">
                          {formatNumber(allocation.vaccines || 0)}
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">🚑 Ambulances</div>
                        <div className="font-semibold text-green-700">
                          {allocation.ambulances || 0}
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">💰 Budget</div>
                        <div className="font-semibold text-purple-700">
                          ${formatNumber(allocation.budget_usd || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Intervention Priority Matrix */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Intervention Priorities</h2>
            
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            ) : filteredClusters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No priority data available
              </div>
            ) : (
              <div className="space-y-3">
                {filteredClusters.map((cluster: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(cluster.intervention_priority)}`}></div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {cluster.region || cluster.country}
                        </div>
                        <div className="text-sm text-gray-600">
                          {cluster.cluster_label || 'Health Cluster'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-600">Priority</div>
                        <div className={`flex items-center gap-1 text-sm font-medium ${
                          cluster.intervention_priority === 'IMMEDIATE' ? 'text-red-600' :
                          cluster.intervention_priority === 'URGENT' ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {getPriorityIcon(cluster.intervention_priority)}
                          {cluster.intervention_priority}
                        </div>
                      </div>
                      
                      {cluster.resource_multiplier && (
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Multiplier</div>
                          <div className="text-sm font-medium text-gray-900">
                            {cluster.resource_multiplier}x
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* AI Health Narrative */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">AI Health Insights</h2>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : narrative && narrative.narrative ? (
              <div className="space-y-4">
                {/* Country/Region Overview */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      {narrative.region ? `${narrative.region}, ${narrative.country}` : narrative.country}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {narrative.narrative}
                  </p>
                </div>

                {/* Country Statistics (for country overview) */}
                {!narrative.region && narrative.country_stats && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600">Average Risk</div>
                      <div className="font-semibold text-gray-900">
                        {narrative.country_stats.average_risk?.toFixed(1) || '0'}/100
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600">Total Regions</div>
                      <div className="font-semibold text-gray-900">
                        {narrative.country_stats.total_regions || 0}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600">Total Cases</div>
                      <div className="font-semibold text-gray-900">
                        {formatNumber(narrative.country_stats.total_cases || 0)}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600">High Risk</div>
                      <div className="font-semibold text-red-600">
                        {narrative.country_stats.high_risk_count || 0} regions
                      </div>
                    </div>
                  </div>
                )}

                {/* Region-specific metrics */}
                {narrative.region && narrative.metrics && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600">Population</div>
                      <div className="font-semibold text-gray-900">
                        {formatNumber(narrative.metrics.population || 0)}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600">Cases</div>
                      <div className="font-semibold text-gray-900">
                        {formatNumber(narrative.metrics.cases || 0)}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600">Healthcare Access</div>
                      <div className="font-semibold text-gray-900">
                        {narrative.metrics.healthcare_access?.toFixed(1) || 'N/A'}%
                      </div>
                    </div>
                    {narrative.metrics.primary_disease && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-xs text-red-600">Primary Concern</div>
                        <div className="font-semibold text-red-900 capitalize">
                          {narrative.metrics.primary_disease}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Available Regions (for country overview) */}
                {!narrative.region && Array.isArray(narrative.available_regions) && narrative.available_regions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Available Regions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {narrative.available_regions.slice(0, 6).map((region: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setFilters(prev => ({ ...prev, region }))}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          {region}
                        </button>
                      ))}
                      {narrative.available_regions.length > 6 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{narrative.available_regions.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* High Risk Regions Alert */}
                {Array.isArray(narrative.high_risk_regions) && narrative.high_risk_regions.length > 0 && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-900">High Risk Regions</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {narrative.high_risk_regions.map((region: string, index: number) => (
                        <span key={index} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* API Metadata (development only) */}
                {process.env.NODE_ENV === 'development' && narrative._meta && (
                  <div className="text-xs text-gray-400 p-2 bg-gray-50 rounded border-l-2 border-gray-300">
                    API: {narrative._meta.endpoint_version} • Type: {narrative._meta.response_type} • {new Date(narrative._meta.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No AI insights available for the selected region
              </div>
            )}
          </Card>

          {/* Top Priority Regions */}
          {topPriorityRegions.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Immediate Action Required</h2>
              <div className="space-y-3">
                {topPriorityRegions.map((region: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <div className="font-medium text-red-900">
                        {region.region || region.country}
                      </div>
                      <div className="text-xs text-red-600">
                        Risk Score: {region.risk_score?.toFixed(1) || 'High'}
                      </div>
                    </div>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}