import { execSync } from 'child_process';
import { test, expect, Page } from '@playwright/test';
import translations from '../client/i18n/locales/english/translations.json';
import { alertToBeVisible } from './utils/alerts';
import {
  deleteAllEmails,
  getAllEmails,
  getFirstEmail,
  getSubject
} from './utils/mailhog';

test.describe('Claim a certification - almost certified user', () => {
  test.beforeEach(async () => {
    await deleteAllEmails();
    execSync('node ./tools/scripts/seed/seed-demo-user --unclaimed-user');
  });

  test.afterAll(() => {
    execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
  });
  test.use({ storageState: 'playwright/.auth/certified-user.json' });

  test('User receives a congratulations email on completing all certs', async ({
    page
  }) => {
    await page.goto('/settings#cert-front-end-development-libraries');
    await page
      .getByRole('button', { name: 'Claim Certification Front End' })
      .click();
    // verify that an email is sent
    await expect(async () => {
      const emails = await getAllEmails();
      expect(emails.items).toHaveLength(1);
      expect(getSubject(getFirstEmail(emails))).toBe(
        'Congratulations on completing all of the freeCodeCamp certifications!'
      );
    }).toPass();
  });
});

test.describe('Certification page - Non Microsoft', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/certification/certifieduser/responsive-web-design');
  });

  test('The certificate page has a donation section', async ({ page }) => {
    const donationSection = page.getByTestId('donation-section');
    await expect(donationSection).toBeVisible();

    const donationText = donationSection.getByTestId('donation-text');
    await expect(donationText).toHaveText(translations.donate['only-you']);

    const donationForm = donationSection.getByTestId('donation-tier-selector');
    await expect(donationForm).toBeVisible();
  });

  test('Verify the certificate itself', async ({ page }) => {
    const certWrapper = page.getByTestId('cert-wrapper');
    await expect(certWrapper).toBeVisible();

    const header = certWrapper.getByTestId('cert-header');
    await expect(header).toBeVisible();
    const fccLogo = header.getByTestId('cert-fcc-logo');
    await expect(fccLogo).toBeVisible();
    // Non Microsoft certs should not have this one
    const microsoftLogo = header.getByTestId('cert-microsoft-logo');
    await expect(microsoftLogo).not.toBeVisible();

    const certInfoContainer = certWrapper.getByTestId('cert-info-container');
    await expect(certInfoContainer).toBeVisible();
    const certTitle = certInfoContainer.getByTestId('certification-title');
    await expect(certTitle).toHaveText(
      translations.certification.title['responsive-web-design']
    );

    const footer = certWrapper.getByTestId('cert-footer');
    await expect(footer).toBeVisible();
    const QunicySignature = footer.getByTestId('quincy-signature');
    await expect(QunicySignature).toBeVisible();
    // Non Microsoft certs should not have this one
    const microsoftSignature = footer.getByTestId('microsoft-signature');
    await expect(microsoftSignature).not.toBeVisible();
  });

  test('Validate certificate/social/project links', async ({ page }) => {
    const certLink = page.getByTestId('cert-links');
    await expect(certLink).toBeVisible();

    const linkedinLink = certLink.getByTestId('linkedin-share-btn');
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute(
      'href',
      `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Responsive%20Web%20Design&organizationId=4831032&issueYear=2018&issueMonth=8&certUrl=https://freecodecamp.org/certification/certifieduser/responsive-web-design&certId=certifieduser-rwd`
    );

    const twitterLink = certLink.getByTestId('twitter-share-btn');
    await expect(twitterLink).toBeVisible();
    await expect(twitterLink).toHaveAttribute(
      'href',
      `https://twitter.com/intent/tweet?text=I just earned the Responsive%20Web%20Design certification @freeCodeCamp! Check it out here: https://freecodecamp.org/certification/certifieduser/responsive-web-design`
    );

    const projectLinks = certLink.getByTestId('project-links');
    await expect(projectLinks).toBeVisible();

    const surveyFormLink = projectLinks.getByRole('link', {
      name: 'Build a Survey Form'
    });
    await expect(surveyFormLink).toBeVisible();
    await expect(surveyFormLink).toHaveAttribute(
      'href',
      '/learn/2022/responsive-web-design/build-a-survey-form-project/build-a-survey-form'
    );

    const tributePageLink = projectLinks.getByRole('link', {
      name: 'Build a Tribute Page'
    });
    await expect(tributePageLink).toBeVisible();
    await expect(tributePageLink).toHaveAttribute(
      'href',
      '/learn/2022/responsive-web-design/build-a-tribute-page-project/build-a-tribute-page'
    );

    const technicalDocumentationPageLink = projectLinks.getByRole('link', {
      name: 'Build a Technical Documentation Page'
    });
    await expect(technicalDocumentationPageLink).toBeVisible();
    await expect(technicalDocumentationPageLink).toHaveAttribute(
      'href',
      '/learn/2022/responsive-web-design/build-a-technical-documentation-page-project/build-a-technical-documentation-page'
    );

    const productLandingPageLink = projectLinks.getByRole('link', {
      name: 'Build a Product Landing Page'
    });
    await expect(productLandingPageLink).toBeVisible();
    await expect(productLandingPageLink).toHaveAttribute(
      'href',
      '/learn/2022/responsive-web-design/build-a-product-landing-page-project/build-a-product-landing-page'
    );

    const personalPortfolioWebpageLink = projectLinks.getByRole('link', {
      name: 'Build a Personal Portfolio Webpage'
    });
    await expect(personalPortfolioWebpageLink).toBeVisible();
    await expect(personalPortfolioWebpageLink).toHaveAttribute(
      'href',
      '/learn/2022/responsive-web-design/build-a-personal-portfolio-webpage-project/build-a-personal-portfolio-webpage'
    );

    await expect(
      page.getByText(
        'If you suspect that any of these projects violate the academic honesty policy, please report this to our team.'
      )
    ).toBeVisible();

    const policyLink = projectLinks.getByRole('link', {
      name: 'academic honesty policy'
    });
    await expect(policyLink).toHaveAttribute(
      'href',
      'https://www.freecodecamp.org/news/academic-honesty-policy/'
    );

    const reportLink = projectLinks.getByRole('link', {
      name: 'report this to our team'
    });
    await expect(reportLink).toHaveAttribute(
      'href',
      '/user/certifieduser/report-user'
    );
  });
});

test.describe('Invalid certification page', () => {
  const testInvalidCertification = async ({ page }: { page: Page }) => {
    {
      await page.goto('/certification/certifieduser/invalid-certification');
      await expect(page).toHaveURL('/');
      await alertToBeVisible(page, translations.flash['certificate-missing']);
    }
  };
  test.describe('for authenticated user', () => {
    test(
      'it should redirect to / and display an error message',
      testInvalidCertification
    );
  });

  test.describe('for unauthenticated user', () => {
    test.use({ storageState: { cookies: [], origins: [] } });
    test(
      'it should redirect to / and display an error message',
      testInvalidCertification
    );
  });
});

test.describe('Certification page - Microsoft', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      'certification/certifieduser/foundational-c-sharp-with-microsoft'
    );
  });

  test('The certificate page has a donation section', async ({ page }) => {
    const donationSection = page.getByTestId('donation-section');
    await expect(donationSection).toBeVisible();

    const donationText = donationSection.getByTestId('donation-text');
    await expect(donationText).toHaveText(translations.donate['only-you']);

    const donationForm = donationSection.getByTestId('donation-tier-selector');
    await expect(donationForm).toBeVisible();
  });

  test('Verify the certificate itself', async ({ page }) => {
    const certWrapper = page.getByTestId('cert-wrapper');
    await expect(certWrapper).toBeVisible();

    const header = certWrapper.getByTestId('cert-header');
    await expect(header).toBeVisible();
    const fccLogo = header.getByTestId('cert-fcc-logo');
    await expect(fccLogo).toBeVisible();
    // This is specific to Microsoft certs
    const microsoftLogo = header.getByTestId('cert-microsoft-logo');
    await expect(microsoftLogo).toBeVisible();

    const certInfoContainer = certWrapper.getByTestId('cert-info-container');
    await expect(certInfoContainer).toBeVisible();
    const certTitle = certInfoContainer.getByTestId('certification-title');
    await expect(certTitle).toHaveText(
      translations.certification.title['foundational-c-sharp-with-microsoft']
    );

    const footer = certWrapper.getByTestId('cert-footer');
    await expect(footer).toBeVisible();
    const QunicySignature = footer.getByTestId('quincy-signature');
    await expect(QunicySignature).toBeVisible();
    // This is specific to Microsoft certs
    const microsoftSignature = footer.getByTestId('microsoft-signature');
    await expect(microsoftSignature).toBeVisible();
  });

  test('Validate certificate/social/project links', async ({ page }) => {
    const certLink = page.getByTestId('cert-links');
    await expect(certLink).toBeVisible();

    const linkedinLink = certLink.getByTestId('linkedin-share-btn');
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Foundational%20C%23%20with%20Microsoft&organizationId=4831032&issueYear=2023&issueMonth=9&certUrl=https://freecodecamp.org/certification/certifieduser/foundational-c-sharp-with-microsoft&certId=certifieduser-fcswm'
    );

    const twitterLink = certLink.getByTestId('twitter-share-btn');
    await expect(twitterLink).toBeVisible();
    await expect(twitterLink).toHaveAttribute(
      'href',
      'https://twitter.com/intent/tweet?text=I just earned the Foundational%20C%23%20with%20Microsoft certification @freeCodeCamp! Check it out here: https://freecodecamp.org/certification/certifieduser/foundational-c-sharp-with-microsoft'
    );

    const projectLinks = certLink.getByTestId('project-links');
    await expect(projectLinks).toBeVisible();

    const surveyFormLink = projectLinks.getByRole('link', {
      name: 'Foundational C# with Microsoft Certification Exam'
    });
    await expect(surveyFormLink).toBeVisible();
    await expect(surveyFormLink).toHaveAttribute(
      'href',
      '/learn/foundational-c-sharp-with-microsoft/foundational-c-sharp-with-microsoft-certification-exam/foundational-c-sharp-with-microsoft-certification-exam'
    );

    await expect(
      page.getByText(
        'If you suspect that any of these projects violate the academic honesty policy, please report this to our team.'
      )
    ).toHaveCount(0);
  });
});
