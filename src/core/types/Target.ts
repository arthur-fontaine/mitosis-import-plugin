import type { targets } from '@builder.io/mitosis';

export type Target = keyof typeof targets | (string & {});
