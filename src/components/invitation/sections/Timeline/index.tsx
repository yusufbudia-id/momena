import type { SectionProps } from "../../types";

// TODO: sama seperti LoveStory, `invitation.story` selalu [] sampai ada
// tabel Story di schema. Dibedakan dari LoveStory lewat layout (garis waktu
// ringkas), bukan sumber data — begitu Story ada, keduanya bisa dibedakan
// lebih lanjut kalau perlu (mis. tipe entri "milestone" vs "jadwal acara").
export function Timeline({ invitation }: SectionProps) {
  if (invitation.story.length === 0) return null;

  return (
    <section className="px-6 py-16">
      <h2 className="font-display text-ink text-center text-2xl italic">
        Rangkaian Acara
      </h2>
      <ol className="border-line mx-auto mt-8 flex max-w-md flex-col gap-4 border-l pl-5">
        {invitation.story.map((item) => (
          <li key={item.id} className="relative">
            <span className="bg-accent absolute top-1 -left-[26px] size-2.5 rounded-full" />
            {item.date && <p className="text-ink-soft text-xs">{item.date}</p>}
            <p className="text-ink font-medium">{item.title}</p>
            <p className="text-ink-soft text-sm">{item.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
