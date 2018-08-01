function noEmptyItem (arr, prop) {
  if (!Array.isArray(arr)) return true;
  if (prop) {
    return arr.every(n => n[prop] || parseInt(n[prop]) === 0);
  } else {
    return arr.every(n => n || parseInt(n) === 0);
  }
}
export {noEmptyItem};
