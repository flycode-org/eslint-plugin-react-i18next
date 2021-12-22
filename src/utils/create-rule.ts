import { ESLintUtils } from "@typescript-eslint/experimental-utils";

const REPOSITORY = "https://github.com/flycode-org/eslint-plugin-react-i18next";
const DEFAULT_BRANCH = "master";

export const createRule = ESLintUtils.RuleCreator(
  (name) => `${REPOSITORY}/blob/${DEFAULT_BRANCH}/docs/docs/rules/${name}.md`
);
