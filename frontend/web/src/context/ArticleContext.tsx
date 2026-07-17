import { Article, Doctor } from "@/types/type";

export const getFeaturedArticles = async (doctors: Doctor[]): Promise<Article[]> => {
  const defaultAuthor = {
    name: doctors[0]?.name || "WellNest Specialist",
    speciality: doctors[0]?.specialty || "General Practitioner",
    profileUrl: doctors[0]?.profileUrl || '/images/male-default.png'
  };

  return [
    {
      id: "1",
      title: "Understanding Heart Health: A Comprehensive Guide",
      excerpt: "Learn about maintaining a healthy heart and preventing cardiovascular diseases with expert insights from our cardiology team.",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3",
      category: "General Health",
      author: defaultAuthor,
      readTime: "8 min read",
      createdAt: "March 15, 2024",
    },
    {
      id: "2",
      title: "The Impact of Mental Health on Physical Well-being",
      excerpt: "Exploring the crucial connection between mental and physical health, and strategies for maintaining overall wellness.",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3",
      category: "Mental Health",
      author: defaultAuthor,
      readTime: "6 min read",
      createdAt: "March 14, 2024",
    }
  ]
};

export const getArticles = async (doctors: Doctor[]): Promise<Article[]> => {
  const defaultAuthor = {
    name: doctors[0]?.name || "WellNest Specialist",
    speciality: doctors[0]?.specialty || "General Practitioner",
    profileUrl: doctors[0]?.profileUrl || '/images/male-default.png'
  };

  return [
    {
      id: "3",
      title: "Breakthrough in Medical Research: New Treatment Options",
      excerpt: "Latest developments in medical research that could revolutionize treatment approaches for various conditions.",
      imageUrl: "/images/article1.jpg",
      category: "Medical Research",
      author: defaultAuthor,
      createdAt: "2024-03-13",
      readTime: "10 min read"
    },
    {
      id: "4",
      title: "Patient Success Stories: Journey to Recovery",
      excerpt: "Inspiring stories of patients who overcame health challenges with the support of our medical team.",
      imageUrl: "/images/article2.jpg",
      category: "Patient Stories",
      author: defaultAuthor,
      createdAt: "2025-03-12",
      readTime: "7 min read"
    },
    {
      id: "5",
      title: "Innovative Approaches to Medical Education",
      excerpt: "How modern technology is transforming medical education and training for healthcare professionals.",
      imageUrl: "/images/article3.png",
      category: "Medical Research",
      author: defaultAuthor,
      createdAt: "2025-03-11",
      readTime: "9 min read"
    },
    {
      id: "6",
      title: "The Importance of Regular Health Checkups",
      excerpt: "Regular health checkups are essential for maintaining overall health and catching potential issues early.",
      imageUrl: "/images/article4.png",
      category: "General Health",
      author: defaultAuthor,
      createdAt: "2025-03-10",
      readTime: "12 min read"
    },
    {
      id: "7",
      title: "The Importance of Regular Health Checkups",
      excerpt: "Regular health checkups are essential for maintaining overall health and catching potential issues early.",
      imageUrl: "/images/article5.png",
      category: "General Health",
      author: defaultAuthor,
      createdAt: "2024-03-09",
      readTime: "12 min read"
    },
    {
      id: "8",
      title: "The Importance of Regular Health Checkups",
      excerpt: "Regular health checkups are essential for maintaining overall health and catching potential issues early.",
      imageUrl: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?ixlib=rb-4.0.3",
      category: "General Health",
      author: defaultAuthor,
      createdAt: "2024-03-08",
      readTime: "12 min read"
    }
  ];
};