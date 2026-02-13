type TPredicateFn<T> = (item: T) => boolean;

export const isExistBy = async <T>(
  data: T[],
  predicate: TPredicateFn<T>,
): Promise<boolean> => {
  return data.some(predicate);
};

export const findByPredicate = async <T>(
  data: T[],
  predicate: TPredicateFn<T>,
): Promise<T | undefined> => {
  return data.find(predicate);
};

/**
 * 找出指定 id 在工作表中的列索引（0-based，不含標題列）
 * 回傳 { sheetIndex,item } 或 undefined
 */
export const findWithIndex = <T>(
  data: T[],
  predicate: TPredicateFn<T>,
): { item: T; sheetIndex: number } | undefined => {
  const index = data.findIndex(predicate);
  if (index === -1) return undefined;

  const item = data[index];
  if (item === undefined) return undefined;

  const sheetIndex = index + 2; // +2: 1 for 1-based, 1 for header

  return { sheetIndex, item };
};
