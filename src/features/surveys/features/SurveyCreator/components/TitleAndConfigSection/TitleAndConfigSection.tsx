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
  const [thankYouLogicEnabled, setThankYouLogicEnabled] = useState(false);

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
  const getQuestionLabel = (q: any, idx: number) => `Q${idx + 1}: ${q.title}`;

  // Handler: add rule
  const addRule = () => {
    setThankYouLogic([
      ...thankYouLogic,
      { conditions: [{ question: '', operator: '==', value: '' }], message: '' },
    ]);
  };
  // Handler: remove rule
  const removeRule = (i: number) => {
    setThankYouLogic(thankYouLogic.filter((_, idx) => idx !== i));
  };
  // Handler: update rule
  const updateRule = (i: number, rule: any) => {
    setThankYouLogic(thankYouLogic.map((r, idx) => (idx === i ? rule : r)));
  };
  // Handler: add condition to rule
  const addCondition = (i: number) => {
    const rule = thankYouLogic[i];
    updateRule(i, { ...rule, conditions: [...rule.conditions, { question: '', operator: '==', value: '' }] });
  };
  // Handler: remove condition from rule
  const removeCondition = (i: number, ci: number) => {
    const rule = thankYouLogic[i];
    updateRule(i, { ...rule, conditions: rule.conditions.filter((_: any, idx: number) => idx !== ci) });
  };
  // Handler: update condition in rule
  const updateCondition = (i: number, ci: number, cond: any) => {
    const rule = thankYouLogic[i];
    const newConds = rule.conditions.map((c: any, idx: number) => (idx === ci ? { ...c, ...cond } : c));
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
            // onClick={() => setDisclaimerOpen(!disclaimerOpen)}
            onClick={() => {
              if (showDisclaimer) {
                setDisclaimerOpen(!disclaimerOpen);
              }
            }}
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
            <input
              type="text"
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Judul disclaimer"
              value={disclaimerTitle}
              onChange={e => setDisclaimerTitle(e.target.value)}
            />
            <div className="border rounded">
              <ReactQuill
                theme="snow"
                value={disclaimerBody}
                onChange={setDisclaimerBody}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Tulis isi disclaimer di sini..."
                style={{ 
                  minHeight: '120px',
                  fontSize: '14px'
                }}
                className="quill-editor-custom"
              />
            </div>
            {/* <div className="text-xs text-gray-500 mb-2">
              Gunakan toolbar di atas untuk format teks: <b>tebal</b>, <i>miring</i>, <u>garis bawah</u>, dll.
            </div> */}
          </div>
        )}
      </div>

      {/* Custom Thank You Logic Section */}
      <div className="mt-4 p-4 border rounded bg-gray-50 w-full">
        <div className="flex items-center mb-2 font-semibold text-gray-700">
          <button
            type="button"
            className="btn relative flex items-center justify-center btn-secondary h-[38px] px-3 py-1 text-sm bg-secondary-50 mr-2"
            onClick={() => {
              if (thankYouLogicEnabled) {
                setThankYouLogicOpen(!thankYouLogicOpen);
              }
            }}
            aria-label={thankYouLogicOpen ? 'Tutup custom thank you logic' : 'Buka custom thank you logic'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" className={`w-[15px] transition-transform ${thankYouLogicOpen ? '' : '-rotate-90'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <span className="flex-1">Custom Thank You Logic</span>
          <Toggle
            isEnabled={thankYouLogicEnabled}
            onToggle={v => { 
              setThankYouLogicEnabled(v); 
              if (v) {
                setThankYouLogicOpen(true);
              } else {
                setThankYouLogicOpen(false);
              }
            }}
            classNames="ml-2"
          />
        </div>
        {thankYouLogicEnabled && thankYouLogicOpen && (
          <div className="space-y-4 mt-2 w-full">
            {thankYouLogic.map((rule: any, i: number) => (
              <div key={i} className="border rounded p-3 bg-white w-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm text-gray-700">Rule {i + 1}</span>
                  <button 
                    type="button" 
                    className="text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded hover:bg-red-50" 
                    onClick={() => removeRule(i)}
                  >
                    Hapus Rule
                  </button>
                </div>
                {rule.conditions.map((cond: any, ci: number) => (
                  <div key={ci} className="space-y-2 mb-3">
                    <div className="flex flex-col sm:flex-row gap-2 w-full items-end">
                      <div className="flex-1 min-w-0">
                        <select
                          className="w-full border rounded px-3 py-2 h-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={cond.question}
                          onChange={e => updateCondition(i, ci, { question: e.target.value })}
                        >
                          <option value="">Pilih pertanyaan</option>
                          {questions.map((q: any, idx: number) => (
                            <option key={q.draftId || q.id} value={q.draftId || q.id}>{getQuestionLabel(q, idx)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1 min-w-0">
                        <select
                          className="w-full border rounded px-3 py-2 h-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={cond.operator}
                          onChange={e => updateCondition(i, ci, { operator: e.target.value })}
                        >
                          {LOGIC_OPERATORS.map((op: string) => (
                            <option key={op} value={op}>{op}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1 min-w-0">
                        <input
                          className="w-full border rounded px-3 py-2 h-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={cond.value}
                          onChange={e => updateCondition(i, ci, { value: e.target.value })}
                          placeholder="Nilai"
                        />
                      </div>
                      {rule.conditions.length > 1 && (
                        <div className="flex-shrink-0 w-full sm:w-auto">
                          <button 
                            type="button" 
                            className="w-full sm:w-auto px-3 py-2 h-10 text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded transition-colors duration-200" 
                            onClick={() => removeCondition(i, ci)}
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors mb-3 px-2 py-1 rounded hover:bg-blue-50" 
                  onClick={() => addCondition(i)}
                >
                  + Tambah Condition
                </button>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Pesan jika rule match</label>
                  <textarea
                    className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                    rows={3}
                    placeholder="Pesan yang akan ditampilkan jika kondisi terpenuhi"
                    value={rule.message}
                    onChange={e => updateRule(i, { ...rule, message: e.target.value })}
                  />
                </div>
              </div>
            ))}
            <button 
              type="button" 
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 rounded border border-blue-200 hover:bg-blue-50 w-full sm:w-auto" 
              onClick={addRule}
            >
              + Tambah Rule
            </button>
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
