// Reorder the second array based on the order of elements in the first array
export const reorderSecondArray = (firstArray, secondArray) => {
  if (!firstArray || !secondArray) return [];

  // Create a map to store the indices of elements from the first array
  const indexMap = new Map();
  for (let i = 0; i < firstArray.length; i++) {
    indexMap.set(firstArray[i], i);
  }

  // Sort the second array based on the indices in the first array
  secondArray.sort((a, b) => indexMap.get(a) - indexMap.get(b));

  return secondArray;
};
