import { dateToCustom } from "../utils/formatNumber"

/**
 * Represents a user
 */
export default class UserModel {
  /**
   * Creates an instance of UserModel.
   *
   * @param {Object} data - The user data.
   * @param {string} data.id - Unique identifier of the user.
   * @param {string} data.name - User's name.
   * @param {string} data.email - User's email address.
   * @param {string} data.role - Role of the user (e.g., admin, user).
   * @param {string|null} data.lastConnection - ISO date string of last connection or null.
   * @param {string} data.createdAt - ISO date string of user creation.
   * @param {string} data.updatedAt - ISO date string of last update.
   */

  constructor(data) {
    /** @type {string} */
    this.id = data._id 

    /** @type {string} */
    this.firstName = data.firstName

    /** @type {string} */
    this.lastName = data.lastName

    /** @type {string} */
    this.fullName = `${data.firstName} ${data.lastName}`

    /** @type {string} */
    this.email = data.email

    /** @type {string} */
    this.role = data.role

    /** @type {Date|null} */
    this.lastConnection = dateToCustom(data.lastConnection)

    /** @type {Date} */
    this.createdAt = new Date(data.createdAt)

    /** @type {Date} */
    this.updatedAt = new Date(data.updatedAt)

    console.log("UserModel instance created:", this)
  }
}
