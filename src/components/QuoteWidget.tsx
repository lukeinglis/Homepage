import { getQuoteOfDay } from "../data/quotes";

export function QuoteWidget() {
  const quote = getQuoteOfDay();

  return (
    <div class="widget quote-widget">
      <blockquote class="quote-text">{quote.text}</blockquote>
      <cite class="quote-author">{quote.author}</cite>
    </div>
  );
}
