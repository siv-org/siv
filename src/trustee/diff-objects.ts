// Adapted from https://gomakethings.com/getting-the-differences-between-two-objects-with-vanilla-js/

/**
 * Find the differences between two objects and push to a new object
 * @param obj1 The original object
 * @param obj2 The object to compare against it
 * @return     An object of differences between the two
 */
export function diff(obj1: Record<string, unknown>, obj2: Record<string, unknown>) {
  // Make sure an object to compare is provided
  if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
    return obj1
  }

  //
  // Variables
  //

  const diffs: Record<string, unknown> = {}
  let key

  //
  // Methods
  //

  /**
   * Check if two arrays are equal
   * @param arr1 The first array
   * @param arr2 The second array
   * @return     If true, both arrays are equal
   */
  function arraysMatch(arr1: unknown[], arr2: unknown[]) {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false

    // Check if all items exist and are in the same order
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false
    }

    // Otherwise, return true
    return true
  }

  /**
   * Compare two items and push non-matches to object
   * @param item1 The first item
   * @param item2 The second item
   * @param key   The key in our object
   */
  function compare(item1: unknown, item2: unknown, key: string) {
    // Get the object type
    const type1 = Object.prototype.toString.call(item1)
    const type2 = Object.prototype.toString.call(item2)

    // If type2 is undefined it has been removed
    if (type2 === '[object Undefined]') {
      diffs[key] = null
      return
    }

    // If items are different types
    if (type1 !== type2) {
      diffs[key] = item2
      return
    }

    // If an object, compare recursively
    if (type1 === '[object Object]') {
      const objDiff = diff(item1 as Record<string, unknown>, item2 as Record<string, unknown>)
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff
      }
      return
    }

    // If an array, compare
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1 as unknown[], item2 as unknown[])) {
        diffs[key] = item2
      }
      return
    }

    // Else if it's a function, convert to a string and compare
    // Otherwise, just compare
    if (type1 === '[object Function]') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error bc we do know it's a function
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2
      }
    } else {
      if (item1 !== item2) {
        diffs[key] = item2
      }
    }
  }

  //
  // Compare our objects
  //

  // Loop through the first object
  for (key in obj1) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj1.hasOwnProperty(key)) {
      compare(obj1[key], obj2[key], key)
    }
  }

  // Loop through the second object and find missing items
  for (key in obj2) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj2.hasOwnProperty(key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key]
      }
    }
  }

  // Return the object of differences
  return diffs
}
