/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["pubmed.ncbi.nlm.nih.gov", "www.scielo.br"],
  },
};

module.exports = nextConfig;
