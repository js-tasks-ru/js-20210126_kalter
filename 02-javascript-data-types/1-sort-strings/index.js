/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const newArray = [...arr];
  const collator = new Intl.Collator(['ru', 'en'], { caseFirst: 'upper'});
  // mdn recommends to use Intl.Collator() for better performance
  const sort = (a, b) => {
    return collator.compare(a, b);
  };

  return newArray.sort((a, b) => {
    if (param === 'desc') {
      return sort(a, b) * -1;
    }

    return sort(a, b);
  });
}
