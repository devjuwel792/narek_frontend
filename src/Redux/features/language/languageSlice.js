import i18n from '@/i18n';
import { createSlice } from '@reduxjs/toolkit';
// import i18n from '../../i18n';

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    currentLanguage: localStorage.getItem('language') || 'nl',
  },
  reducers: {
    setLanguage: (state, action) => {
      const lang = action.payload.toLowerCase();
      state.currentLanguage = lang;
      localStorage.setItem('language', lang);
      i18n.changeLanguage(lang);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
