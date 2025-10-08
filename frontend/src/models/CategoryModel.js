/**
 * Represents a category with optional subcategories.
 */
export default class CategoryModel {
  /**
   * Creates an instance of CategoryModel.
   *
   * @param {Object} data - The category data.
   * @param {string} data._id - Unique identifier of the category.
   * @param {string} data.name - The category name.
   * @param {string[]} [data.subcategories=[]] - An array of subcategory names.
   */
  constructor(data) {
    /** @type {string} */
    this.id = data._id

    /** @type {string} */
    this.name = data.name

    /** @type {string[]} */
    this.subcategories = Array.isArray(data.subcategories)
      ? data.subcategories
      : []

    /** @type {string} */
    this.type = data.type
  }

  /**
   * Returns the number of subcategories in this category.
   * @returns {number}
   */
  get subcategoryCount() {
    return this.subcategories.length
  }

  /**
   * Returns true if the category has subcategories.
   * @returns {boolean}
   */
  hasSubcategories() {
    return this.subcategories.length > 0
  }
}
