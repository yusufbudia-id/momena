import { getTemplateCatalog } from "@/components/invitation/template-catalog";
import { PageHeader } from "@/components/shared/page-header";
import { createInvitation } from "@/features/invitation/actions";
import { InvitationWizard } from "@/features/invitation/components/invitation-wizard";
import type { InvitationWizardFormValues } from "@/features/invitation/validation";
import { getCurrentUserId } from "@/lib/temp-auth";

interface NewInvitationPageProps {
  searchParams: Promise<{ template?: string }>;
}

export default async function NewInvitationPage({
  searchParams,
}: NewInvitationPageProps) {
  const [catalog, params] = await Promise.all([getTemplateCatalog(), searchParams]);

  const templates = catalog.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    thumbnailUrl: item.thumbnail,
    premium: item.premium,
    description: item.description,
  }));

  // Datang dari "Use Template" di /templates — prapilih templatenya.
  const preselected = params.template
    ? templates.find((t) => t.slug === params.template)
    : undefined;
  const defaultValues: Partial<InvitationWizardFormValues> | undefined = preselected
    ? { templateId: preselected.id }
    : undefined;

  async function createInvitationAction(rawInput: unknown) {
    "use server";
    const userId = await getCurrentUserId();
    return createInvitation(userId, rawInput);
  }

  return (
    <div>
      <PageHeader
        title="Buat Invitation"
        description="Ikuti langkah-langkah di bawah untuk membuat undangan baru."
      />
      <InvitationWizard
        mode="create"
        templates={templates}
        defaultValues={defaultValues}
        onSubmit={createInvitationAction}
      />
    </div>
  );
}
