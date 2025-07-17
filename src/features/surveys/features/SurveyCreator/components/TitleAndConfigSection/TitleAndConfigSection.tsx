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
import Toggle from 'shared/components/Toggle/Toggle';
import dynamic from 'next/dynamic';

//Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 rounded animate-pulse"></div>,
});

// Import Quill CSS
import 'react-quill/dist/quill.snow.css';

const LOGIC_OPERATORS = [
  '==', '!=', '>', '<', '>=', '<=', '+', '-', 'contains'
];

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
    thankYouLogic,
    setThankYouLogic,
    questions,
  } = useSurveyCreatorContext();

  const { togglePanel, isPanelOpened } = usePreviewPanelContext();

  const {
    isModalOpen: isOptionsModalOpen,
    closeModal: closeOptionsSurveyModal,
    openModal: openOptionsSurveyModal,
  } = useModal();

  const [disclaimerOpen, setDisclaimerOpen] = useState(showDisclaimer);
  const [thankYouLogicOpen, setThankYouLogicOpen] = useState(false);

  // Quill editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  // Helper: get question label
  const getQuestionLabel = (q, idx) => `Q${idx + 1}: ${q.title}`;

  // Handler: add rule
  const addRule = () => {
    setThankYouLogic([
      ...thankYouLogic,
      { conditions: [{ question: '', operator: '==', value: '' }], message: '' },
    ]);
  };
  // Handler: remove rule
  const removeRule = (i) => {
    setThankYouLogic(thankYouLogic.filter((_, idx) => idx !== i));
  };
  // Handler: update rule
  const updateRule = (i, rule) => {
    setThankYouLogic(thankYouLogic.map((r, idx) => (idx === i ? rule : r)));
  };
  // Handler: add condition to rule
  const addCondition = (i) => {
    const rule = thankYouLogic[i];
    updateRule(i, { ...rule, conditions: [...rule.conditions, { question: '', operator: '==', value: '' }] });
  };
  // Handler: remove condition from rule
  const removeCondition = (i, ci) => {
    const rule = thankYouLogic[i];
    updateRule(i, { ...rule, conditions: rule.conditions.filter((_, idx) => idx !== ci) });
  };
  // Handler: update condition in rule
  const updateCondition = (i, ci, cond) => {
    const rule = thankYouLogic[i];
    const newConds = rule.conditions.map((c, idx) => (idx === ci ? { ...c, ...cond } : c));
    updateRule(i, { ...rule, conditions: newConds });
  };

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
            <label className="block text-sm font-medium text-gray-700">Isi disclaimer (rich text editor)</label>
            <div className="border rounded">
              <ReactQuill
                theme="snow"
                value={disclaimerBody}
                onChange={setDisclaimerBody}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Tulis isi disclaimer di sini..."
                // style={{ minHeight: '200px' }}
              />
            </div>
            {/* <div className="text-xs text-gray-500 mb-2">
              Gunakan toolbar di atas untuk format teks: <b>tebal</b>, <i>miring</i>, <u>garis bawah</u>, dll.
            </div> */}
          </div>
        )}
      </div>

      {/* Custom Thank You Logic Section */}
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <div className="flex items-center mb-2 font-semibold text-gray-700">
          <button
            type="button"
            className="btn relative flex items-center justify-center btn-secondary h-[38px] px-3 py-1 text-sm bg-secondary-50 mr-2"
            onClick={() => setThankYouLogicOpen(!thankYouLogicOpen)}
            aria-label={thankYouLogicOpen ? 'Tutup custom thank you logic' : 'Buka custom thank you logic'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className={`w-[15px] transition-transform ${thankYouLogicOpen ? '' : '-rotate-90'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <span className="flex-1">Custom Thank You Logic</span>
        </div>
        {thankYouLogicOpen && (
          <div className="space-y-4 mt-2">
            {thankYouLogic.map((rule, i) => (
              <div key={i} className="border rounded p-3 bg-white">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-sm text-gray-700 mr-2">Rule {i + 1}</span>
                  <button type="button" className="ml-auto text-xs text-red-500" onClick={() => removeRule(i)}>Hapus Rule</button>
                </div>
                {rule.conditions.map((cond, ci) => (
                  <div key={ci} className="flex items-center gap-2 mb-2">
                    <select
                      className="border rounded px-1 py-0.5 text-sm"
                      value={cond.question}
                      onChange={e => updateCondition(i, ci, { question: e.target.value })}
                    >
                      <option value="">Pilih pertanyaan</option>
                      {questions.map((q, idx) => (
                        <option key={q.draftId || q.id} value={q.draftId || q.id}>{getQuestionLabel(q, idx)}</option>
                      ))}
                    </select>
                    <select
                      className="border rounded px-1 py-0.5 text-sm"
                      value={cond.operator}
                      onChange={e => updateCondition(i, ci, { operator: e.target.value })}
                    >
                      {LOGIC_OPERATORS.map(op => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                    <input
                      className="border rounded px-1 py-0.5 text-sm"
                      value={cond.value}
                      onChange={e => updateCondition(i, ci, { value: e.target.value })}
                      placeholder="Nilai"
                    />
                    {rule.conditions.length > 1 && (
                      <button type="button" className="text-xs text-red-400" onClick={() => removeCondition(i, ci)}>Hapus</button>
                    )}
                  </div>
                ))}
                <button type="button" className="text-xs text-blue-600 mb-2" onClick={() => addCondition(i)}>+ Tambah Condition</button>
                <div className="mt-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pesan jika rule match</label>
                  <textarea
                    className="w-full border rounded px-2 py-1 text-sm"
                    rows={2}
                    placeholder="Pesan yang akan ditampilkan jika kondisi terpenuhi"
                    value={rule.message}
                    onChange={e => updateRule(i, { ...rule, message: e.target.value })}
                  />
                </div>
              </div>
            ))}
            <button type="button" className="text-xs text-blue-600" onClick={addRule}>+ Tambah Rule</button>
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
