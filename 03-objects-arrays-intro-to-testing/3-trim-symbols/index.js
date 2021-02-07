/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }

  let newString = "";

  for (let i = 0, currentLetter = "", letterRepetition = 0; i < string.length; i++) {
    if (currentLetter !== string[i]) {
      currentLetter = string[i];
      letterRepetition = 0;
    }

    if (letterRepetition < size) {
      newString += string[i];
    }

    letterRepetition++;
  }

  return newString;
}
