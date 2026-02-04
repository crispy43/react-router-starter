// * localize 템플릿 문자열 치환
export const replaceT = (template: string, params: Record<string, string>) => {
  return template.replace(/{{(.*?)}}/g, (_, key) => params[key.trim()] ?? key);
};

// * 세자리 콤마
export const toComma = (
  value: number | string,
  maxDecimals: number | undefined = 4,
  minDecimals?: number,
) => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  return value.toLocaleString(undefined, {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: minDecimals,
  });
};

// * Query string으로 변환
export const formatQuery = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'undefined') return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (typeof v !== 'undefined') {
          searchParams.append(key, encodeURIComponent(String(v)));
        }
      });
    } else {
      searchParams.append(key, encodeURIComponent(String(value)));
    }
  });
  return searchParams.toString();
};
