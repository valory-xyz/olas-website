const stripMarkdown = (markdown) => {
  let plainText = markdown;

  // Remove images: ![alt text](url)
  plainText = plainText.replace(/!\[.*?\]\(.*?\)/g, '');
  // Replace links with just the text: [text](url) -> text
  plainText = plainText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Remove markdown formatting symbols: **, *, __, _, `, # (headings)
  plainText = plainText.replace(/(\*\*|__|\*|_|`|#+)/g, '');
  // Replace newlines with spaces
  plainText = plainText.replace(/\n+/g, ' ');
  // Collapse multiple spaces into one and trim
  plainText = plainText.replace(/\s+/g, ' ').trim();

  return plainText;
};

export const getLimitedText = (input, charLimit) => {
  const plainText = stripMarkdown(input);
  const words = plainText.split(/\s+/); // Split on whitespace (space, tab, newline)

  const limitedWords = [];
  let currentLength = 0;

  for (const word of words) {
    const extraSpace = limitedWords.length > 0 ? 1 : 0;
    const newLength = currentLength + word.length + extraSpace;

    if (newLength > charLimit) {
      break;
    }

    limitedWords.push(word);
    currentLength = newLength;
  }

  return limitedWords.join(' ');
};
