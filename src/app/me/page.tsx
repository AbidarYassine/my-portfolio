import { Container } from "@/components/container";
import { site } from "@/lib/site";

export default function MePage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Me</h1>
          <p className="text-muted-foreground">
            {site.name} · {site.role}
          </p>
        </div>

        <p className="max-w-2xl leading-7 text-muted-foreground">{site.summary}</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Focus</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Designing clean, scalable backend architectures with Java and Spring Boot.</li>
            <li>Building reliable, event-driven systems with Kafka and strong observability.</li>
            <li>Integrating AI capabilities using Spring AI.</li>
            <li>Deploying cloud-native solutions with Docker, Kubernetes, and OpenShift.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Tech I use</h2>
          <div className="flex flex-wrap gap-2">
            {site.tech.map(
              (t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground"
                >
                  {t}
                </span>
              )
            )}
          </div>
        </section>
      </div>
    </Container>
  );
}
