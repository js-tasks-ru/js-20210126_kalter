/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr = []) {
  const newArray = [];
  const itemsExistence = {};

  for (const item of arr) {
    if (itemsExistence[item]) {
      continue;
    }

    newArray.push(item);
    itemsExistence[item] = true;
  }

  return newArray;
}
