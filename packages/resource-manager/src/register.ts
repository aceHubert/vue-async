export type SuspenseOptions = {
  mode?: 'visible' | 'hidden';
};

export const suspenseOptions: Required<SuspenseOptions> = {
  mode: 'visible',
};

export const setSuspenseOptions = (options: SuspenseOptions) => {
  Object.assign(suspenseOptions, options);
};
