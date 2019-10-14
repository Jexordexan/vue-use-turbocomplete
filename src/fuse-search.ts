import Fuse, { FuseOptions } from 'fuse.js';
import { FormattedData } from './use-autocomplete';
import highlight from './html-highlight';

export function search<T, D = FormattedData<T>>(
  keys: (keyof D)[],
  highlightResults: boolean = false,
  maxMatches: number = 7,
  fuseOptions?: FuseOptions<D>
): (text: string, datalist: D[]) => D[] {
  const options = {
    keys,
    threshold: 0.5,
    includeMatches: highlightResults,
    ...fuseOptions,
  } as const;
  const mapFn: (x: any) => D = highlightResults ? highlight : x => x;
  return (text: string, datalist: D[]) => {
    return new Fuse<D>(datalist, options)
      .search(text)
      .slice(0, maxMatches)
      .map(mapFn);
  };
}
