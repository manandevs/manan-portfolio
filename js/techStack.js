const allSkills = [
  // 🌐 Markup & Styling
  { name: "HTML5", img: "./images/tech/HTML5.webp", color: "#e44d26" },
  { name: "CSS3", img: "./images/tech/CSS3.webp", color: "#264de4" },
  { name: "Sass", img: "./images/tech/Sass.webp", color: "#cc6699" },
  { name: "Tailwind CSS", img: "./images/tech/Tailwind-CSS.webp", color: "#38bdf8" },
  { name: "Bootstrap", img: "./images/tech/Bootstrap.webp", color: "#7952b3" },

  // 📜 Programming & Frameworks
  { name: "JavaScript", img: "./images/tech/JavaScript.webp", color: "#f7df1e" },
  { name: "TypeScript", img: "./images/tech/TypeScript.webp", color: "#3178c6" },
  { name: "React", img: "./images/tech/React.webp", color: "#61dafb" },
  { name: "Next.js", img: "./images/tech/Next.js.webp", color: "#ffffff" },
  { name: "GSAP", img: "./images/tech/gsap.webp", color: "#88ce02" },
  { name: "Three.js", img: "./images/tech/Three.js.webp", color: "#000000" },

  // 🔄 State Management & APIs
  { name: "Redux", img: "./images/tech/Redux.png", color: "#764abc" },
  { name: "GraphQL", img: "./images/tech/GraphQL.webp", color: "#e535ab" },
  { name: "Express", img: "./images/tech/Express.webp", color: "#999999" },
  { name: "Postman", img: "./images/tech/Postman.webp", color: "#ff6c37" },

  // 🗄️ Databases
  { name: "MongoDB", img: "./images/tech/MongoDB.webp", color: "#4DB33D" },
  { name: "PostgresSQL", img: "./images/tech/PostgresSQL.webp", color: "#336791" },
  { name: "Firebase", img: "./images/tech/Firebase.webp", color: "#ffca28" },

  // 🛠️ Build Tools & DevOps
  { name: "Node.js", img: "./images/tech/Node.js.webp", color: "#68a063" },
  { name: "NPM", img: "./images/tech/NPM.webp", color: "#cb3837" },
  { name: "Vite.js", img: "./images/tech/Vite.js.webp", color: "#646cff" },
  { name: "Docker", img: "./images/tech/Docker.webp", color: "#0db7ed" },

  // ☁️ Platforms & Deployment
  { name: "Git", img: "./images/tech/Git.png", color: "#f1502f" },
  { name: "GitHub", img: "./images/tech/GitHub.webp", color: "#ffffff" },
  { name: "Vercel", img: "./images/tech/Vercel.png", color: "#ffffff" },
  { name: "Clerk", img: "./images/tech/clerk.png", color: "#cccccc" },

  // 🎨 Design & Tools
  { name: "Figma", img: "./images/tech/Figma.webp", color: "#a259ff" }
];


  const container = document.getElementById("skillsContainer");

  allSkills.forEach(skill => {
    const skillDiv = document.createElement("div");
    skillDiv.className = "w-[150px] h-[150px] bg-gray-800 flex flex-col items-center justify-center group rounded-[30px]";

    const img = document.createElement("img");
    img.src = skill.img;
    img.alt = skill.name;
    img.className = "h-20 w-20 glow group-hover:scale-110 transition-transform duration-300";
    img.style.filter = "drop-shadow(0 0 0 transparent)";
    img.onmouseover = () => {
      img.style.filter = `drop-shadow(0 0 10px ${skill.color})`;
    };
    img.onmouseout = () => {
      img.style.filter = "drop-shadow(0 0 0 transparent)";
    };

    const label = document.createElement("p");
    label.className = "mt-2 text-sm text-white/80";
    label.textContent = skill.name;

    skillDiv.appendChild(img);
    skillDiv.appendChild(label);
    container.appendChild(skillDiv);
  });
