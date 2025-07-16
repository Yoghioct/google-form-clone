import {
  ArrowLeftIcon,
  CogIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';
import SurveyOptionsModalModal from 'features/surveys/components/SurveyOptionsModal/SurveyOptionsModal';
import useModal from 'features/surveys/hooks/useModal';
import useTranslation from 'next-translate/useTranslation';

import React, { useState } from 'react';
import Button, {
  ButtonSize,
  ButtonVariant,
} from 'shared/components/Button/Button';
import Input, { InputSize } from 'shared/components/Input/Input';
import { MAX_TITLE_LENGTH } from 'shared/constants/surveysConfig';
import { useSurveyCreatorContext } from 'features/surveys/features/SurveyCreator/managers/createSurveyManager/context';
import { usePreviewPanelContext } from 'features/surveys/features/SurveyCreator/managers/previewPanelManager/context';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Toggle from 'shared/components/Toggle/Toggle';

export default function TitleAndConfigSection() {
  const { t } = useTranslation('surveyCreate');

  const {
    title,
    error,
    handleChangeTitle,
    surveyOptions,
    updateSurveyOptions,
    isEditMode,
    setIsTemplatePicked,
    showDisclaimer,
    setShowDisclaimer,
    disclaimerTitle,
    setDisclaimerTitle,
    disclaimerBody,
    setDisclaimerBody,
  } = useSurveyCreatorContext();

  const { togglePanel, isPanelOpened } = usePreviewPanelContext();

  const {
    isModalOpen: isOptionsModalOpen,
    closeModal: closeOptionsSurveyModal,
    openModal: openOptionsSurveyModal,
  } = useModal();

  const [disclaimerOpen, setDisclaimerOpen] = useState(showDisclaimer);

  return (
    <>
      <div className="flex flex-col gap-x-2 sm:flex-row">
        {!isEditMode && (
          <Button
            className="mb-2"
            onClick={() => {
              setIsTemplatePicked(false);
            }}
            sizeType={ButtonSize.SMALL}
            icon={<ArrowLeftIcon className="mr-1 h-5 w-5" />}
          >
            Back
          </Button>
        )}

        <div className="w-full">
          <Input
            className="mt-0"
            name="survey-title"
            placeholder={t('surveyTitlePlaceholder')}
            value={title}
            error={error}
            maxLength={MAX_TITLE_LENGTH}
            onChange={handleChangeTitle}
            inputSize={InputSize.SMALL}
          />
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-grow whitespace-nowrap"
            variant={ButtonVariant.PRIMARY}
            onClick={openOptionsSurveyModal}
            icon={<CogIcon className="h-5 w-5" />}
            data-test-id="options-button"
            sizeType={ButtonSize.SMALL}
          >
            <span className="ms-1">{t('options')}</span>
          </Button>
          <Button
            onClick={togglePanel}
            variant={ButtonVariant.PRIMARY}
            sizeType={ButtonSize.SMALL}
            icon={
              isPanelOpened ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )
            }
            data-test-id="preview-button"
          />
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <div className="flex items-center mb-2 font-semibold text-gray-700">
          <button
            type="button"
            className="btn relative flex items-center justify-center btn-secondary h-[38px] px-3 py-1 text-sm bg-secondary-50 mr-2"
            onClick={() => setDisclaimerOpen(!disclaimerOpen)}
            aria-label={disclaimerOpen ? 'Tutup disclaimer' : 'Buka disclaimer'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className={`w-[15px] transition-transform ${disclaimerOpen ? '' : '-rotate-90'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <span className="flex-1">Disclaimer sebelum survey</span>
          <Toggle
            isEnabled={showDisclaimer}
            onToggle={v => { setShowDisclaimer(v); if (v) setDisclaimerOpen(true); }}
            classNames="ml-2"
          />
        </div>
        {showDisclaimer && disclaimerOpen && (
          <div className="space-y-2 mt-2">
            <label className="block text-sm font-medium text-gray-700">Judul disclaimer (markdown, bisa bold)</label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Judul disclaimer"
              value={disclaimerTitle}
              onChange={e => setDisclaimerTitle(e.target.value)}
            />
            <label className="block text-sm font-medium text-gray-700">Isi disclaimer (markdown, bisa bold, panjang)</label>
            <textarea
              className="w-full border rounded px-2 py-1 min-h-[80px] text-sm"
              placeholder="Isi disclaimer"
              value={disclaimerBody}
              onChange={e => setDisclaimerBody(e.target.value)}
            />
            <div className="text-xs text-gray-500 mb-2">
              Gunakan <code>&lt;b&gt;&lt;/b&gt;</code> untuk format <b>tebal</b>,{' '}
              <code>&lt;i&gt;&lt;/i&gt;</code> <i>miring</i>,{' '}
              <code>&lt;br&gt;</code> untuk baris baru, dsb.
            </div>
            {/*
            <div className="border-t pt-2 mt-2">
              <div className="text-xs font-semibold text-gray-600 mb-1">Preview:</div>
              <div className="prose prose-gray prose-sm bg-white p-2 rounded">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{disclaimerBody}</ReactMarkdown>
              </div>
            </div>
            */}
          </div>
        )}
      </div>

      <SurveyOptionsModalModal
        isOpened={isOptionsModalOpen}
        closeModal={closeOptionsSurveyModal}
        surveyOptions={surveyOptions}
        updateOptions={updateSurveyOptions}
      />
    </>
  );
}
