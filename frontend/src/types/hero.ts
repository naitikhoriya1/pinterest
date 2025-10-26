export interface HeroImage {
  id: string;
  src: string;
  alt: string;
}

export interface HeroData {
  [key: string]: HeroImage[];
}
