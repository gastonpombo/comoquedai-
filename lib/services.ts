import { MessageSquare, ImageIcon, Code, BarChart3, FileText, Music } from "lucide-react"

export type Service = {
  id: string
  title: string
  description: string
  icon: any
  cost: number
  color: string
}

export const services: Service[] = [
  {
    id: "chat-banana",
    title: "Banana Chat",
    description: "Advanced conversational AI for general queries and assistance.",
    icon: MessageSquare,
    cost: 1,
    color: "text-primary",
  },
  {
    id: "image-gen",
    title: "Image Studio",
    description: "Generate stunning visuals from text descriptions.",
    icon: ImageIcon,
    cost: 5,
    color: "text-purple-500",
  },
  {
    id: "code-assistant",
    title: "Code Monkey",
    description: "Debug, refactor, and generate code snippets in any language.",
    icon: Code,
    cost: 2,
    color: "text-blue-500",
  },
  {
    id: "data-analyst",
    title: "Data Peel",
    description: "Analyze datasets and generate insights with visualizations.",
    icon: BarChart3,
    cost: 3,
    color: "text-green-500",
  },
  {
    id: "copywriter",
    title: "Copy Banana",
    description: "Generate marketing copy, blog posts, and social media content.",
    icon: FileText,
    cost: 1,
    color: "text-orange-500",
  },
  {
    id: "audio-gen",
    title: "Sound Studio",
    description: "Create sound effects and music tracks from text.",
    icon: Music,
    cost: 4,
    color: "text-pink-500",
  },
]
