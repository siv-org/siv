import type { ElementType } from 'react'

import { BookOpen, FileText, MessageCircleQuestionMark, Presentation, ShieldCheck } from 'lucide-react'

export type Resource = {
  category: string
  description: string
  href: string
  icon: ElementType
  title: string
}

export const RESOURCES: Resource[] = [
  {
    category: 'Documentation',
    description: 'An interactive, step-by-step walkthrough of how SIV works.',
    href: '/protocol',
    icon: ShieldCheck,
    title: 'Illustrated SIV Protocol',
  },
  {
    category: 'Documentation',
    description:
      'The detailed technical specification defining what constitutes a SIV election, covering cryptographic primitives, data structures, and network endpoints.',
    href: 'https://docs.siv.org/technical-specifications',
    icon: FileText,
    title: 'Technical Specification',
  },
  {
    category: 'Documentation',
    description:
      'Presented at the academic conference E-Vote-ID, this poster details the specific security properties of the SIV protocol, and more.',
    href: 'https://blog.siv.org/images/2025/11/evoteid-2025-poster.png',
    icon: Presentation,
    title: 'SIV in One Poster',
  },
  {
    category: 'Reference',
    description:
      'Answers to common questions about digital voting, security, privacy, and how SIV compares to traditional methods.',
    href: '/faq',
    icon: MessageCircleQuestionMark,
    title: 'Frequently Asked Questions',
  },
  {
    category: 'Research',
    description:
      'The cryptographic building blocks that make authenticated, private, and verifiable digital voting possible.',
    href: '/about#research',
    icon: BookOpen,
    title: 'Academic Research Papers',
  },
]
