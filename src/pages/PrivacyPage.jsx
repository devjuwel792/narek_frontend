import React from "react";
import { useTranslation } from "react-i18next";

const PrivacyPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h3 class="text-2xl font-bold text-gray-900 mb-6">{t('privacyPage.title')}</h3>

      <div class="space-y-5 text-gray-700 leading-relaxed text-base">
        {t('privacyPage.content', { returnObjects: true }).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPage;
