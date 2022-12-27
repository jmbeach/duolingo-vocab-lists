import axiod from 'https://deno.land/x/axiod@0.26.2/mod.ts';
interface TranslateOptions {
  key: string;
  target: string;
  source: string;
  q: string;
}
interface TranslateResult {
  data: {
    translations: {
      translatedText: string;
    }[];
  };
}
export default async function googleTranslate({
  key,
  target,
  source,
  q,
}: TranslateOptions) {
  const urlParams = new URLSearchParams({
    key,
    target,
    source,
    q,
  }).toString();
  return await axiod.post<TranslateResult>(
    `https://translation.googleapis.com/language/translate/v2?${urlParams}`
  );
}
