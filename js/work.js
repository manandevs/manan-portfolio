const projects = [
  {
    img: "./images/work/gag.webp",
    year: "2024",
    title: "The Gag – Animated Web Experience",
    desc: "A visually striking website with advanced animations using GSAP and Framer Motion.",
    link: "https://the-gag-website.vercel.app/",
    tags: ["Next.js", "GSAP", "Tailwind CSS", "+3"],
  },
  {
    img: "./images/work/edward.webp",
    year: "2024",
    title: "Edward – Animated Portfolio Website",
    desc: "A dynamic portfolio with elegant animations, converted from a Figma design.",
    link: "https://edward-livid.vercel.app/",
    tags: ["Next.js", "React", "Tailwind CSS", "+3"],
  },
  {
    img: "./images/work/that-aint-bad.webp",
    year: "2024",
    title: "That Ain't Bad – E-commerce Redesign",
    desc: "Modernized an e-commerce website with a clean, user-friendly interface.",
    link: "https://that-aint-ecom.vercel.app/",
    tags: ["Next.js", "Framer Motion", "Tailwind CSS", "+2"],
  },
  {
    img: "./images/work/mares8.webp",
    year: "2024",
    title: "Boat Booking Platform – Mares SP",
    desc: "A responsive boat booking system with Stripe integration, converted from a Figma design.",
    link: "https://mares-sp.vercel.app/",
    tags: ["Next.js", "Stripe", "React", "+2"],
  },
  {
    img: "./images/work/mavera.webp",
    year: "2024",
    title: "Mavera – AI Startup Website",
    desc: "A full frontend build for an AI-driven tech company, including a CMS-powered blog.",
    link: "https://www.mavera.io/",
    tags: ["Next.js", "Sanity CMS", "TypeScript", "+4"],
  },
];

let visibleCount = 3; // Show first 3 by default

function renderProjects() {
  const projectsGrid = document.getElementById("projects-grid");
  const button = document.getElementById("toggle-projects-btn");

  const projectsToShow = projects.slice(0, visibleCount);

  const projectCardsHTML = projectsToShow
    .map((project) => {
      const tagsHTML = project.tags
        .map(
          (tag) =>
            `<span class="px-2 py-1 bg-gray-700/50 text-blue-400 text-xs rounded-md font-medium">${tag}</span>`
        )
        .join("");

      return `
         <div class="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/5 relative">
          <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="block relative">
            <!-- Top-right arrow icon -->
            <div class="absolute top-4 right-4 z-[10] bg-gray-900/70 rounded-full p-2 transition-all duration-300 group-hover:bg-blue-600/80 group-hover:scale-110">
                <img src="../images/icons/arrow-top-right.svg" alt="Arrow Icon"
                    class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
                
                 <div class="relative h-64 overflow-hidden">
                     <img src="${project.img}" alt="${project.title}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                     <span class="absolute bottom-4 left-4 bg-gray-900/80 px-2 py-1 rounded-md text-xs font-medium uppercase">${project.year}</span>
                 </div>
                 <div class="p-6">
                     <h3 class="font-bold text-lg mb-2 group-hover:text-blue-500 transition-colors underline">${project.title}</h3>
                     <p class="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">${project.desc}</p>
                     <div class="flex flex-wrap gap-2">
                         ${tagsHTML}
                     </div>
                 </div>
             </a>
         </div>
      `;
    })
    .join("");

  projectsGrid.innerHTML = projectCardsHTML;

  if (visibleCount >= projects.length) {
    button.textContent = "See Less";
  } else {
    button.textContent = "Show More";
  }
}

// Toggle button click handler
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("toggle-projects-btn");

  renderProjects();

  button.addEventListener("click", () => {
    if (visibleCount >= projects.length) {
      visibleCount = 3; // Reset to default
    } else {
      visibleCount += 3; // Show 3 more
    }

    renderProjects();
  });
});
