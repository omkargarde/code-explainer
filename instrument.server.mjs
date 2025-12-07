import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
  dsn: "https://c506d3de479ab4659d3cd255b6a55f95@o4510493443358720.ingest.us.sentry.io/4510493473439744",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
