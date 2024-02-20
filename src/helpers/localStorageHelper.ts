/**
 * Save data to localStorage.
 * @param {string} key - The key to save the data under.
 * @param {T} data - The data to be saved.
 */

export const saveToLocalStorage = <T>(key: string, data: T): void => {
    try {
        typeof window !== 'undefined' && localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
        console.error('Error saving data to localStorage:', error) // eslint-disable-line no-console
    }
}

/**
 * Delete data from localStorage for a specific key.
 * @param {string} key - The key to delete data for.
 */
export const deleteFromLocalStorage = (key: string): void => {
    try {
        typeof window !== 'undefined' && localStorage.removeItem(key)
    } catch (error) {
        console.error('Error deleting data from localStorage:', error) // eslint-disable-line no-console
    }
}

/**
 * Get data from localStorage for a specific key.
 * @param {string} key - The key to get data for.
 * @returns {T} - The data retrieved from localStorage, or null if not found.
 */
export const getFromLocalStorage = <T>(key: string): T | null => {
    try {
        const data = typeof window !== 'undefined' && localStorage.getItem(key)
        return data ? JSON.parse(data) : null
    } catch (error) {
        console.error('Error getting data from localStorage:', error) // eslint-disable-line no-console
        return null
    }
}
