import type { InvitationViewModel } from "./view-model";

const baseDemo: Omit<InvitationViewModel, "coverImageUrl" | "groomPhotoUrl" | "bridePhotoUrl" | "gallery" | "templateSlug"> = {
  id: "demo",
  slug: "ardi-laras",
  title: "Pernikahan Ardi & Laras",
  couple: {
    first: "Ardi",
    second: "Laras",
    firstParents: "Putra dari Bapak Suryanto & Ibu Wati",
    secondParents: "Putri dari Bapak Hartono & Ibu Rahayu",
    firstInstagram: "ardi.wijaya",
    secondInstagram: "laras.rahma",
  },
  tagline: "Kami mengundang Anda untuk merayakan hari bahagia kami.",
  quote:
    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.",
  description:
    "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
  coverImagePositionX: 50,
  coverImagePositionY: 50,
  groomPhotoPositionX: 50,
  groomPhotoPositionY: 50,
  bridePhotoPositionX: 50,
  bridePhotoPositionY: 50,
  videoUrl: null,
  eventDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  eventLocation: "Gedung Serba Guna Wijayakusuma",
  eventAddress: "Jl. Merdeka No. 45, Yogyakarta",
  eventMapsUrl: "https://maps.google.com",
  gifts: [
    {
      id: "demo-gift-1",
      label: "Bank Momena",
      number: "1234567890",
      holderName: "Ardi Wijaya",
      note: null,
    },
    {
      id: "demo-gift-2",
      label: "E-Wallet",
      number: "081234567890",
      holderName: "Laras Rahma",
      note: "Konfirmasi hadiah dapat dilakukan melalui WhatsApp.",
    },
  ],
  story: [
    {
      id: "demo-story-1",
      title: "Pertama Bertemu",
      date: "Januari 2020",
      description: "Bertemu pertama kali di sebuah acara kampus dan langsung akrab mengobrol.",
    },
    {
      id: "demo-story-2",
      title: "Menjalin Komitmen",
      date: "Juni 2021",
      description: "Setelah dekat cukup lama, kami memutuskan untuk menjalani hubungan yang lebih serius.",
    },
    {
      id: "demo-story-3",
      title: "Lamaran",
      date: "Maret 2026",
      description: "Ardi melamar Laras di hadapan keluarga besar, disambut haru dan kebahagiaan.",
    },
  ],
  guestBook: [
    {
      id: "demo-guest-1",
      guestName: "Rizky Pratama",
      attendeeCount: 2,
      status: "ATTENDING",
      message: "MasyaAllah, semoga lancar sampai hari H dan menjadi keluarga sakinah mawaddah warahmah.",
      createdAt: new Date(),
    },
    {
      id: "demo-guest-2",
      guestName: "Dina Maharani",
      attendeeCount: 1,
      status: "MAYBE",
      message: "InsyaAllah hadir. Terima kasih undangannya, semoga acaranya penuh berkah.",
      createdAt: new Date(),
    },
  ],
  musicUrl: null,
  isPreview: true,
};

function gallery(prefix: string, count = 6) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    imageUrl: `/demo/${prefix}/gallery-${index + 1}.svg`,
    caption: `Contoh foto pengisi ${index + 1} untuk preview ${prefix}.`,
  }));
}

const elegantGallery = [
  { id: "elegant-1", imageUrl: "/demo/elegant/groom-portrait.svg", caption: "Portrait placeholder mempelai pria." },
  { id: "elegant-2", imageUrl: "/demo/elegant/bride-portrait.svg", caption: "Portrait placeholder mempelai wanita." },
  ...Array.from({ length: 6 }, (_, index) => ({
    id: `elegant-${index + 3}`,
    imageUrl: `/demo/elegant/gallery-${index + 1}.svg`,
    caption: `Contoh foto pengisi ${index + 1} untuk preview Elegant.`,
  })),
];

export function getDemoInvitationViewModel(templateSlug: string): InvitationViewModel {
  if (templateSlug === "modern") {
    return {
      ...baseDemo,
      title: "ARDI × LARAS",
      coverImageUrl: "/demo/modern/cover.svg",
      groomPhotoUrl: "/demo/modern/gallery-1.svg",
      bridePhotoUrl: "/demo/modern/gallery-2.svg",
      gallery: gallery("modern"),
      templateSlug: "modern",
    };
  }

  if (templateSlug === "minimal") {
    return {
      ...baseDemo,
      title: "Ardi & Laras",
      coverImageUrl: "/demo/minimal/cover.svg",
      groomPhotoUrl: "/demo/minimal/gallery-1.svg",
      bridePhotoUrl: "/demo/minimal/gallery-2.svg",
      gallery: gallery("minimal"),
      templateSlug: "minimal",
    };
  }

  return {
    ...baseDemo,
    title: "The Wedding of Ardi & Laras",
    coverImageUrl: "/demo/elegant/cover-couple.svg",
    groomPhotoUrl: "/demo/elegant/groom-portrait.svg",
    bridePhotoUrl: "/demo/elegant/bride-portrait.svg",
    gallery: elegantGallery,
    templateSlug: templateSlug || "elegant",
  };
}

/** Backward compatibility untuk pemanggilan lama. */
export const demoInvitationViewModel = getDemoInvitationViewModel("elegant");
