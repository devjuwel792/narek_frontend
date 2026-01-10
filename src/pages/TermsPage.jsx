import React from "react";
import { useTranslation } from "react-i18next";

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div class="">
        <h1 class="text-3xl font-bold mb-8 text-gray-900">
          {t("termsPage.title")}
        </h1>

        {Object.keys(t("termsPage.articles", { returnObjects: true })).map((articleKey) => {
          const article = t(`termsPage.articles.${articleKey}`, { returnObjects: true });
          return (
            <section key={articleKey} class="mb-6">
              <h2 class="text-xl font-semibold mb-2">
                {article.title}
              </h2>
              {article.content.map((paragraph, index) => (
                <p key={index} class={index < article.content.length - 1 ? "mb-2" : ""}>
                  {paragraph}
                </p>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default TermsPage;
