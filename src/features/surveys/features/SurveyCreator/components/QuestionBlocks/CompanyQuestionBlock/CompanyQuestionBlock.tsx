import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { CompanyManager, Company } from 'features/company/companyManager';
import useTranslation from 'next-translate/useTranslation';
import { useSurveyCreatorContext } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/context';

interface CompanyQuestionBlockProps {
  questionIndex: number;
  selectedCompanies?: string[];
}

export default function CompanyQuestionBlock({ 
  questionIndex, 
  selectedCompanies = [] 
}: CompanyQuestionBlockProps) {
  const { t } = useTranslation('surveyCreate');
  const { updateQuestionData } = useSurveyCreatorContext();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesData = await CompanyManager.getAllCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyChange = (selectedOptions: any) => {
    const selectedCompanyIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    const selectedCompanyNames = selectedOptions ? selectedOptions.map((option: any) => option.label) : [];
    
    // Update the question with selected companies
    // Store company IDs in a special field and company names as options for display
    updateQuestionData(questionIndex, {
      selectedCompanies: selectedCompanyIds,
      options: selectedCompanyNames
    });
  };

  const companyOptions = companies.map(company => ({
    value: company.id,
    label: company.name
  }));

  const selectedOptions = selectedCompanies
    .map(companyId => {
      const company = companies.find(c => c.id === companyId);
      return company ? { value: company.id, label: company.name } : null;
    })
    .filter(Boolean);

  if (loading) {
    return (
      <div className="mt-2 p-4 border rounded bg-gray-50">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Companies
      </label>
      <Select
        isMulti
        options={companyOptions}
        value={selectedOptions}
        onChange={handleCompanyChange}
        classNamePrefix="react-select"
        placeholder="Choose companies..."
        styles={{
          valueContainer: (base) => ({
            ...base,
            justifyContent: 'flex-start',
            padding: '2px 8px',
          }),
          option: (base, { isFocused, isSelected }) => ({
            ...base,
            textAlign: 'left',
            backgroundColor: isFocused
              ? '#eee'
              : isSelected
              ? '#ddd'
              : base.backgroundColor,
          }),
        }}
      />
      {selectedCompanies.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {selectedCompanies.length} companies
        </div>
      )}
    </div>
  );
}
