import {
  Book,
  Palette,
  Music,
  Video,
  Camera,
  Globe,
  FileText,
  Code,
  LucideIcon,
} from "lucide-react";

export interface CopyrightCategory {
  icon: LucideIcon;
  color: string;
  label: string;
  shortLabel: string;
  subCategories: string[];
}

export interface CopyrightCategories {
  [key: string]: CopyrightCategory;
}

export const copyrightCategories: CopyrightCategories = {
  KARYA_TULIS: {
    icon: Book,
    color: "bg-red-500",
    label: "KARYA TULIS",
    shortLabel: "TULIS",
    subCategories: [ "Atlas", "Biografi", "Booklet", "Buku", "Buku Mewarnai", "Buku Panduan / Petunjuk", "Buku Pelajaran", "Buku Saku", "Bunga Rampai", "Cerita Bergambar", "Diktat", "Dongeng", "e-Book", "Ensiklopedia", "Jurnal", "Kamus", "Karya Ilmiah", "Karya Tulis", "Karya Tulis (artikel)", "Karya Tulis (disertasi)", "Karya Tulis (Skripsi)", "Karya Tulis (Tesis)", "Karya Tulis Lainnya", "Komik", "Laporan Penelitian", "Majalah", "Makalah", "Modul", "Naskah Drama / Pertunjukan", "Naskah Film", "Naskah Karya Siaran", "Naskah Karya Sinematografi", "Novel", "Perwajahan Karya Tulis", "Proposal Penelitian", "Puisi", "Resensi", "Resume / Ringkasan", "Saduran", "Sinopsis", "Tafsir", "Terjemahan" ],
  },
  KARYA_SENI: {
    icon: Palette,
    color: "bg-blue-500",
    label: "KARYA SENI",
    shortLabel: "SENI",
    subCategories: [ "Alat peraga", "Arsitektur", "Baliho", "Banner", "Brosur", "Diorama", "Flyer", "Kaligrafi", "Karya Seni Batik", "Karya Seni Rupa", "Kolase", "Leaflet", "Motif Sasirangan", "Motif Tapis", "Motif Tenun Ikat", "Motif Ulos", "Pamflet", "Peta", "Poster", "Seni Gambar", "Seni Ilustrasi", "Seni Lukis", "Seni Motif", "Seni Motif Lainnya", "Seni Pahat", "Seni Patung", "Seni Rupa", "Seni Songket", "Seni Terapan", "Seni Umum", "Sketsa", "Spanduk", "Ukiran" ],
  },
  KOMPOSISI_MUSIK: {
    icon: Music,
    color: "bg-purple-500",
    label: "KOMPOSISI MUSIK",
    shortLabel: "MUSIK",
    subCategories: [ "Aransemen", "Lagu (Musik dengan teks)", "Musik", "Musik Blues", "Musik Country", "Musik Dangdut", "Musik Elektronik", "Musik Funk", "Musik Gospel", "Musik Hip hop, Rapcore,", "Musik Jazz", "Musik Karawitan", "Musik Klasik", "Musik Latin", "Musik Metal", "Musik Pop", "Musik Rhythm dan Blues", "Musik Rock", "Musik Ska, Reggae, Dub", "Musik Tanpa Teks" ],
  },
  KARYA_AUDIO_VISUAL: {
    icon: Video,
    color: "bg-green-500",
    label: "KARYA AUDIO VISUAL",
    shortLabel: "A/V",
    subCategories: [ "Film", "Film Cerita", "Film Dokumenter", "Film Iklan", "Film Kartun", "Karya Rekaman Video", "Karya Siaran", "Karya Siaran Media Radio", "Karya Siaran Media Televisi dan Film", "Karya Siaran Video", "Karya Sinematografi", "Kuliah", "Reportase" ],
  },
  KARYA_FOTOGRAFI: {
    icon: Camera,
    color: "bg-yellow-500",
    label: "KARYA FOTOGRAFI",
    shortLabel: "FOTO",
    subCategories: [ "Karya Fotografi", "Potret" ],
  },
  KARYA_DRAMA: {
    icon: Globe,
    color: "bg-indigo-500",
    label: "KARYA DRAMA & KOREOGRAFI",
    shortLabel: "DRAMA",
    subCategories: [ "Drama/Pertunjukan", "Drama musical", "Ketoprak", "Komedi/Lawak", "Koreografi", "Lenong", "Ludruk", "Opera", "Pantomim", "Pentas Musik", "Pewayangan", "Seni Akrobat", "Seni Pertunjukan", "Sirkus", "Sulap", "Tari (Sendra tari)" ],
  },
  KARYA_REKAMAN: {
    icon: FileText,
    color: "bg-pink-500",
    label: "KARYA REKAMAN",
    shortLabel: "REKAM",
    subCategories: [ "Ceramah", "Karya Rekaman Suara atau Bunyi", "Khutbah", "Pidato" ],
  },
  KARYA_LAINNYA: {
    icon: Code,
    color: "bg-orange-500",
    label: "KARYA LAINNYA",
    shortLabel: "LAIN",
    subCategories: [ "Basis Data", "Kompilasi Ciptaan/Data", "Permainan Video", "Program Komputer" ],
  },
};