import { FuseResult } from 'fuse.js';

const sanitize = (text: string) => {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const generateHighlightedText = (inputText: string, regions: number[][] = []) => {
  let content = '';
  let nextIndex = 0;

  regions.forEach(region => {
    const lastRegionNextIndex = region[1] + 1;
    const unHighlighted = sanitize(inputText.substring(nextIndex, region[0]));
    const highlighted = sanitize(inputText.substring(region[0], lastRegionNextIndex));

    content += `${unHighlighted}<b>${highlighted}</b>`;
    nextIndex = lastRegionNextIndex;
  });

  content += inputText.substring(nextIndex);

  return content;
};

export default function highlight<T>({ item, matches }: FuseResult<T>): T & { html: string } {
  const highlightedItem = { ...item, html: '' };
  const match = matches[0];
  highlightedItem.html = generateHighlightedText(match.value, match.indices);
  return highlightedItem;
}
