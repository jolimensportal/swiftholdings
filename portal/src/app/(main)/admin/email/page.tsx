import { getEmailConsoleData } from "@/server/swift-api";

import { EmailComposer } from "./_components/email-composer";
import { EmailComposerSkeleton } from "./_components/email-composer-skeleton";
import { EmailTemplateList } from "./_components/email-template-list";

export default async function Page() {
  const data = await getEmailConsoleData();

  // The marketing Worker returns 401 rather than an empty object when the caller
  // is not an admin, so `null` here means "not authorised", not "no data".
  if (!data) return <EmailComposerSkeleton />;

  return (
    <div className="flex flex-col gap-6 p-6">
      <EmailComposer enquiries={data.enquiries} directory={data.directory} />
      <EmailTemplateList templates={data.templates} />
    </div>
  );
}
