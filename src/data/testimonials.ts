// Define the testimonial type
export interface Testimonial {
    id: number;
    content: string;
    author: string;
    role: string;
    avatar: string;
    course: string;
    rating: number;
  }
  
  // Sample testimonial data
  export const testimonials: Testimonial[] = [
    {
      id: 1,
      content: "The exam preparation assistant has been invaluable. I was struggling with complex data structures, but the personalized explanations based on our course materials helped me grasp the concepts quickly.",
      author: "Lisa Meyer",
      role: "MSc Student, 2nd Semester",
      avatar: "/avatars/lisa.jpg",
      course: "Machine Learning",
      rating: 5
    },
    {
      id: 2,
      content: "This tool helped me identify knowledge gaps in my understanding of statistical methods. The practice questions were challenging and relevant to our curriculum, which made a huge difference in my exam results.",
      author: "Michael Brunner",
      role: "MSc Student, 3rd Semester",
      avatar: "/avatars/michael.jpg", 
      course: "Statistical Methods",
      rating: 5
    },
    {
      id: 3,
      content: "As a working professional, finding time to study effectively was challenging. This platform allowed me to focus on exactly what I needed to learn, with explanations tailored to our course materials.",
      author: "Sarah Weber",
      role: "MSc Student, Part-time",
      avatar: "/avatars/sarah.jpg",
      course: "Big Data",
      rating: 4
    },
    {
      id: 4,
      content: "The concept clarification feature is outstanding. Being able to get complex data science theories explained with examples from our own lab exercises made abstract concepts much more approachable.",
      author: "David Keller",
      role: "MSc Student, 2nd Semester",
      avatar: "/avatars/david.jpg",
      course: "Data Visualization",
      rating: 5
    },
    {
      id: 5,
      content: "I was skeptical about using an AI tool for exam preparation, but this system exceeded my expectations. It helped me organize complex information from multiple courses in a way that made studying more efficient.",
      author: "Thomas Schubert",
      role: "MSc Student, 3rd Semester",
      avatar: "/avatars/thomas.jpg",
      course: "Machine Learning",
      rating: 5
    },
    {
      id: 6,
      content: "The personalized study guides saved me so much time. Instead of trying to review everything, the system helped me focus on my weak areas first. My exam confidence improved significantly.",
      author: "Nina Lombardi",
      role: "MSc Student, 1st Semester",
      avatar: "/avatars/nina.jpg",
      course: "Programming for Data Science",
      rating: 4
    },
    {
      id: 7,
      content: "I especially appreciated how the system connected concepts across different courses. It helped me see the bigger picture of data science rather than studying topics in isolation.",
      author: "Marc Zimmermann",
      role: "MSc Student, Part-time",
      avatar: "/avatars/marc.jpg",
      course: "Statistical Methods",
      rating: 5
    },
    {
      id: 8,
      content: "The practice question generation feature is brilliant. It created challenging questions that really tested my understanding, not just my memorization. This was key to my exam success.",
      author: "Julia Braun",
      role: "MSc Student, 2nd Semester",
      avatar: "/avatars/julia.jpg",
      course: "Cloud Computing",
      rating: 5
    },
    {
      id: 9,
      content: "As an international student, I sometimes struggled with technical terminology. This system explained complex concepts in clear language and provided examples that made difficult topics accessible.",
      author: "Ravi Patel",
      role: "MSc Student, 1st Semester",
      avatar: "/avatars/ravi.jpg",
      course: "Big Data",
      rating: 4
    },
    {
      id: 10,
      content: "The way this system handled my questions about advanced algorithms was impressive. I could explore topics beyond the lecture materials, which really helped for my research project.",
      author: "Sophia Keller",
      role: "MSc Student, Final Semester",
      avatar: "/avatars/sophia.jpg",
      course: "Advanced Algorithms",
      rating: 5
    }
  ];