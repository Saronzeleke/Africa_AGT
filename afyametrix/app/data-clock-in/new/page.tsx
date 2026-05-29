"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, Upload, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const diseases = [
  "Cholera",
  "Lassa Fever",
  "Mpox",
  "Meningitis",
  "Yellow Fever",
  "Malaria",
  "Typhoid",
];

interface CaseRow {
  id: string;
  diseaseType: string;
  cases: string;
  date: string;
  caseDetails: string;
  comments: string;
  photos: File[];
}

export default function NewCaseEntryPage() {
  const router = useRouter();
  const [rows, setRows] = useState<CaseRow[]>([
    {
      id: "1",
      diseaseType: "",
      cases: "",
      date: new Date().toISOString().split("T")[0],
      caseDetails: "",
      comments: "",
      photos: [],
    },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now().toString(),
        diseaseType: "",
        cases: "",
        date: new Date().toISOString().split("T")[0],
        caseDetails: "",
        comments: "",
        photos: [],
      },
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof CaseRow, value: any) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleFileUpload = (id: string, files: FileList | null) => {
    if (files) {
      const row = rows.find((r) => r.id === id);
      if (row) {
        updateRow(id, "photos", [...row.photos, ...Array.from(files)]);
      }
    }
  };

  const removePhoto = (rowId: string, photoIndex: number) => {
    const row = rows.find((r) => r.id === rowId);
    if (row) {
      const newPhotos = row.photos.filter((_, index) => index !== photoIndex);
      updateRow(rowId, "photos", newPhotos);
    }
  };

  const handleSaveDraft = () => {
    // Save to localStorage
    localStorage.setItem("caseDraft", JSON.stringify(rows));
    alert("Draft saved successfully!");
  };

  const handleSubmit = () => {
    // Validate and submit
    const isValid = rows.every(
      (row) => row.diseaseType && row.cases && row.date
    );

    if (!isValid) {
      alert("Please fill in all required fields");
      return;
    }

    // Save to localStorage (mock submission)
    const existingEntries = JSON.parse(
      localStorage.getItem("caseEntries") || "[]"
    );
    localStorage.setItem(
      "caseEntries",
      JSON.stringify([...existingEntries, ...rows])
    );
    localStorage.removeItem("caseDraft");

    alert("Report submitted successfully!");
    router.push("/data-clock-in");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            New Case Entry (Data Spreadsheet)
          </h1>
          <p className="text-sm text-gray-600">CHW - Health Worker</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {rows.map((row, index) => (
          <Card key={row.id} className="p-6">
            <div className="space-y-6">
              {/* Row Header */}
              {rows.length > 1 && (
                <div className="flex justify-between items-center pb-4 border-b">
                  <h3 className="font-semibold text-gray-900">
                    Entry {index + 1}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow(row.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}

              {/* First Row: Disease Type, Cases, Date, Action */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`disease-${row.id}`}>
                    Disease Type <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id={`disease-${row.id}`}
                    value={row.diseaseType}
                    onChange={(e) =>
                      updateRow(row.id, "diseaseType", e.target.value)
                    }
                    className="mt-2 w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">- Select -</option>
                    {diseases.map((disease) => (
                      <option key={disease} value={disease}>
                        {disease}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor={`cases-${row.id}`}>
                    Number of Cases <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`cases-${row.id}`}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={row.cases}
                    onChange={(e) => updateRow(row.id, "cases", e.target.value)}
                    className="mt-2 bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor={`date-${row.id}`}>
                    Date of Report <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`date-${row.id}`}
                    type="date"
                    value={row.date}
                    onChange={(e) => updateRow(row.id, "date", e.target.value)}
                    className="mt-2 bg-gray-100"
                    required
                  />
                </div>

                {index === 0 && rows.length === 1 && (
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Second Row: Case Details, Comments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`details-${row.id}`}>
                    Input Case Details <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id={`details-${row.id}`}
                    value={row.caseDetails}
                    onChange={(e) =>
                      updateRow(row.id, "caseDetails", e.target.value)
                    }
                    className="mt-2 w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">- Input -</option>
                    <option value="3 Case details inserted">
                      3 Case details inserted
                    </option>
                    <option value="5 Case details inserted">
                      5 Case details inserted
                    </option>
                  </select>
                </div>

                <div>
                  <Label htmlFor={`comments-${row.id}`}>Comments/Notes</Label>
                  <textarea
                    id={`comments-${row.id}`}
                    placeholder="Any relevant observations, unusual presentations, or contextual notes."
                    value={row.comments}
                    onChange={(e) =>
                      updateRow(row.id, "comments", e.target.value)
                    }
                    className="mt-2 w-full min-h-[88px] rounded-lg border border-input bg-gray-100 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <Label>Attach Photos</Label>
                <div className="mt-2">
                  <label
                    htmlFor={`photos-${row.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg cursor-pointer hover:bg-cyan-200 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Attach files
                  </label>
                  <input
                    id={`photos-${row.id}`}
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(row.id, e.target.files)}
                    className="hidden"
                  />
                </div>

                {/* Photo Preview */}
                {row.photos.length > 0 && (
                  <div className="mt-4 space-y-2 bg-gray-50 p-4 rounded-lg">
                    {row.photos.map((photo, photoIndex) => (
                      <div
                        key={photoIndex}
                        className="flex items-center justify-between p-2 bg-white rounded border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-cyan-100 rounded flex items-center justify-center">
                            <Upload className="w-4 h-4 text-cyan-600" />
                          </div>
                          <span className="text-sm text-gray-700">
                            {photo.name}
                          </span>
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePhoto(row.id, photoIndex)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {/* Add Row Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={addRow}
            className="gap-2 border-2 border-primary text-primary hover:bg-primary/10"
          >
            <Plus className="w-5 h-5" />
            Add
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleSaveDraft}
            className="min-w-[140px]"
          >
            Save Draft
          </Button>
          <Button size="lg" onClick={handleSubmit} className="min-w-[140px]">
            Submit Report
          </Button>
        </div>
      </div>
    </div>
  );
}
