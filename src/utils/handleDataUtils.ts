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
