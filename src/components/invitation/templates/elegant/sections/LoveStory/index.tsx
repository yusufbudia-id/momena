import type { SectionProps } from "../../../../types";

// TODO: `invitation.story` selalu [] sampai tabel Story ditambah ke schema
// (lihat mapper.ts). Section ini sudah siap render begitu datanya ada.
export function LoveStory({ invitation }: SectionProps) {
  if (invitation.story.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <h2 className="font-display text-ink text-center text-2xl italic">
        Kisah Cinta Kami
      </h2>
      <div className="mx-auto mt-8 flex max-w-lg flex-col gap-6">
        {invitation.story.map((item) => (
          <div key={item.id} className="border-line bg-surface rounded-xl border p-5">
            {item.date && (
              <p className="text-ink-soft text-xs tracking-wide uppercase">{item.date}</p>
            )}
            <p className="font-display text-ink mt-1 text-lg italic">{item.title}</p>
            <p className="text-ink-soft mt-2 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
