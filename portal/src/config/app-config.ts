import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "SWIFT HORIZON",
  version: packageJson.version,
  copyright: `© ${currentYear}, Swift Holdings.`,
  meta: {
    title: "Swift Horizon — Member Portal",
    description:
      "Swift Horizon member portal — manage your capsule investment, view statements, and access project documents.",
  },
};
