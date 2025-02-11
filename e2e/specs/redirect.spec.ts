import { test, expect } from '@playwright/test';
import { allowTrailingSlash } from '../utils/url';

// To run this test locally you will need to run: pnpm run start-ci;
// Also, make sure that you have pm2 installed globally via: pnpm install -g pm2

const pathsToTest = [
  ['/challenges', '/learn'],
  ['/learn/front-end-libraries', 'learn/front-end-development-libraries'],
  [
    '/learn/front-end-libraries/bootstrap',
    '/learn/front-end-development-libraries/bootstrap'
  ],
  [
    '/learn/front-end-libraries/front-end-libraries-projects',
    '/learn/front-end-development-libraries/front-end-development-libraries-projects'
  ],
  [
    '/learn/front-end-libraries/front-end-libraries-projects/build-a-random-quote-machine',
    '/learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-random-quote-machine'
  ],
  [
    '/certification/certifieduser/front-end-libraries',
    '/certification/certifieduser/front-end-development-libraries'
  ],
  [
    '/learn/front-end-libraries/bootstrap/use-responsive-design-with-bootstrap-fluid-containers',
    '/learn/front-end-development-libraries/bootstrap/use-responsive-design-with-bootstrap-fluid-containers'
  ],
  ['/learn/apis-and-microservices', 'learn/back-end-development-and-apis'],
  [
    '/learn/apis-and-microservices/managing-packages-with-npm',
    '/learn/back-end-development-and-apis/managing-packages-with-npm'
  ],
  [
    '/learn/apis-and-microservices/managing-packages-with-npm/how-to-use-package-json-the-core-of-any-node-js-project-or-npm-package',
    '/learn/back-end-development-and-apis/managing-packages-with-npm/how-to-use-package-json-the-core-of-any-node-js-project-or-npm-package'
  ],
  [
    '/learn/apis-and-microservices/apis-and-microservices-projects',
    '/learn/back-end-development-and-apis/back-end-development-and-apis-projects'
  ],
  [
    '/learn/apis-and-microservices/apis-and-microservices-projects/timestamp-microservice',
    '/learn/back-end-development-and-apis/back-end-development-and-apis-projects/timestamp-microservice'
  ],
  [
    '/certification/certifieduser/apis-and-microservices',
    '/certification/certifieduser/back-end-development-and-apis'
  ],
  [
    '/learn/responsive-web-design/applied-visual-design/adjust-the-size-of-a-header-versus-a-paragraph-tag',
    '/learn/responsive-web-design/applied-visual-design/adjust-the-size-of-a-heading-element-versus-a-paragraph-element'
  ],
  [
    '/learn/javascript-algorithms-and-data-structures/es6/explore-differences-between-the-var-and-let-keywords',
    '/learn/javascript-algorithms-and-data-structures/basic-javascript/explore-differences-between-the-var-and-let-keywords'
  ],
  [
    '/learn/javascript-algorithms-and-data-structures/es6/declare-a-read-only-variable-with-the-const-keyword',
    '/learn/javascript-algorithms-and-data-structures/basic-javascript/declare-a-read-only-variable-with-the-const-keyword'
  ],
  ['/challenges/responsive-web-design', '/learn/responsive-web-design'],
  [
    '/challenges/responsive-web-design/basic-html-and-html5',
    '/learn/responsive-web-design/basic-html-and-html5'
  ],
  [
    '/challenges/responsive-web-design/basic-html-and-html5/say-hello-to-html-elements',
    '/learn/responsive-web-design/basic-html-and-html5/say-hello-to-html-elements'
  ]
];

test.describe('Legacy Challenge Path Redirection Tests', () => {
  for (const [input, expected] of pathsToTest) {
    test(`should redirect from ${input} to ${expected}`, async ({ page }) => {
      await page.goto(input);
      await expect(page).toHaveURL(allowTrailingSlash(expected));
    });
  }
});
