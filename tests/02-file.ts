/*
 * Copyright 2024 Marek Kobida
 * Last Updated: 28.06.2024
 */

import Pattern from '@helpers/Pattern';
import router from '@server/router';

const PATTERN = new Pattern<{ id?: string; language: string }>('/:language/product/:id?').getServerRoutePattern();

router.createAuthorizedRoute('DELETE', PATTERN, async () => {});
