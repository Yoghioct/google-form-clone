import React from 'react';
import { CompanyList } from '../../features/company/CompanyList';

const CompanyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-[var(--navigation-height)]">
      <CompanyList />
    </div>
  );
};

export default CompanyPage; 