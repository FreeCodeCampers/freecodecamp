import { createTypes, createAsyncTypes } from '../../utils/create-types';

export const ns = 'settings';

export const actionTypes = createTypes(
  [
    ...createAsyncTypes('validateUsername'),
    ...createAsyncTypes('submitNewAbout'),
    ...createAsyncTypes('submitNewUsername'),
    ...createAsyncTypes('updateMyEmail'),
    ...createAsyncTypes('updateMySocials'),
    ...createAsyncTypes('updateMySound'),
    ...createAsyncTypes('updateMyKeyboardShortcuts'),
    ...createAsyncTypes('updateMyHonesty'),
    ...createAsyncTypes('updateMyCareer'),
    ...createAsyncTypes('updateMyQuincyEmail'),
    ...createAsyncTypes('updateMyPortfolio'),
    ...createAsyncTypes('submitProfileUI'),
    ...createAsyncTypes('verifyCert'),
    ...createAsyncTypes('resetProgress'),
    ...createAsyncTypes('resetMyEditorLayout'),
    ...createAsyncTypes('deleteAccount')
  ],
  ns
);
