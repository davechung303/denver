import type { Metadata } from "next";
import Link from "next/link";
import { fitTitle, fitDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: fitTitle("Privacy Policy"),
  description: fitDescription(
    "How Dave Loves Denver handles data: analytics, affiliate links, advertising through Mediavine, and the choices you have."
  ),
  openGraph: {
    url: "https://davelovesdenver.com/privacy",
  },
  alternates: {
    canonical: "https://davelovesdenver.com/privacy",
  },
};

const CONTACT_EMAIL = "davelovesdenver@gmail.com";
const EFFECTIVE_DATE = "November 15, 2026";

// Required by Mediavine, copied verbatim from
// https://help.mediavine.com/privacy-policy-language (updated 05/09/2022).
// Mediavine's Privacy Policy Health Check looks for this exact text,
// including the version number in the heading. Do not edit it.
const MEDIAVINE_POLICY_HTML = `<h3>Mediavine Programmatic Advertising (Ver 1.1)</h3>
<p>The Website works with Mediavine to manage third-party interest-based advertising appearing on the Website. Mediavine serves content and advertisements when you visit the Website, which may use first and third-party cookies. A cookie is a small text file which is sent to your computer or mobile device (referred to in this policy as a “device”) by the web server so that a website can remember some information about your browsing activity on the Website.</p>
<p>First party cookies are created by the website that you are visiting. A third-party cookie is frequently used in behavioral advertising and analytics and is created by a domain other than the website you are visiting. Third-party cookies, tags, pixels, beacons and other similar technologies (collectively, “Tags”) may be placed on the Website to monitor interaction with advertising content and to target and optimize advertising. Each internet browser has functionality so that you can block both first and third-party cookies and clear your browser’s cache. The "help" feature of the menu bar on most browsers will tell you how to stop accepting new cookies, how to receive notification of new cookies, how to disable existing cookies and how to clear your browser’s cache. For more information about cookies and how to disable them, you can consult the information at <a href="https://www.allaboutcookies.org/manage-cookies/" target="_blank" rel="noreferrer noopener nofollow">All About Cookies</a>.</p>
<p>Without cookies you may not be able to take full advantage of the Website content and features. Please note that rejecting cookies does not mean that you will no longer see ads when you visit our Site. In the event you opt-out, you will still see non-personalized advertisements on the Website.</p>
<p>The Website collects the following data using a cookie when serving personalized ads:</p>
<ul><li>IP Address</li><li>Operating System type</li><li>Operating System version</li><li>Device Type</li><li>Language of the website</li><li>Web browser type</li><li>Email (in hashed form)</li></ul>
<p>Mediavine Partners (companies listed below with whom Mediavine shares data) may also use this data to link to other end user information the partner has independently collected to deliver targeted advertisements. Mediavine Partners may also separately collect data about end users from other sources, such as advertising IDs or pixels, and link that data to data collected from Mediavine publishers in order to provide interest-based advertising across your online experience, including devices, browsers and apps. This data includes usage data, cookie information, device information, information about interactions between users and advertisements and websites, geolocation data, traffic data, and information about a visitor’s referral source to a particular website. Mediavine Partners may also create unique IDs to create audience segments, which are used to provide targeted advertising.</p>
<p>If you would like more information about this practice and to know your choices to opt-in or opt-out of this data collection, please visit <a href="https://thenai.org/opt-out/" target="_blank" rel="noreferrer noopener nofollow">National Advertising Initiative opt out page</a>. You may also visit <a href="http://optout.aboutads.info/#/" target="_blank" rel="noreferrer noopener nofollow">Digital Advertising Alliance website</a> and <a href="http://optout.networkadvertising.org/#" target="_blank" rel="noreferrer noopener nofollow">Network Advertising Initiative website</a> to learn more information about interest-based advertising. You may download the AppChoices app at <a href="https://youradchoices.com/appchoices" target="_blank" rel="noreferrer noopener nofollow">Digital Advertising Alliance’s AppChoices app</a> to opt out in connection with mobile apps, or use the platform controls on your mobile device to opt out.</p>
<p>For specific information about Mediavine Partners, the data each collects and their data collection and privacy policies, please visit <a href="https://www.mediavine.com/ad-partners/" target="_blank" rel="noreferrer noopener nofollow">Mediavine Partners</a>.</p>`;

const h2 = "text-2xl font-bold text-foreground mt-12";

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-denver-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-5xl md:text-6xl font-bold">Privacy Policy</h1>
          <p className="mt-4 text-white/70 text-xl">Effective {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            This policy explains what information davelovesdenver.com (&ldquo;Dave Loves Denver,&rdquo;
            &ldquo;the Website,&rdquo; &ldquo;I&rdquo; or &ldquo;we&rdquo;) collects when you visit, how it&apos;s used,
            and the choices you have.
          </p>
          <p>
            You don&apos;t need an account to use this site, and there are no sign-up or contact forms. I
            don&apos;t sell lists of visitors, and I never ask for your name, address or payment details.
          </p>

          <h2 className={h2}>What gets collected</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <strong>Analytics.</strong> The site uses Google Analytics 4 to understand which pages people read
              and how they found them. It uses cookies and collects things like pages viewed, approximate
              location, device and browser type, and which links you click. See{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
                how Google uses this data
              </a>
              .
            </li>
            <li>
              <strong>Hosting and security.</strong> The site is hosted on Vercel. Like any web server, it
              receives your IP address and basic request details, which are used to deliver pages and block
              abusive traffic.
            </li>
            <li>
              <strong>Embedded content.</strong> YouTube videos load only when you click play; once you do,
              YouTube may set its own cookies. Maps are drawn with OpenStreetMap tiles, which means your browser
              requests map images from those servers.
            </li>
            <li>
              <strong>Advertising.</strong> Ads on the site are served by Mediavine, which uses cookies and
              similar technologies as described in the Mediavine section below.
            </li>
          </ul>

          <h2 className={h2}>Affiliate links</h2>
          <p>
            Some links &mdash; hotel bookings, event tickets and tours &mdash; are affiliate links to partners
            such as Expedia, Viator and Ticketmaster. When you click one, that partner may set a cookie so it
            can credit this site if you book. I earn a commission at no extra cost to you. Anything you book is
            handled on the partner&apos;s site under its own privacy policy.
          </p>

          <h2 className={h2}>Advertising</h2>
          <div dangerouslySetInnerHTML={{ __html: MEDIAVINE_POLICY_HTML }} />

          <h2 className={h2}>Your choices</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Block or delete cookies in your browser settings.</li>
            <li>
              Opt out of Google Analytics with the{" "}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                Google Analytics opt-out add-on
              </a>
              .
            </li>
            <li>Turn on Global Privacy Control (GPC) in your browser to signal an opt-out of targeted advertising.</li>
            <li>Use the opt-out links in the Mediavine section above for interest-based ads.</li>
          </ul>
          <p>
            Depending on where you live, including Colorado and California, you may have the right to access,
            correct or delete personal data, or to opt out of targeted advertising and the sale of personal data.
            To make a request, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

          <h2 className={h2}>Children</h2>
          <p>
            This site is written for adults planning time in Denver. It isn&apos;t directed at children under 13,
            and I don&apos;t knowingly collect their information.
          </p>

          <h2 className={h2}>Changes</h2>
          <p>
            If this policy changes, the updated version will be posted here with a new effective date.
          </p>

          <h2 className={h2}>Contact</h2>
          <p>
            Questions about this policy? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

          <p className="text-base">
            <Link href="/">&larr; Back to Dave Loves Denver</Link>
          </p>
        </div>
      </section>
    </>
  );
}
