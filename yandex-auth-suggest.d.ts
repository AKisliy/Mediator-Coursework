interface YaAuthSuggestOptions {
  client_id: string;
  response_type: string;
  redirect_uri: string;
}

interface YaAuthSuggestWidgetOptions {
  view: 'button';
  parentId: string;
  buttonView: 'main' | 'additional';
  buttonTheme: 'light' | 'dark';
  buttonSize: 's' | 'm' | 'l' | 'xl';
  buttonBorderRadius: number;
}

interface YaAuthSuggestResult {
  handler: () => Promise<any>;
}

interface YaAuthSuggest {
  init(
    options: YaAuthSuggestOptions,
    origin: string,
    widgetOptions: YaAuthSuggestWidgetOptions
  ): Promise<YaAuthSuggestResult>;
}

// Расширяем интерфейс Window
declare global {
  interface Window {
    YaAuthSuggest: YaAuthSuggest;
  }
}

export {};
