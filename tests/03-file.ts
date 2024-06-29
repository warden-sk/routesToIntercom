/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 28.06.2024
 */

import Pattern from '@helpers/Pattern';
import router from '@server/router';

const PATTERN = new Pattern<{ id: string }>('/product/:id').getServerRoutePattern();

router.createRoute('GET', PATTERN, async ({ id }): Promise<string> => id);
