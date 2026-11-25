import type { EditorialProject } from "./projects";

export const pokracujStudio: EditorialProject = {
  slug: "pokracuj-studio",
  name: "Pokračuj Studio",
  classification: "Web Development · Digital Experience",
  services: ["Creative Direction", "Web Design", "Web Development"],
  ownership: "client",
  developmentStatus: "live",
  status: "published",
  approvals: { classification: true, role: true, claims: true, media: true },
  role: "Design, Development & Ongoing Maintenance",
  industry: "Music & Recording",
  projectType: "Custom Website",
  scope: "Creative Direction, Design & Development",
  liveUrl: "https://pokracuj.sk/",
  headline: "A digital presence shaped by sound.",
  introduction: "A custom website designed to translate an established recording studio's identity into a distinctive online experience.",
  summary: "A custom digital experience bringing the identity, services and creative work of a professional recording studio online.",
  description: "A complete website designed and developed from the ground up, combining a distinctive visual direction with a focused presentation of the studio, its services and its creative work.",
  seo: {
    title: "Pokračuj Studio — Web Design & Digital Experience",
    description: "Discover the custom website created for Pokračuj Studio, combining creative direction, distinctive web design and a focused digital experience for a professional recording studio.",
  },
  media: [{
    src: "/images/work/pokracuj-studio.webp",
    alt: "Pokračuj Studio homepage with the recording studio mixing desk",
    caption: "The public Pokračuj Studio website, designed to reflect the atmosphere and identity of the recording studio.",
    width: 1800, height: 923, approved: true,
  }],
  relatedServices: [{ title: "Web development", href: "/services/web-development" }],
  editorial: {
    sections: [
      {
        id: "starting-point",
        label: "The starting point",
        heading: "An established brand. A new digital presence.",
        paragraphs: [
          "Pokračuj Studio was already an established recording studio in Bratislava, offering professional recording and music production services.",
          "The studio had its own identity, logo and photography, but no dedicated website. The objective was to give the business a professional online presence and make its services more accessible to potential customers.",
          "The project began through a personal recommendation and a straightforward request for a website that would represent the studio.",
        ],
      },
      {
        id: "creative-direction",
        label: "Creative direction",
        heading: "From sound to digital identity.",
        paragraphs: [
          "Working with the provided logo and photography, I designed the complete digital experience from the ground up. A dark visual language, bold typography and restrained colour accents create a cohesive website with a distinctive character.",
          "The objective was to give the studio an online presence that felt like a natural extension of the brand rather than a generic business website.",
        ],
        capabilities: [
          { title: "Custom visual direction", description: "A distinctive website design developed around the studio's existing identity and creative character." },
          { title: "Authentic photography", description: "Existing studio photography integrated into the experience to communicate the atmosphere and facilities." },
          { title: "Focused typography", description: "A clear hierarchy balancing the studio's expressive identity with readable information." },
          { title: "Responsive experience", description: "A custom single-page layout designed to adapt across desktop and mobile devices." },
        ],
      },
      {
        id: "digital-experience",
        label: "The digital experience",
        heading: "Everything in one place.",
        paragraphs: [
          "The website was intentionally designed as a focused single-page experience. Visitors can explore the studio's services, review pricing, discover selected music projects and learn about the facilities before getting in touch.",
          "The structure keeps the experience straightforward, without adding unnecessary complexity to the customer journey.",
        ],
        checklist: [
          "Recording and music production services",
          "Service pricing and studio information",
          "Selected music projects with Spotify links",
          "Professional equipment presentation",
          "Studio photography and image gallery",
          "Booking enquiries and contact form",
          "Studio location and contact details",
        ],
      },
      {
        id: "customer-journey",
        label: "The customer journey",
        heading: "From discovery to the first session.",
        paragraphs: [
          "The website creates a direct path from discovering the studio to exploring its work and expressing interest in a recording session.",
          "The enquiry experience is deliberately simple, matching the needs of the existing business without introducing a separate customer account or administrative platform.",
        ],
        workflow: [
          { title: "Discover", description: "Explore the studio and discover its creative identity." },
          { title: "Explore", description: "Review services, pricing, equipment and previous music projects." },
          { title: "Connect", description: "Submit an enquiry or contact the studio directly." },
        ],
      },
      {
        id: "outcome",
        label: "The outcome",
        heading: "A place for the brand to live online.",
        paragraphs: [
          "Pokračuj Studio now has a dedicated digital presence that brings its identity, services, facilities and creative work together in one accessible experience.",
          "The website represents an established business while giving potential customers a clear way to discover the studio and get in touch.",
        ],
        outcomes: [
          { title: "Dedicated online presence", description: "A professional website representing the studio and its existing brand." },
          { title: "Consistent digital identity", description: "A cohesive visual direction connecting typography, photography and the customer experience." },
          { title: "Clear service presentation", description: "A single destination for exploring services, pricing, equipment and creative work." },
          { title: "Direct customer enquiries", description: "An accessible contact and booking enquiry experience for potential customers." },
        ],
      },
      {
        id: "partnership",
        label: "Ongoing partnership",
        heading: "Beyond the initial launch.",
        paragraphs: [
          "The website remains live, with hosting and technical maintenance provided as part of the continued collaboration.",
          "This gives the studio a dedicated technical partner responsible for maintaining its digital presence as the business evolves.",
        ],
      },
    ],
    closing: "The studio already had its sound. The website gave it a digital presence to match.",
    relatedSlugs: [],
    cta: {
      heading: "Give your brand the digital presence it deserves.",
      subheading: "Custom design. Purposeful development.",
      description: "Whether you are establishing your first online presence or evolving an existing brand, let's create a digital experience that reflects the quality of your business.",
      primary: "Book a strategy call",
      secondary: "Explore more projects",
    },
  },
};
