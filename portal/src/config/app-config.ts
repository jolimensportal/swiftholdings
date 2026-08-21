import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "THE SWIFT PROJECT",
  version: packageJson.version,
  copyright: `© ${currentYear}, Swift Holdings.`,
  meta: {
    title: "The Swift Project — Member Portal",
    description:
      "The Swift Project member portal — manage your capsule investment, view statements, and access project documents.",
  },
};
