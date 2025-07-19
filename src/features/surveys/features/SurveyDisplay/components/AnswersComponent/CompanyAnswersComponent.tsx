import React from 'react';
import { DraftQuestionWithAnswer } from 'features/surveys/features/SurveyDisplay/managers/surveyAnswerManager';
import { useSurveyDisplayContext } from 'features/surveys/features/SurveyDisplay/context';
import useTranslation from 'next-translate/useTranslation';
import clsx from 'clsx';

interface CompanyAnswersComponentProps {
  questionData: DraftQuestionWithAnswer;
}

export default function CompanyAnswersComponent({
  questionData,
}: CompanyAnswersComponentProps) {
  const { t } = useTranslation('survey');
  const { handleAnswerChange, isSubmitted } = useSurveyDisplayContext();

  // Company questions show as multiple choice options
  // The options array contains the selected company names
  const companyOptions = questionData.options as string[] || [];

  return (
    <div>
      {companyOptions.map((companyName: string, idx: number) => (
        <button
          key={idx}
          className={clsx(
            'mb-2 w-full rounded border p-4 text-center text-sm font-medium hover:bg-gray-100',
            questionData.answer === companyName && 'bg-gray-200'
          )}
          onClick={() => handleAnswerChange(companyName, questionData.id)}
        >
          {companyName.trim() || '-'}
        </button>
      ))}
      {isSubmitted && !questionData.answer && questionData.isRequired && (
        <p className="mt-2 text-sm text-red-500">{t('requiredField')}</p>
      )}
      {companyOptions.length === 0 && (
        <div className="mt-2 p-4 border rounded bg-gray-50 text-center text-gray-500">
          No companies selected for this question
        </div>
      )}
    </div>
  );
}
