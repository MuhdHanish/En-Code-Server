import { Category } from "../../../domain/models/Category";
import { categoryRepository } from "../../../framework/repository/categoryRepository";

export const getCategoryByName = (categoryRepository: categoryRepository) => async (categoryname: string):Promise<Category|null> => {
 const category = await categoryRepository.getCategoryByName(categoryname);
 return category;
}