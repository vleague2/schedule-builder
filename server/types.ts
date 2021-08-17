export type TReturnDto<Data> = {
  data?: Data | undefined;
  error?: string[]; // an error object or a string
};
