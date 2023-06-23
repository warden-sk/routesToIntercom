/*
 * Copyright 2023 Marek Kobida
 */

function template(text) {
  return `/*
 * Copyright 2023 Marek Kobida
 */

import type { Account } from '../../server/storages/AccountStorage';
import type { Category } from '../../server/storages/CategoryStorage';
import type { TransformedApplication } from '../../server/transformers/transformApplication';
import type { TransformedApplicationVersion } from '../../server/transformers/transformApplicationVersion';

class Intercom {
  static VERSION = '1.0.0+${+new Date()}';

${text}
}

export default Intercom;
`;
}

exports.default = template;
