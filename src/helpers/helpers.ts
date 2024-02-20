'use client'
/**
 * Formats a JavaScript Date object into the string "Wed, Jan 2022 4:30PM" format.
 * @param {Date} date - The Date object to be formatted.
 * @returns {string} A string representing the formatted date.
 */
const formatDate = (dateString: string): string => {
    if (!dateString) {
        return ''
    }
    const date = new Date(dateString)

    // Check if the date is invalid
    if (isNaN(date.getTime())) {
        return ''
    }

    const options: Intl.DateTimeFormatOptions = {
        // weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }

    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
    return dateTimeFormat.format(date)
}

/**
 * Gets the full name from the provided data.
 * If the data has a 'relationship' property, it returns that.
 * If the data has 'firstName' and 'lastName' properties, it concatenates them to form the full name.
 * If neither condition is met, it returns a dash ('-').
 *
 * @param {any} data - The data object containing information for extracting the full name.
 * @returns {string} The full name or a dash if not available.
 */
function getFullName(data: any): string {
    if (data?.relationship) {
        // If 'relationship' property is available, return it
        return `${data?.firstName} ${data?.lastName}`
    } else if (data?.firstName) {
        // If 'firstName' and 'lastName' properties are available, concatenate them
        return `${data?.firstName} ${data?.lastName}`
    } else {
        // If none of the conditions are met, return a dash
        return ''
    }
}

export { formatDate, getFullName }
