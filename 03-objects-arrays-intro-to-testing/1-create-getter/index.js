/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export const createGetter = path => {
  const pathArray = path.split('.');

  return obj => {
    let currentReference = obj;

    for (let i = 0; i < pathArray.length; i++) {
      currentReference = currentReference[pathArray[i]];

      if (!currentReference) {
        break;
      }
    }

    return currentReference;
  };
};
