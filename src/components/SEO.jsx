import { Helmet } from "react-helmet-async";

const DEFAULT = {
  title: "ফ্রেশ ফুড রংপুর — হাড়িভাঙ্গা আম",
  description: "রংপুরের বিখ্যাত ফরমালিনমুক্ত হাড়িভাঙ্গা আম। সরাসরি বাগান থেকে আপনার দরজায়। ক্যাশ অন ডেলিভারি।",
  image: "/images/hero.svg",
  url: "https://freshfoodrangpur.com",
};

export default function SEO({ title, description, image, url }) {
  const t = title ? `${title} | ফ্রেশ ফুড রংপুর` : DEFAULT.title;
  const d = description || DEFAULT.description;
  const img = image || DEFAULT.image;
  const u = url || DEFAULT.url;

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <link rel="canonical" href={u} />

      {/* Open Graph */}
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={u} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="bn_BD" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "ফ্রেশ ফুড রংপুর",
        "description": d,
        "telephone": "01310101661",
        "address": { "@type": "PostalAddress", "addressLocality": "Rangpur", "addressCountry": "BD" },
      })}</script>
    </Helmet>
  );
}
