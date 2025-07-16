import React from 'react';
import { useSurveyDisplayContext } from 'features/surveys/features/SurveyDisplay/context';
import OneQuestionView from 'features/surveys/features/SurveyDisplay/components/OneQuestionView/OneQuestionView';
import AllQuestionsView from 'features/surveys/features/SurveyDisplay/components/AllQuestionsView/AllQuestionsView';
import SurveyNoActive from 'features/surveys/features/SurveyDisplay/components/SurveyNoActive/SurveyNoActive';
import ThankYou from 'features/surveys/features/SurveyDisplay/components/ThankYou';
import clsx from 'clsx';
import NoSurveys from '/public/images/no-surveys.svg';
import Image from 'next/image';
import Logo from 'layout/Logo/Logo';
import LogoCompany from 'layout/Logo/LogoCompany';

export default function SurveyDisplayContent() {
  const { formData, isSurveyFinished, previewMode } = useSurveyDisplayContext();

  return (
    <div className="w-full">

      
      {isSurveyFinished ? (
        <div className={clsx(previewMode && 'mb-12 mt-6')}>
          <ThankYou />
        </div>
      ) : formData?.isActive ? (
        <>
          {/* <div className="fixed inset-x-0 top-0 flex justify-center mt-4"> */}
          <div className='flex justify-center m-6'>
            <LogoCompany width={220} />
          </div>

          {formData.oneQuestionPerStep ? (
            <OneQuestionView />
          ) : (
            <AllQuestionsView />
          )}

          {formData.questions.length === 0 && (
            <>
              {/* <Image
                className="mx-auto mb-6 w-[160px] -translate-x-3"
                src={NoSurveys}
                alt="no surveys"
                height={165}
              /> */}
              <p>There are no questions in this survey</p>
            </>
          )}
        </>
      ) : (
        <SurveyNoActive />
      )}
    </div>
  );
}
