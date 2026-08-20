import type { InvitationViewModel } from "./view-model";

/**
 * Data preview dengan gambar pengisi lokal.
 * Tujuannya agar bentuk template benar-benar bisa dicek ketika ada cover,
 * portrait mempelai, dan galeri yang terisi — tanpa bergantung ke layanan
 * placeholder eksternal.
 */
export const demoInvitationViewModel: InvitationViewModel = {
  id: "demo",
  slug: "ardi-laras",
  title: "The Wedding of Ardi & Laras",
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
  coverImageUrl: "/demo/elegant/cover-couple.svg",
  videoUrl: null,
  eventDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  eventLocation: "Gedung Serba Guna Wijayakusuma",
  eventAddress: "Jl. Merdeka No. 45, Yogyakarta",
  eventMapsUrl: "https://maps.google.com",
  gallery: [
    {
      id: "demo-1",
      imageUrl: "/demo/elegant/groom-portrait.svg",
      caption: "Portrait placeholder untuk mempelai pria.",
    },
    {
      id: "demo-2",
      imageUrl: "/demo/elegant/bride-portrait.svg",
      caption: "Portrait placeholder untuk mempelai wanita.",
    },
    {
      id: "demo-3",
      imageUrl: "/demo/elegant/gallery-1.svg",
      caption: "Contoh foto prewedding dengan tone hangat.",
    },
    {
      id: "demo-4",
      imageUrl: "/demo/elegant/gallery-2.svg",
      caption: "Contoh foto detail suasana dan momen candid.",
    },
    {
      id: "demo-5",
      imageUrl: "/demo/elegant/gallery-3.svg",
      caption: "Contoh frame portrait close-up pasangan.",
    },
    {
      id: "demo-6",
      imageUrl: "/demo/elegant/gallery-4.svg",
      caption: "Contoh frame medium shot untuk galeri.",
    },
    {
      id: "demo-7",
      imageUrl: "/demo/elegant/gallery-5.svg",
      caption: "Contoh komposisi gelap untuk varian Noir.",
    },
    {
      id: "demo-8",
      imageUrl: "/demo/elegant/gallery-6.svg",
      caption: "Contoh komposisi terang untuk varian Ivory.",
    },
  ],
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
      description:
        "Bertemu pertama kali di sebuah acara kampus dan langsung akrab mengobrol.",
    },
    {
      id: "demo-story-2",
      title: "Menjalin Komitmen",
      date: "Juni 2021",
      description:
        "Setelah dekat cukup lama, kami memutuskan untuk menjalani hubungan yang lebih serius.",
    },
    {
      id: "demo-story-3",
      title: "Lamaran",
      date: "Maret 2026",
      description:
        "Ardi melamar Laras di hadapan keluarga besar, disambut haru dan kebahagiaan.",
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
  templateSlug: "elegant",
  musicUrl: null,
  isPreview: true,
};
