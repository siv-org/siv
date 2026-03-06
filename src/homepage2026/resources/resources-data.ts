import type { ElementType } from 'react'

import { Atom, Blocks, BookOpen, FileText, MessageCircleQuestionMark, Presentation } from 'lucide-react'

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
    category: 'Documentation',
    description: 'An interactive, step-by-step walkthrough of how SIV works.',
    href: '/protocol',
    icon: Blocks,
    title: 'Illustrated SIV Protocol',
  },
  {
    category: 'Documentation',
    description:
      'The detailed technical specification defining a SIV election, covering cryptographic primitives, data structures, and network endpoints.',
    href: 'https://docs.siv.org/technical-specifications',
    icon: FileText,
    title: 'Technical Specification',
  },
  {
    category: 'Research',
    description:
      'The cryptographic building blocks that make authenticated, private, and verifiable digital voting possible.',
    href: '/about#research',
    icon: Atom,
    title: 'Academic Research Papers',
  },
  {
    category: 'Documentation',
    description:
      'Learn about the SIV Protocol, authentication, privacy, verifiability, how attacks are mitigated, and more.',
    href: 'https://docs.siv.org',
    icon: BookOpen,
    title: 'Detailed Docs',
  },
]
