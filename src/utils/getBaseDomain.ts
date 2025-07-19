import { parse } from 'tldts';

const getBaseDomain = (url: string): string | false => {
    const parsed = parse(url);

    if (parsed.isIp || !parsed.domainWithoutSuffix) return false;

    return (
      parsed.domainWithoutSuffix.charAt(0).toUpperCase() +
      parsed.domainWithoutSuffix.slice(1)
    );
  };

export { getBaseDomain }