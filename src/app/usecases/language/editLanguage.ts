import { Language } from "../../../domain/models/Language";
import { languageRepository } from "../../../framework/repository/LanguageRepository";

export const editLanguage = (languageRepository: languageRepository) => async (languageDetails: Language):Promise<Language|null> => {
  const language = await languageRepository.editLanguage(languageDetails);
  if (language) {
    return language;
  } else {
    return null;
  }
}