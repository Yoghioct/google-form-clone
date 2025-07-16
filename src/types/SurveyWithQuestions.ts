import { Survey } from '@prisma/client';
import { QuestionWithLogicPath } from 'types/QuestionWithLogicPath';

export type SurveyWithQuestions = Survey & {
  questions: QuestionWithLogicPath[];
  showDisclaimer?: boolean;
  disclaimerTitle?: string;
  disclaimerBody?: string;
  thankYouLogic?: any;
};
