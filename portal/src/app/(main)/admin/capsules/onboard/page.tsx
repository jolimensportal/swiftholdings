import { CapsuleOnboardingForm } from "../_components/capsule-onboarding-form";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs tracking-[0.22em] text-primary/75 uppercase">Capsules / Onboard</p>
        <h1 className="font-heading text-3xl text-foreground">Onboard a prefab</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a unit with its details and photographs. The first photo becomes the hero.
        </p>
      </header>
      <CapsuleOnboardingForm />
    </div>
  );
}