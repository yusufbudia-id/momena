import type { InvitationViewModel } from "./view-model";

/**
 * ViewModel dummy untuk keperluan preview template (halaman /templates,
 * nanti juga landing page). Sengaja TIDAK datang dari database — supaya
 * template bisa dipreview kapan saja tanpa perlu invitation asli.
 */
export const demoInvitationViewModel: InvitationViewModel = {
  id: "demo",
  slug: "andi-siti",
  title: "Pernikahan Andi & Siti",
  couple: {
    first: "Andi",
    second: "Siti",
    firstParents: "Putra dari Bapak Suryanto & Ibu Wati",
    secondParents: "Putri dari Bapak Hartono & Ibu Rahayu",
    firstInstagram: "andi.wijaya",
    secondInstagram: "siti.rahma",
  },
  tagline: "Kami mengundang Anda untuk merayakan hari bahagia kami.",
  quote:
    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.",
  description:
    "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.",
  coverImageUrl: "https://placehold.co/1200x1600/f3e6ea/8c4f63/png?text=Andi+%26+Siti",
  videoUrl: null,
  eventDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // ~45 hari dari sekarang
  eventLocation: "Gedung Serba Guna Wijayakusuma",
  eventAddress: "Jl. Merdeka No. 45, Yogyakarta",
  eventMapsUrl: "https://maps.google.com",
  gallery: [
    {
      id: "demo-1",
      imageUrl: "https://placehold.co/600x600/f3e6ea/8c4f63/png?text=1",
      caption: null,
    },
    {
      id: "demo-2",
      imageUrl: "https://placehold.co/600x600/e3efe7/4c7a5f/png?text=2",
      caption: null,
    },
    {
      id: "demo-3",
      imageUrl: "https://placehold.co/600x600/f5ecd9/a9782e/png?text=3",
      caption: null,
    },
  ],
  gifts: [
    {
      id: "demo-gift-1",
      label: "Bank Momena",
      number: "1234567890",
      holderName: "Andi Wijaya",
      note: null,
    },
  ],
  story: [
    {
      id: "demo-story-1",
      title: "Pertama Bertemu",
      date: "Januari 2020",
      description:
        "Bertemu pertama kali di sebuah acara kampus dan langsung akrab mengobrol.",
    },
    {
      id: "demo-story-2",
      title: "Jadian",
      date: "Juni 2021",
      description:
        "Setelah dekat cukup lama, kami memutuskan untuk menjalani hubungan serius.",
    },
    {
      id: "demo-story-3",
      title: "Lamaran",
      date: "Maret 2026",
      description:
        "Andi melamar Siti di depan keluarga besar, disambut haru dan bahagia.",
    },
  ],
  guestBook: [],
  templateSlug: "elegant",
  musicUrl: null,
  isPreview: true,
};
