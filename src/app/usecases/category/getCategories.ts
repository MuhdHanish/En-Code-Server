import { Category } from "../../../domain/models/Category";
import { categoryRepository } from "../../../framework/repository/categoryRepository";

export const getCategories = (categoryRepository: categoryRepository) => async ():Promise<Category[]|null> => {
 const categories = await categoryRepository.getCategoriesByCredentail({});
 return categories;
}