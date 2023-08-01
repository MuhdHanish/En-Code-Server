import { Language } from "../../../domain/models/Language";
import { languageRepository } from "../../../framework/repository/LanguageRepository";

export const getLanguageById = (languageRepository: languageRepository) => async (languageId: string):Promise<Language|null> => {
  const language = await languageRepository.getLanguageById(languageId);
  if (language) {
    return language;
  } else {
    return null
  }
}